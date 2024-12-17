import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { orgPaths } from "./DataAnggota"
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Custom Plugin untuk Teks di Tengah
const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
        const { ctx, chartArea, width } = chart;
        const total = chart.config.options.plugins.customText.total;
        const centerX = width / 2;
        const centerY = chartArea.top + chartArea.height / 2;

        ctx.save();
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#333";
        ctx.fillText(`${total} Anggota`, centerX, centerY - 10);
        ctx.font = "normal 14px Arial";
        ctx.fillStyle = "#666";
        ctx.fillText("Total", centerX, centerY + 15);
        ctx.restore();
    },
};

const Dashboard = () => {
    const [dataCounts, setDataCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [totalMembers, setTotalMembers] = useState(0);

    useEffect(() => {
        const fetchDataCounts = async () => {
            try {
                const promises = Object.entries(orgPaths).map(async ([key, path]) => {
                    const snapshot = await getDocs(collection(db, path));
                    return { key, count: snapshot.size };
                });

                const results = await Promise.all(promises);
                const counts = {};
                let total = 0;

                results.forEach(({ key, count }) => {
                    counts[key] = count;
                    total += count;
                });

                setDataCounts(counts);
                setTotalMembers(total);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataCounts();
    }, []);

    const chartData = {
        labels: Object.keys(dataCounts).map((key) => key.toUpperCase()),
        datasets: [
            {
                label: "Jumlah Anggota",
                data: Object.values(dataCounts),
                backgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
                    "#FF9F40", "#E7E9ED", "#76B947", "#8A2BE2", "#DC143C",
                    "#00FA9A", "#FF7F50", "#B56576", "#6D6875", "#F28482",
                ],
                borderWidth: 2,
                hoverOffset: 12,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: { position: "bottom" },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw;
                        const percentage = ((value / totalMembers) * 100).toFixed(1);
                        return `${value} anggota (${percentage}%)`;
                    },
                },
            },
            customText: { total: totalMembers },
        },
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>

            <div className="bg-white rounded-3xl shadow-lg p-6 max-w-md mx-auto">
                <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">Persentase Anggota</h2>
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <Doughnut data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />
                )}
            </div>
        </div>
    );
};

export default Dashboard;