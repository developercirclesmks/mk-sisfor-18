import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
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
    agenda: '',
    waktuMulai: '',
    waktuSelesai: '',
    lokasi: '',
    gambar: '',
    status: 'belum terlaksana',
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchAgendas = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, orgPath));
        const agendasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
        if (currentAgenda.id) {
          const agendaRef = doc(db, orgPath, currentAgenda.id);
          await updateDoc(agendaRef, { ...currentAgenda });
          setAgendas(agendas.map((agenda) => (agenda.id === currentAgenda.id ? currentAgenda : agenda)));
        } else {
          const newAgenda = await addDoc(collection(db, orgPath), { ...currentAgenda });
          setAgendas([...agendas, { ...currentAgenda, id: newAgenda.id }]);
        }
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error saving agenda:", error);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setCurrentAgenda({ ...currentAgenda, gambar: file });
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
    { accessorKey: 'agenda', header: 'Agenda' },
    { accessorKey: 'waktuMulai', header: 'Waktu Mulai' },
    { accessorKey: 'waktuSelesai', header: 'Waktu Selesai' },
    { accessorKey: 'lokasi', header: 'Lokasi' },
    {
      accessorKey: 'gambar',
      header: 'Gambar',
      Cell: ({ cell }) => (
        cell.getValue() ? <img src={cell.getValue()} alt="Agenda" className="h-16 w-16 object-cover" /> : 'Tidak ada gambar'
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
              setImagePreview(row.original.gambar || '');
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
            <PlusCircle className="mr-2" /> Tambah Agenda
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
            <h3 className="text-xl font-semibold mb-4">{currentAgenda.id ? "Edit Agenda" : "Tambah Agenda Baru"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block mb-2">Waktu Mulai</label>
                <input
                  type="datetime-local"
                  value={currentAgenda.waktuMulai}
                  onChange={(e) => setCurrentAgenda({ ...currentAgenda, waktuMulai: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Waktu Selesai</label>
                <input
                  type="datetime-local"
                  value={currentAgenda.waktuSelesai}
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
                <label className="block mb-2">Agenda</label>
                <input
                  type="text"
                  value={currentAgenda.agenda}
                  onChange={(e) => setCurrentAgenda({ ...currentAgenda, agenda: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded"
                />
                {imagePreview && (
                  <div className="mt-2 flex items-center gap-4">
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded" />
                    <button
                      onClick={() => setImagePreview('')}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2">
                <label className="block mb-2">Status</label>
                <select
                  value={currentAgenda.status}
                  onChange={(e) => setCurrentAgenda({ ...currentAgenda, status: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="Belum Terlaksana">Belum Terlaksana</option>
                  <option value="Sudah Terlaksana">Sudah Terlaksana</option>
                  <option value="Selesai">Selesai</option>
                </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleSaveAgenda}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
