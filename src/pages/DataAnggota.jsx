import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useParams } from "react-router-dom";
import { deleteAnggota, editAnggota, createAnggota } from "../../src/service/anggotaService";
import EditModal from "./component/EditModal";
import ConfirmDialog from "./component/ConfirmDialog";
import CreateUserModal from "./component/CreateUserModal";
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Map orgName ke path collection di firestoreku
export const orgPaths = {
    "hma-ftuh": "Organisasi_mahasiswa/HMA-FTUH/Anggota_organisasi",
    "hms-ftuh": "Organisasi_mahasiswa/HMS-FTUH/Anggota_organisasi",
    "hmdp-ftuh": "Organisasi_mahasiswa/HMDP-FTUH/Anggota_organisasi",
    "hme-ftuh": "Organisasi_mahasiswa/HME-FTUH/Anggota_organisasi",
    "hmm-ftuh": "Organisasi_mahasiswa/HMM-FTUH/Anggota_organisasi",
    "hmtk-ftuh": "Organisasi_mahasiswa/HMTK-FTUH/Anggota_organisasi",
    "hmg-ftuh": "Organisasi_mahasiswa/HMG-FTUH/Anggota_organisasi",
    "hmti-ftuh": "Organisasi_mahasiswa/HMTI-FTUH/Anggota_organisasi",
    "hmtl-ftuh": "Organisasi_mahasiswa/HMTL-FTUH/Anggota_organisasi",
    "okif-ftuh": "Organisasi_mahasiswa/OKIF-FTUH/Anggota_organisasi",
    "oksp-ftuh": "Organisasi_mahasiswa/OKSP-FTUH/Anggota_organisasi",
    "permata-ftuh": "Organisasi_mahasiswa/PERMATA-FTUH/Anggota_organisasi",
};

const DataAnggota = () => {
    const { orgName } = useParams();
    const orgPath = orgPaths[orgName];
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, memberId: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMember, setNewMember] = useState({
        Nama: '',
        Jabatan: '',
        Angkatan: '',
        Kontak: '',
    });

    useEffect(() => {
        if (!orgPath) {
            console.error("Path organisasi tidak ditemukan!");
            return;
        }

        const fetchMembers = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, orgPath));
                const membersData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMembers(membersData);
            } catch (error) {
                console.error("Error fetching members:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [orgPath]);

    const handleEdit = (member) => setEditingMember(member);

    const handleSave = async (updatedMember) => {
        try {
            await editAnggota(orgPath, updatedMember.id, updatedMember);
            setMembers(members.map((m) => (m.id === updatedMember.id ? updatedMember : m)));
            setEditingMember(null);
        } catch (error) {
            console.error("Gagal memperbarui data anggota:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAnggota(orgPath, id);
            setMembers(members.filter((m) => m.id !== id));
            setConfirmDialog({ isOpen: false, memberId: null });
        } catch (error) {
            console.error("Gagal menghapus anggota:", error);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewMember({
            Nama: '',
            Jabatan: '',
            Angkatan: '',
            Kontak: '',
        });
    };

    const handleSaveUser = async () => {
        try {
            // Buat objek baru anggota dari state newMember
            const newUser = {
                ...newMember,
            };
            
            // Simpan data ke Firestore menggunakan service createAnggota
            await createAnggota(orgPath, newUser);
            
            // Tambahkan data anggota yang baru ke dalam state members
            setMembers([...members, newUser]);
            
            // Reset form dan tutup modal
            setIsModalOpen(false);
            setNewMember({
                Nama: '',
                Jabatan: '',
                Angkatan: '',
                Kontak: '',
            });
        } catch (error) {
            console.error("Gagal menyimpan data anggota:", error);
        }
    };
    

    const handleInputChange = (e) => {
        setNewMember({
            ...newMember,
            [e.target.name]: e.target.value,
        });
    };

    const columns = useMemo(
        () => [
            { accessorKey: 'id', header: 'ID' },
            { accessorKey: 'Nama', header: 'Nama' },
            { accessorKey: 'Jabatan', header: 'Jabatan' },
            { accessorKey: 'Angkatan', header: 'Angkatan' },
            { accessorKey: 'Kontak', header: 'Kontak' },

        ],
        []
    );

    if (loading) return <p>Loading...</p>;
    if (!orgPath) return <p>Organisasi tidak ditemukan!</p>;

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <span className="text-lg font-bold pt-2 items-center">Data Anggota {orgName?.toUpperCase()}</span>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded shadow-md"
                        onClick={handleOpenModal}
                    >
                        Tambah anggota
                    </button>
            </div>
            <MaterialReactTable 
                columns={columns} 
                data={members} 
                enableEditing
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip title="Edit">
                            <IconButton onClick={() => handleEdit(row.original)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton color="error" onClick={() => setConfirmDialog({ isOpen: true, memberId: row.original.id })}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            />
            <CreateUserModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveUser}
                newMember={newMember}
                handleInputChange={handleInputChange}
            />
            {editingMember && (
                <EditModal
                    member={editingMember}
                    onClose={() => setEditingMember(null)}
                    onSave={handleSave}
                />
            )}
            {confirmDialog.isOpen && (
                <ConfirmDialog
                    open={confirmDialog.isOpen}
                    onClose={() => setConfirmDialog({ isOpen: false, memberId: null })}
                    onConfirm={() => handleDelete(confirmDialog.memberId)}
                />
            )}
        </div>
    );
};

export default DataAnggota;