import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from "../config/firebaseConfig";
import { useParams } from 'react-router-dom';
import { PlusCircle, Edit, Trash } from 'lucide-react';

export const orgPaths = {
  "hma-ftuh": "Organisasi_mahasiswa/HMA-FTUH/Agenda_kegiatan",
  "hms-ftuh": "Organisasi_mahasiswa/HMS-FTUH/Agenda_kegiatan",
  "hmdp-ftuh": "Organisasi_mahasiswa/HMDP-FTUH/Agenda_kegiatan",
  "hme-ftuh": "Organisasi_mahasiswa/HME-FTUH/Agenda_kegiatan",
  "hmm-ftuh": "Organisasi_mahasiswa/HMM-FTUH/Agenda_kegiatan",
  "hmtk-ftuh": "Organisasi_mahasiswa/HMTK-FTUH/Agenda_kegiatan",
  "hmg-ftuh": "Organisasi_mahasiswa/HMG-FTUH/Agenda_kegiatan",
  "hmti-ftuh": "Organisasi_mahasiswa/HMTI-FTUH/Agenda_kegiatan",
  "hmtl-ftuh": "Organisasi_mahasiswa/HMTL-FTUH/Agenda_kegiatan",
  "okif-ftuh": "Organisasi_mahasiswa/OKIF-FTUH/Agenda_kegiatan",
  "oksp-ftuh": "Organisasi_mahasiswa/OKSP-FTUH/Agenda_kegiatan",
  "permata-ftuh": "Organisasi_mahasiswa/PERMATA-FTUH/Agenda_kegiatan",
};

