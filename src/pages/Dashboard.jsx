import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [dataCounts, setDataCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataCounts = async () => {
            try {
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

                const counts = {};
                for (const [key, path] of Object.entries(orgPaths)) {
                    const querySnapshot = await getDocs(collection(db, path));
                    counts[key] = querySnapshot.size;
                }

                setDataCounts(counts);
            } catch (error) {
                console.error("Error fetching data counts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataCounts();
    }, []);

    const isDataReady = Object.keys(dataCounts).length > 0;

    const chartData = {
        labels: Object.keys(dataCounts),
        datasets: [
            {
                label: "Jumlah Anggota",
                data: Object.values(dataCounts),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#E7E9ED",
                    "#76B947",
                    "#8A2BE2",
                    "#DC143C",
                    "#00FA9A",
                    "#FF7F50",
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#E7E9ED",
                    "#76B947",
                    "#8A2BE2",
                    "#DC143C",
                    "#00FA9A",
                    "#FF7F50",
                ],
            },
        ],
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {loading ? (
                <p>Loading data...</p>
            ) : isDataReady ? (
                <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                    <Doughnut data={chartData} />
                </div>
            ) : (
                <p>No data available to display.</p>
            )}
        </div>
    );
};

export default Dashboard;