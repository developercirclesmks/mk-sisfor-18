import React from 'react';
import { Box, Button, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { HiOutlineX } from 'react-icons/hi';

const CreateUserModal = ({ open, onClose, onSave, newMember, handleInputChange }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
                <DialogTitle className="text-lg font-semibold">
                    Tambah anggota
                </DialogTitle>
                <DialogContent>
                    <div className="mb-4">
                        <TextField
                            label="Nama"
                            name="Nama"
                            value={newMember.Nama}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            label="Jabatan"
                            name="Jabatan"
                            value={newMember.Jabatan}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            label="Angkatan"
                            name="Angkatan"
                            value={newMember.Angkatan}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            label="Kontak"
                            name="Kontak"
                            value={newMember.Kontak}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button
                        onClick={() => onSave(newMember)}
                        color="primary"
                        variant="contained"
                        disabled={!newMember.Nama || !newMember.Jabatan || !newMember.Angkatan || !newMember.Kontak}
                    >
                        Save
                    </Button>
                </DialogActions>
            </div>
        </div>
    );
};

export default CreateUserModal;
