import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useParams } from "react-router-dom";

const StrukturOrganisasi = () => {
    const { orgName } = useParams();
    
    // Map orgName ke path collection di Firestore
    const orgPaths = {
        "hma-ftuh": "Organisasi_mahasiswa/HMA-FTUH/Struktur_organisasi",
        "hms-ftuh": "Organisasi_mahasiswa/HMS-FTUH/Struktur_organisasi",
        "hmdp-ftuh": "Organisasi_mahasiswa/HMDP-FTUH/Struktur_organisasi",
        "hme-ftuh": "Organisasi_mahasiswa/HME-FTUH/Struktur_organisasi",
        "hmm-ftuh": "Organisasi_mahasiswa/HMM-FTUH/Struktur_organisasi",
        "hmtk-ftuh": "Organisasi_mahasiswa/HMTK-FTUH/Struktur_organisasi",
        "hmg-ftuh": "Organisasi_mahasiswa/HMG-FTUH/Struktur_organisasi",
        "hmti-ftuh": "Organisasi_mahasiswa/HMTI-FTUH/Struktur_organisasi",
        "hmtl-ftuh": "Organisasi_mahasiswa/HMTL-FTUH/Struktur_organisasi",
        "okif-ftuh": "Organisasi_mahasiswa/OKIF-FTUH/Struktur_organisasi",
        "oksp-ftuh": "Organisasi_mahasiswa/OKSP-FTUH/Struktur_organisasi",
        "permata-ftuh": "Organisasi_mahasiswa/PERMATA-FTUH/Struktur_organisasi",
    };

    const orgPath = orgPaths[orgName]; // Path Firestore berdasarkan orgName
    const [struktur, setStruktur] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orgPath) {
            console.error("Path organisasi tidak ditemukan!");
            return;
        }

        const fetchStruktur = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, orgPath));
                const strukturData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setStruktur(strukturData);
                console.log("Data struktur berhasil diambil:", strukturData); // Debug log
            } catch (error) {
                console.error("Error fetching struktur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStruktur();
    }, [orgPath]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Struktur organisasi</h1>
            {loading ? (
                <p>Memuat data struktur organisasi...</p>
            ) : (
                <p>{struktur.length > 0 ? "Data struktur berhasil diambil dari Firestore. selamat mengerjakan ol" : "Tidak ada data struktur yang ditemukan."}</p>
            )}
        </div>
    );
};

export default StrukturOrganisasi;