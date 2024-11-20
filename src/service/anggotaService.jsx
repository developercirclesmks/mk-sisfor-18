import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from '../config/firebaseConfig';

// Referensi koleksi
const collref = collection(db, "Anggota_organisasi");

// Fungsi untuk menambahkan anggota baru
export const createAnggota = async (nama, jabatan, kontak) => {
    try {
        await addDoc(collref, { Nama: nama, Jabatan: jabatan, Kontak: kontak });
        console.log("Anggota berhasil ditambahkan!");
    } catch (error) {
        console.error("Gagal menambahkan anggota:", error);
        throw error;
    }
};

// Fungsi untuk menghapus anggota
export const deleteAnggota = async (id) => {
    try {
        const anggotaDoc = doc(db, "Anggota_organisasi", id);
        await deleteDoc(anggotaDoc);
        console.log("Anggota berhasil dihapus!");
    } catch (error) {
        console.error("Gagal menghapus anggota:", error);
        throw error;
    }
};

// Fungsi untuk mengedit anggota
export const editAnggota = async (id, updatedData) => {
    try {
        const anggotaDoc = doc(db, "Anggota_organisasi", id);
        await updateDoc(anggotaDoc, updatedData);
        console.log("Data anggota berhasil diperbarui!");
    } catch (error) {
        console.error("Gagal memperbarui anggota:", error);
        throw error;
    }
};

// Fungsi untuk mendapatkan semua data anggota
export const getAnggota = async () => {
    try {
        const data = await getDocs(collref);
        return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
        console.error("Gagal mengambil data anggota:", error);
        throw error;
    }
};