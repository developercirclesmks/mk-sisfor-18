import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmDialog = ({ onConfirm, onClose, open }) => {
  if (!open) return null; // Pastikan dialog hanya muncul jika open true

  return (
    <Dialog open={open} onClose={onClose}>
        
      <DialogTitle>Hapus Data</DialogTitle>

      <DialogContent>
        <p>Apakah Anda yakin ingin menghapus data ini?</p>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
            Batal
        </Button>

        <Button onClick={onConfirm} color="error" variant="contained">
          Hapus
        </Button>

      </DialogActions>
      
    </Dialog>
  );
};

export default ConfirmDialog;
