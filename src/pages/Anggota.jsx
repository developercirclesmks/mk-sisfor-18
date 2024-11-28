import React, { useState, useEffect } from 'react';
import { getAnggota, createAnggota, deleteAnggota, editAnggota } from '../service/anggotaService';
import Modal from './component/Modal';
import { HiOutlinePlus, HiTrash, HiPencil, HiDownload } from "react-icons/hi";
import { CSVLink } from 'react-csv';



export default function Anggota() {
    const [anggotaList, setAnggotaList] = useState([]);
    const [anggotaBaru, setAnggotaBaru] = useState("");
    const [jabatanBaru, setJabatanBaru] = useState("");
    const [kontakBaru, setKontakBaru] = useState("");
    const [open, setOpen] = useState(false);
    const [editingAnggota, setEditingAnggota] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    // Ambil data anggota
    useEffect(() => {
        const fetchAnggota = async () => {
            try {
                const data = await getAnggota();
                setAnggotaList(data);
            } catch (error) {
                console.error("Gagal memuat data anggota:", error);
            }
        };
        fetchAnggota();
    }, []);


    // Tambahkan anggota baru
    const handleCreateAnggota = async () => {
        try {
            await createAnggota(anggotaBaru, jabatanBaru, kontakBaru);
            const updatedAnggota = await getAnggota();
            setAnggotaList(updatedAnggota);
            setOpen(false); // Tutup modal setelah berhasil
        } catch (error) {
            console.error("Error saat menambahkan anggota:", error);
        }
    };

    // Hapus anggota
    const handleDeleteAnggota = async (id) => {
        try {
            await deleteAnggota(id);
            setAnggotaList((prev) => prev.filter((anggota) => anggota.id !== id));
        } catch (error) {
            console.error("Error saat menghapus anggota:", error);
        }
    };

    // Edit anggota
    const handleEditAnggota = async () => {
        try {
            await editAnggota(editingAnggota.id, {
                Nama: editingAnggota.Nama,
                Jabatan: editingAnggota.Jabatan,
                Kontak: editingAnggota.Kontak,
            });
            const updatedAnggota = await getAnggota();
            setAnggotaList(updatedAnggota);
            setEditOpen(false); // Tutup modal setelah berhasil
        } catch (error) {
            console.error("Error saat memperbarui anggota:", error);
        }
    };

    // Data untuk CSV
    const csvData = anggotaList.map(anggota => ({
        ID: anggota.id,
        Nama: anggota.Nama,
        Jabatan: anggota.Jabatan,
        Kontak: anggota.Kontak
    }));

    return (
        <div>
            <div className='w-full flex-col items-center p-6 pt-0'>
                <div className="flex justify-between items-center  w-full flex-grow p-6">
                    <h2 className="text-2xl p-2 font-bold">Data anggota</h2>
                    <div className='p-2 flex flex-row gap-4'>

                        {/*button tambah anggota */}
                        <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
                            <HiOutlinePlus onClick={() => setOpen(true)} />
                        </button>

                        {/* button export csv */}
                        <CSVLink
                            data={csvData}
                            filename={"data_anggota.csv"}
                            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                            target="_blank"
                        >
                            <HiDownload />
                        </CSVLink>

                        {/*pop up memasukkan data anggota baru*/}
                        <Modal open={open} onClose={() => setOpen(false)}>
                            <div className='text-slate-900 mx-auto text-2xl font-medium flex justify-center py-2'>
                                Masukkan anggota baru
                            </div>
                            <div className='mt-3 flex flex-col justify-center items-center '>

                                <input
                                    className='border-b-2 border-slate-900 m-4 mx-8 px-4 outline-none'
                                    type="text" placeholder='Nama'
                                    onChange={(event) => setAnggotaBaru(event.target.value)}
                                />

                                <input
                                    className='border-b-2 border-slate-900 m-4 mx-8 px-4 outline-none'
                                    type="text" placeholder='Jabatan'
                                    onChange={(event) => setJabatanBaru(event.target.value)}
                                />

                                <input
                                    className='border-b-2 border-slate-900 my-4 mx-8 px-4 outline-none'
                                    type="text" placeholder='Kontak'
                                    onChange={(event) => setKontakBaru(event.target.value)}
                                />

                                {/*button add anggota*/}
                                <button
                                    className='bg-slate-900 text-white justify-center rounded-lg px-6 py-3'
                                    onClick={handleCreateAnggota}
                                >
                                    Add
                                </button>
                            </div>
                        </Modal>

                    </div>
                </div>

                {/*Tabel data anggota*/}
                <table className="w-full table-auto border-collapse border border-gray-200">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className='border border-gray-200 px-4 py-2'>ID</th>
                            <th className="border border-gray-200 px-4 py-2">Nama Anggota</th>
                            <th className="border border-gray-200 px-4 py-2">Jabatan</th>
                            <th className="border border-gray-200 px-4 py-2">Kontak</th>
                            <th className="border border-gray-200 px-4 py-2">Aksi</th>
                        </tr>
                    </thead>

                    {/* isi data tabel anggota */}
                    <tbody>
                        {anggotaList.map((anggota) => (
                            <tr key={anggota.id} className="text-center text-wrap">
                                <td className="border border-gray-200 px-4 py-2">#{anggota.id}</td>
                                <td className="border border-gray-200 px-4 py-2">{anggota.Nama}</td>
                                <td className="border border-gray-200 px-4 py-2">{anggota.Jabatan}</td>
                                <td className="border border-gray-200 px-4 py-2">{anggota.Kontak}</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    
                                    {/*button edit data anggota */}
                                    <button
                                        className="bg-green-500 p-2 text-white rounded-full mr-3 hover:bg-green-600"
                                        onClick={() => {
                                            setEditingAnggota(anggota);
                                            setEditOpen(true);
                                        }}
                                    >
                                        <HiPencil />
                                    </button>

                                    {/* pop up edit data anggota */}
                                    <Modal open={editOpen} onClose={() => setEditOpen(false)}>
                                        <div className='text-slate-900 mx-auto text-2xl font-medium flex justify-center py-2'>
                                            Edit Anggota
                                        </div>
                                        <div className='mt-3 flex flex-col justify-center items-center'>
                                            
                                            <input
                                                className='border-b-2 border-slate-900 m-4 mx-8 px-4 outline-none'
                                                type="text"
                                                placeholder='Nama'
                                                value={editingAnggota?.Nama || ""}
                                                onChange={(event) =>
                                                    setEditingAnggota({ ...editingAnggota, Nama: event.target.value })}
                                            />

                                            <input
                                                className='border-b-2 border-slate-900 m-4 mx-8 px-4 outline-none'
                                                type="text"
                                                placeholder='Jabatan'
                                                value={editingAnggota?.Jabatan || ""}
                                                onChange={(event) =>
                                                    setEditingAnggota({ ...editingAnggota, Jabatan: event.target.value })}
                                            />

                                            <input
                                                className='border-b-2 border-slate-900 m-4 mx-8 px-4 outline-none'
                                                type="text"
                                                placeholder='Kontak'
                                                value={editingAnggota?.Kontak || ""}
                                                onChange={(event) =>
                                                    setEditingAnggota({ ...editingAnggota, Kontak: event.target.value })}
                                            />
                                            
                                            <button
                                                className='bg-slate-900 text-white justify-center rounded-lg px-6 py-3'
                                                onClick={handleEditAnggota}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </Modal>
                                    <button
                                        className="bg-red-500 p-2 text-white rounded-full hover:bg-red-600"
                                        onClick={() => handleDeleteAnggota(anggota.id)}
                                    >
                                        <HiTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}