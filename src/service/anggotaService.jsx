// AnggotaService.jsx
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Fungsi untuk mendapatkan semua data anggota
export const getAnggota = async (collectionPath) => {
    try {
        const collRef = collection(db, collectionPath);
        const data = await getDocs(collRef);
        return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
        console.error('Gagal mengambil data anggota:', error);
        throw error;
    }
};

// Fungsi untuk membuat anggota baru
export const createAnggota = async (orgPath, newMember) => {
    try {
        const docRef = await addDoc(collection(db, orgPath), newMember);
        console.log('Dokumen berhasil ditambahkan dengan ID:', docRef.id);
        return docRef.id; // Mengembalikan ID dokumen yang baru dibuat
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan data:', error);
        throw new Error('Gagal menambahkan data anggota');
    }
};

// Fungsi untuk menghapus anggota
export const deleteAnggota = async (collectionPath, id) => {
    try {
        const anggotaDoc = doc(db, collectionPath, id);
        await deleteDoc(anggotaDoc);
        console.log('Anggota berhasil dihapus!');
    } catch (error) {
        console.error('Gagal menghapus anggota:', error);
        throw error;
    }
};

// Fungsi untuk mengedit anggota
export const editAnggota = async (collectionPath, id, updatedData) => {
    try {
        const anggotaDoc = doc(db, collectionPath, id);
        await updateDoc(anggotaDoc, updatedData);
        console.log('Data anggota berhasil diperbarui!');
    } catch (error) {
        console.error('Gagal memperbarui anggota:', error);
        throw error;
    }
};
