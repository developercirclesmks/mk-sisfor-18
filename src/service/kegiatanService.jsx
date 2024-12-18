import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
  } from 'firebase/firestore';
  import { db } from '../config/firebaseConfig';
  
  // Fungsi untuk mendapatkan semua data agenda
  export const getAgenda = async (collectionPath) => {
    try {
      const collRef = collection(db, collectionPath);
      const data = await getDocs(collRef);
      return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      console.error('Gagal mengambil data agenda:', error);
      throw error;
    }
  };
  
  // Fungsi untuk membuat agenda baru
  export const createAgenda = async (orgPath, newAgenda) => {
    try {
      const docRef = await addDoc(collection(db, orgPath), newAgenda);
      console.log('Agenda berhasil ditambahkan dengan ID:', docRef.id);
      return docRef.id; // Mengembalikan ID dokumen yang baru dibuat
    } catch (error) {
      console.error('Terjadi kesalahan saat menambahkan agenda:', error);
      throw new Error('Gagal menambahkan data agenda');
    }
  };
  
  // Fungsi untuk menghapus agenda
  export const deleteAgenda = async (collectionPath, id) => {
    try {
      const agendaDoc = doc(db, collectionPath, id);
      await deleteDoc(agendaDoc);
      console.log('Agenda berhasil dihapus!');
    } catch (error) {
      console.error('Gagal menghapus agenda:', error);
      throw error;
    }
  };
  
  // Fungsi untuk mengedit agenda
  export const editAgenda = async (collectionPath, id, updatedData) => {
    try {
      const agendaDoc = doc(db, collectionPath, id);
      await updateDoc(agendaDoc, updatedData);
      console.log('Data agenda berhasil diperbarui!');
    } catch (error) {
      console.error('Gagal memperbarui agenda:', error);
      throw error;
    }
  };  