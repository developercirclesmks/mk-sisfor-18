import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useParams } from "react-router-dom";

const AgendaKegiatan = () => {
    const { orgName } = useParams();
    
    // Map orgName ke path collection di Firestore
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

    const orgPath = orgPaths[orgName]; // Path Firestore berdasarkan orgName
    const [agenda, setAgenda] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orgPath) {
            console.error("Path organisasi tidak ditemukan!");
            return;
        }

        const fetchAgenda = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, orgPath));
                const agendaData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAgenda(agendaData);
                console.log("Data agenda berhasil diambil:", agendaData); // Debug log
            } catch (error) {
                console.error("Error fetching agenda:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgenda();
    }, [orgPath]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Agenda Kegiatan</h1>
            {loading ? (
                <p>Memuat data agenda...</p>
            ) : (
                <p>{agenda.length > 0 ? "Data agenda berhasil diambil dari Firestore. selamat mengerjakan ol" : "Tidak ada data agenda yang ditemukan."}</p>
            )}
        </div>
    );
};

export default AgendaKegiatan;
