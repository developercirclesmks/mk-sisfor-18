import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../config/firebaseConfig";
import { useParams } from 'react-router-dom';
import { PlusCircle, Edit, Trash } from 'lucide-react';

const AgendaKegiatan = () => {
  const { orgName } = useParams();
  const orgPaths = {
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
  const [zonaWaktu, setZonaWaktu] = useState('WIB'); // Default is WIB
  const storage = getStorage();

  useEffect(() => {
    const fetchAgendas = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, orgPath));
        const agendasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          deskripsi: doc.data().deskripsi || '',
        }));
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

        if (gambarKegiatanURL instanceof File) {
          const storageRefKegiatan = ref(storage, `images/${orgName}/${gambarKegiatanURL.name}`);
          await uploadBytes(storageRefKegiatan, gambarKegiatanURL);
          gambarKegiatanURL = await getDownloadURL(storageRefKegiatan);
        }

        if (gambarPembicaraURL instanceof File) {
          const storageRefPembicara = ref(storage, `images/${orgName}/${gambarPembicaraURL.name}`);
          await uploadBytes(storageRefPembicara, gambarPembicaraURL);
          gambarPembicaraURL = await getDownloadURL(storageRefPembicara);
        }

        const agendaData = { ...currentAgenda, gambarKegiatan: gambarKegiatanURL, gambarPembicara: gambarPembicaraURL };

        if (currentAgenda.id) {
          const agendaRef = doc(db, orgPath, currentAgenda.id);
          await updateDoc(agendaRef, agendaData);
          setAgendas(agendas.map((agenda) => (agenda.id === currentAgenda.id ? { ...agenda, ...agendaData } : agenda)));
        } else {
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

  const columns = useMemo(() => [
    { accessorKey: 'namaKegiatan', header: 'Nama Kegiatan' },
    { accessorKey: 'waktuMulai', header: 'Waktu Mulai' },
    { accessorKey: 'waktuSelesai', header: 'Waktu Selesai' },
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
    { accessorKey: 'status', header: 'Status' },
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
            <PlusCircle className="mr-2" /> Tambah Nama Kegiatan
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
                <label className="block mb-2">Waktu Mulai</label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={currentAgenda.waktuMulai.slice(0, 5)} // extract the time part
                    onChange={(e) => setCurrentAgenda({ ...currentAgenda, waktuMulai: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <select
                    value={zonaWaktu}
                    onChange={(e) => setZonaWaktu(e.target.value)}
                    className="w-[100px] p-2 border rounded"
                  >
                    <option value="WIB">WIB</option>
                    <option value="WITA">WITA</option>
                    <option value="WIT">WIT</option>
                  </select>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Waktu Selesai</label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={currentAgenda.waktuSelesai.slice(0, 5)} // extract the time part
                    onChange={(e) => setCurrentAgenda({ ...currentAgenda, waktuSelesai: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <select
                    value={zonaWaktu}
                    onChange={(e) => setZonaWaktu(e.target.value)}
                    className="w-[100px] p-2 border rounded"
                  >
                    <option value="WIB">WIB</option>
                    <option value="WITA">WITA</option>
                    <option value="WIT">WIT</option>
                  </select>
                </div>
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
                <label className="block mb-2">Nama Kegiatan</label>
                <input
                  type="text"
                  value={currentAgenda.namaKegiatan}
                  onChange={(e) => setCurrentAgenda({ ...currentAgenda, namaKegiatan: e.target.value })}
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
                <input
                  type="file"
                  onChange={handleImageUploadKegiatan}
                  className="w-full p-2 border rounded"
                />
                {imagePreviewKegiatan && (
                  <img src={imagePreviewKegiatan} alt="Preview" className="mt-2 max-h-48 object-cover" />
                )}
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Gambar Pembicara</label>
                <input
                  type="file"
                  onChange={handleImageUploadPembicara}
                  className="w-full p-2 border rounded"
                />
                {imagePreviewPembicara && (
                  <img src={imagePreviewPembicara} alt="Preview" className="mt-2 max-h-48 object-cover" />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Batal
              </button>
              <button
                onClick={handleSaveAgenda}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaKegiatan;