const AgendaKegiatan = () => {
  const { orgName } = useParams();

  const orgPath = orgPaths[orgName];
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAgenda, setCurrentAgenda] = useState({
    namaKegiatan: '',
    waktuMulai: '',
    waktuSelesai: '',
    lokasi: '',
    gambarKegiatan: '',
    gambarPembicara: '',
    status: 'Belum Terlaksana',
    deskripsi: '',
  });
  const [imagePreviewKegiatan, setImagePreviewKegiatan] = useState('');
  const [imagePreviewPembicara, setImagePreviewPembicara] = useState('');
  const [zonaWaktu, setZonaWaktu] = useState('WIB');
  const storage = getStorage();

  useEffect(() => {
    const fetchAgendas = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, orgPath));
        const agendasData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            deskripsi: data.deskripsi || '',
            waktuMulai: data.waktuMulai ? new Date(data.waktuMulai.seconds * 1000).toISOString().slice(0, 16) : '',
            waktuSelesai: data.waktuSelesai ? new Date(data.waktuSelesai.seconds * 1000).toISOString().slice(0, 16) : '',
          };
        });
        setAgendas(agendasData);
      } catch (error) {
        console.error("Error fetching agendas:", error);
      } finally {
        setLoading(false);
      }
    };
    if (orgPath) fetchAgendas();
  }, [orgPath]);

  const handleSaveAgenda = async () => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menyimpan perubahan ini?");
    if (confirmed) {
      try {
        let gambarKegiatanURL = currentAgenda.gambarKegiatan;
        let gambarPembicaraURL = currentAgenda.gambarPembicara;
  
        // Handle upload or deletion of images only if there's a change
        if (gambarKegiatanURL instanceof File) {
          const storageRefKegiatan = ref(storage, 'images/${orgName}/${gambarKegiatanURL.name}');
          await uploadBytes(storageRefKegiatan, gambarKegiatanURL);
          gambarKegiatanURL = await getDownloadURL(storageRefKegiatan);
        } else if (gambarKegiatanURL === null) {
          // Handle deletion of image
          const storageRefKegiatan = ref(storage, currentAgenda.gambarKegiatan);
          await deleteObject(storageRefKegiatan); // Delete the old image
          gambarKegiatanURL = ''; // Clear the value if image is deleted
        }
  
        if (gambarPembicaraURL instanceof File) {
          const storageRefPembicara = ref(storage, 'images/${orgName}/${gambarPembicaraURL.name}');
          await uploadBytes(storageRefPembicara, gambarPembicaraURL);
          gambarPembicaraURL = await getDownloadURL(storageRefPembicara);
        } else if (gambarPembicaraURL === null) {
          // Handle deletion of image
          const storageRefPembicara = ref(storage, currentAgenda.gambarPembicara);
          await deleteObject(storageRefPembicara); // Delete the old image
          gambarPembicaraURL = ''; // Clear the value if image is deleted
        }
  
        // Convert waktuMulai and waktuSelesai to Firestore Timestamps
        const waktuMulaiTimestamp = currentAgenda.waktuMulai ? Timestamp.fromDate(new Date(currentAgenda.waktuMulai)) : null;
        const waktuSelesaiTimestamp = currentAgenda.waktuSelesai ? Timestamp.fromDate(new Date(currentAgenda.waktuSelesai)) : null;
  
        // Create a new agenda data object, only updating changed fields
        const agendaData = { 
          ...currentAgenda, 
          gambarKegiatan: gambarKegiatanURL || currentAgenda.gambarKegiatan, 
          gambarPembicara: gambarPembicaraURL || currentAgenda.gambarPembicara,
          waktuMulai: waktuMulaiTimestamp, // Store timestamp in Firestore
          waktuSelesai: waktuSelesaiTimestamp, // Store timestamp in Firestore
        };
  
        if (currentAgenda.id) {
          // Update existing agenda in Firestore if the agenda already has an ID
          const agendaRef = doc(db, orgPath, currentAgenda.id);
          await updateDoc(agendaRef, agendaData);
          setAgendas(agendas.map((agenda) => (agenda.id === currentAgenda.id ? { ...agenda, ...agendaData } : agenda)));
        } else {
          // Add new agenda if it's a new agenda
          const newAgenda = await addDoc(collection(db, orgPath), agendaData);
          setAgendas([...agendas, { ...agendaData, id: newAgenda.id }]);
        }
  
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error saving agenda:", error);
      }
    }
  };  
  const handleImageUploadKegiatan = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreviewKegiatan(URL.createObjectURL(file));
      setCurrentAgenda({ ...currentAgenda, gambarKegiatan: file });
    }
  };

  const handleImageUploadPembicara = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreviewPembicara(URL.createObjectURL(file));
      setCurrentAgenda({ ...currentAgenda, gambarPembicara: file });
    }
  };

  const handleDeleteAgenda = async (id) => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus agenda ini?");
    if (confirmed) {
      try {
        const agendaRef = doc(db, orgPath, id);
        await deleteDoc(agendaRef);
        setAgendas(agendas.filter((agenda) => agenda.id !== id));
      } catch (error) {
        console.error("Error deleting agenda:", error);
      }
    }
  };

  const handleDeleteImageKegiatan = async () => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus gambar kegiatan ini?");
    if (confirmed) {
      try {
        const storageRefKegiatan = ref(storage, currentAgenda.gambarKegiatan);
        await deleteObject(storageRefKegiatan); // Delete the old image
        setCurrentAgenda({ ...currentAgenda, gambarKegiatan: null });
        setImagePreviewKegiatan('');
      } catch (error) {
        console.error("Error deleting gambar kegiatan:", error);
      }
    }
  };

  const handleDeleteImagePembicara = async () => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus gambar pembicara ini?");
    if (confirmed) {
      try {
        const storageRefPembicara = ref(storage, currentAgenda.gambarPembicara);
        await deleteObject(storageRefPembicara); // Delete the old image
        setCurrentAgenda({ ...currentAgenda, gambarPembicara: null });
        setImagePreviewPembicara('');
      } catch (error) {
        console.error("Error deleting gambar pembicara:", error);
      }
    }
  };

  const columns = useMemo(() => [
    { accessorKey: 'namaKegiatan', header: 'Nama Kegiatan' },
    {
      accessorKey: 'waktuMulai',
      header: 'Waktu Mulai',
      Cell: ({ cell }) => {
        return cell.getValue() || 'Tidak ada waktu';
      }
    },
    {
      accessorKey: 'waktuSelesai',
      header: 'Waktu Selesai',
      Cell: ({ cell }) => {
        return cell.getValue() || 'Tidak ada waktu';
      }
    },
    { accessorKey: 'lokasi', header: 'Lokasi' },
    {
      accessorKey: 'deskripsi',
      header: 'Deskripsi',
      Cell: ({ cell }) => (
        <div className="truncate max-w-[200px]" title={cell.getValue()}>
          {cell.getValue() || 'Tidak ada deskripsi'}
        </div>
      ),
    },
    {
      accessorKey: 'gambarKegiatan',
      header: 'Gambar Kegiatan',
      Cell: ({ cell }) => (
        cell.getValue() ? <img src={cell.getValue()} alt="Gambar Kegiatan" className="h-16 w-16 object-cover" /> : 'Tidak ada gambar'
      ),
    },
    {
      accessorKey: 'gambarPembicara',
      header: 'Gambar Pembicara',
      Cell: ({ cell }) => (
        cell.getValue() ? <img src={cell.getValue()} alt="Gambar Pembicara" className="h-16 w-16 object-cover" /> : 'Tidak ada gambar'
      ),
    },
    { accessorKey: 'status', header: 'Status', 
      Cell: ({ cell }) => {
        const status = cell.getValue();
        let statusLabel = '';
        switch (status) {
          case 'Open for Registration':
            statusLabel = <span className="text-green-500">Open for Registration</span>;
            break;
          case 'Hanya untuk Anggota':
            statusLabel = <span className="text-blue-500">Hanya untuk Anggota</span>;
            break;
          default:
            statusLabel = <span className="text-gray-500">Belum Terlaksana</span>;
            break;
        }
        return statusLabel;
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCurrentAgenda(row.original);
              setImagePreviewKegiatan(row.original.gambarKegiatan || '');
              setImagePreviewPembicara(row.original.gambarPembicara || '');
              setIsModalOpen(true);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDeleteAgenda(row.original.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ], [agendas]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Agenda Kegiatan</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            <PlusCircle className="mr-2" /> Tambah Kegiatan
          </button>
        </div>
        <MaterialReactTable
          columns={columns}
          data={agendas}
          enableRowActions={false}
          muiTableContainerProps={{ style: { zIndex: 1 } }}
          loading={loading}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-50">
            <h3 className="text-xl font-semibold mb-4">{currentAgenda.id ? "Edit Nama Kegiatan" : "Tambah Nama Kegiatan Baru"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                  <label className="block mb-2">Nama Kegiatan</label>
                  <input
                    type="text"
                    value={currentAgenda.namaKegiatan}
                    onChange={(e) => setCurrentAgenda({ ...currentAgenda, namaKegiatan: e.target.value })}
                    className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Waktu Mulai</label>
                <input
                  type="datetime-local"
                  value={currentAgenda.waktuMulai || ''}
                  onChange={(e) => setCurrentAgenda({ ...currentAgenda, waktuMulai: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Waktu Selesai</label>
                <input
                  type="datetime-local"
                  value={currentAgenda.waktuSelesai || ''}
                  onChange={(e) => setCurrentAgenda({ ...currentAgenda, waktuSelesai: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Lokasi</label>
                <input
                  type="text"
                  value={currentAgenda.lokasi}
                  onChange={(e) => setCurrentAgenda({ ...currentAgenda, lokasi: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Deskripsi</label>
                <textarea
                  value={currentAgenda.deskripsi}
                  onChange={(e) => setCurrentAgenda({ ...currentAgenda, deskripsi: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
              <label className="block mb-2">Gambar Kegiatan</label>
              {imagePreviewKegiatan ? (
                <img src={imagePreviewKegiatan} alt="Preview" className="w-24 h-24 object-cover" />
              ) : (
                currentAgenda.gambarKegiatan && (
                  <img
                    src={currentAgenda.gambarKegiatan}
                    alt="Gambar Kegiatan"
                    className="w-24 h-24 object-cover"
                  />
                )
              )}
              <input
                type="file"
                onChange={handleImageUploadKegiatan}
                className="w-full p-2 border rounded"
              />
              {(currentAgenda.gambarKegiatan || imagePreviewKegiatan) && (
                <div className="mt-2">
                  <button
                    onClick={handleDeleteImageKegiatan}
                    className="text-red-500 hover:text-red-700"
                  >
                    Hapus Gambar
                  </button>
                </div>
              )}
            </div>

            <div className="col-span-2">
              <label className="block mb-2">Gambar Pembicara</label>
              {imagePreviewPembicara ? (
                <img src={imagePreviewPembicara} alt="Preview Pembicara" className="w-24 h-24 object-cover" />
              ) : (
                currentAgenda.gambarPembicara && (
                  <img
                    src={currentAgenda.gambarPembicara}
                    alt="Gambar Pembicara"
                    className="w-24 h-24 object-cover"
                  />
                )
              )}
              <input
                type="file"
                onChange={handleImageUploadPembicara}
                className="w-full p-2 border rounded"
              />
              {(currentAgenda.gambarPembicara || imagePreviewPembicara) && (
                <div className="mt-2">
                  <button
                    onClick={handleDeleteImagePembicara}
                    className="text-red-500 hover:text-red-700"
                  >
                    Hapus Gambar
                  </button>
                </div>
              )}
            </div>


              <div className="col-span-2">
                <label className="block mb-2">Status</label>
                <select
                  value={currentAgenda.status}
                  onChange={(e) => setCurrentAgenda({ ...currentAgenda, status: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="Belum Terlaksana">Belum Terlaksana</option>
                  <option value="Open for Registration">Open for Registration</option>
                  <option value="Hanya untuk Anggota">Hanya untuk Anggota</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Batal
              </button>
              <button
                onClick={handleSaveAgenda}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                {currentAgenda.id ? 'Simpan Perubahan' : 'Tambah Agenda'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaKegiatan;