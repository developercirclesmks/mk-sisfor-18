import React from 'react'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {db} from '../api/firebaseConfig';
import { useState, useEffect } from 'react';
import Modal from './component/Modal';
import {
    HiOutlinePlus,
    HiTrash,
    HiPencil,
} from "react-icons/hi";

export default function Anggota() {
    const collref = collection(db, "Anggota_organisasi");
    const [Anggota, setAnggota] = useState([]); // state untuk menyimpan data
    const [AnggotaBaru, setAnggotaBaru] = useState(""); 
    const [JabatanBaru, setJabatanBaru] = useState([""]); 
    const [KontakBaru, setKontakBaru] = useState([""]); 
    const [open, setOpen] = useState(false); // state untuk menampilkan modal
    const [editingAnggota, setEditingAnggota] = useState(null); // state untuk menampilkan data yang sedang diedit
    const [editOpen, setEditOpen] = useState(false); // state untuk menampilkan modal edit

    // fungsi untuk menambahkan data
    const createAnggota = async() => { 
        await addDoc(collref, {Nama : AnggotaBaru, Jabatan : JabatanBaru, Kontak : KontakBaru});    
    };

    // fungsi untuk menghapus data
    const deleteAnggota = async(id) => {
        const AnggotaDoc = doc(db, "Anggota_organisasi", id);
        await deleteDoc(AnggotaDoc)
    }

    // fungsi untuk mengupdate data
    const openEditModal = (anggota) => {
        setEditingAnggota(anggota);
        setEditOpen(true);
    };


    const editAnggota = async (id, updatedData) => {
        try {
            const anggotaDoc = doc(db, "Anggota_organisasi", id);
            await updateDoc(anggotaDoc, updatedData);
            console.log("Data berhasil diperbarui!");
            setAnggota((prev) =>
                prev.map((anggota) =>
                    anggota.id === id ? { ...anggota, ...updatedData } : anggota
                )
            );
        } catch (error) {
            console.error("Error saat memperbarui data: ", error);
        }
    };

    // fungsi untuk menampilkan data
    useEffect(() => {
        const getAnggota = async () => {
            const data = await getDocs(collref);

            setAnggota(data.docs.map((doc) => ({ ...doc.data(), id: doc.id
            })));
        };
        getAnggota();
    }, [collref]);

  return (
    <div>
        <div className='w-full flex-grow p-6'>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl p-2 font-bold">Data anggota</h2>
                <div className='p-2'>

                    {/*button tambah anggota baru*/}
                    <button className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
                        <HiOutlinePlus onClick={() => setOpen(true)} />

                    </button>
                    {/*pop up menambah anggota baru*/}
                    <Modal open={open} onClose={() => setOpen(false)}>
                        <div className='text-slate-900 mx-auto text-2xl font-medium flex justify-center py-2'>
                            Masukkan anggota baru
                        </div>
                        <div className='mt-3 flex flex-col justify-center items-center '>
                            <input
                            className='border-b-2 border-slate-900 m-4 mx-8 px-4 outline-none'
                            type="text" placeholder='Nama' onChange=
                            {(event) => {
                                setAnggotaBaru(event.target.value)
                            }}/>
                            <input
                            className='border-b-2 border-slate-900 m-4 mx-8 px-4 outline-none'
                            type="text" placeholder='Jabatan' onChange=
                            {(event) => {
                                setJabatanBaru(event.target.value)
                            }}/>
                            <input
                            className='border-b-2 border-slate-900 my-4 mx-8 px-4 outline-none'
                            type="text" placeholder='Kontak' onChange=
                            {(event) => {
                                setKontakBaru(event.target.value)
                            }}/>
                            <button className='bg-slate-900 text-white justify-center rounded-lg px-6 py-3 ' onClick={createAnggota}>
                            Add
                        </button>
                        </div>
                    </Modal>

                </div>
            </div>

            {/*tabel data anggota*/}
            <table className="w-full table-auto border-collapse border border-gray-200">
                {/*header tabel*/}
                <thead className="bg-gray-100">
                    <tr>
                        <th className='border border-gray-200 px-4 py-2'>ID</th>
                        <th className="border border-gray-200 px-4 py-2">Nama Anggota</th>
                        <th className="border border-gray-200 px-4 py-2">Jabatan</th>
                        <th className="border border-gray-200 px-4 py-2">Kontak</th>
                        <th className="border border-gray-200 px-4 py-2">Aksi</th>
                    </tr>
                </thead>
                {/*isi tabel*/}
                <tbody>
                    {Anggota.map((Anggota) => (
                        <tr key={Anggota.id} className="text-center">
                            <td className="border border-gray-200 px-4 py-2">#{Anggota.id}</td>
                            <td className="border border-gray-200 px-4 py-2">{Anggota.Nama}</td>
                            <td className="border border-gray-200 px-4 py-2">{Anggota.Jabatan}</td>
                            <td className="border border-gray-200 px-4 py-2">{Anggota.Kontak}</td>
                            <td className="border border-gray-200 px-4 py-2">

                                {/*button edit*/}
                                <button className="bg-green-500 p-2 text-white rounded-full mr-3 hover:bg-green-600">
                                    <HiPencil onClick={() => openEditModal(Anggota)} /> 
                                </button>
                                {/*pop up mengedit data*/}
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
                                            className='border-b-2 border-slate-900 my-4 mx-8 px-4 outline-none'
                                            type="text"
                                            placeholder='Kontak'
                                            value={editingAnggota?.Kontak || ""}
                                            onChange={(event) =>
                                                setEditingAnggota({ ...editingAnggota, Kontak: event.target.value })}
                                        />
                                        <button
                                            className='bg-slate-900 text-white justify-center rounded-lg px-6 py-3'
                                            onClick={() => {
                                                editAnggota(editingAnggota.id, {
                                                    Nama: editingAnggota.Nama,
                                                    Jabatan: editingAnggota.Jabatan,
                                                    Kontak: editingAnggota.Kontak
                                                });
                                                setEditOpen(false); // Tutup modal setelah edit
                                            }}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    </Modal>
                        
                                {/*button delete*/}
                                <button className="bg-red-500 p-2 text-white rounded-full hover:bg-red-600">
                                    <HiTrash onClick={() => deleteAnggota(Anggota.id)} /> 
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}