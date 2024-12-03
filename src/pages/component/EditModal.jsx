import React, { useState } from "react";
import { Box, Button, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from '@mui/material';
import { HiOutlineX } from 'react-icons/hi';

const EditModal = ({ member, onClose, onSave }) => {
  const [formData, setFormData] = useState(member);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!member) return null; // jika member kosong, jangan tampilkan modal

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
        <DialogTitle className="text-lg font-semibold flex justify-between items-center">
          <span>Edit Data Anggota</span>
        </DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <TextField
              label="Nama"
              name="Nama"
              value={formData.Nama}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Jabatan"
              name="Jabatan"
              value={formData.Jabatan}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Angkatan"
              name="Angkatan"
              value={formData.Angkatan}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Kontak"
              name="Kontak"
              value={formData.Kontak}
              onChange={handleChange}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Batal</Button>
          <Button
            onClick={() => onSave(formData)}
            color="primary"
            variant="contained"
          >
            Simpan
          </Button>
        </DialogActions>
      </div>
    </div>
  );
};

export default EditModal;
