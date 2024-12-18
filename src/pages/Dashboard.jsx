import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { memPaths } from "./DataAnggota";
import { orgPaths } from "./AgendaKegiatan";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

// Custom Plugin untuk Teks di Tengah
const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    const total = chart.config.options.plugins.customText.total;
    const centerX = chartArea.left + (chartArea.right - chartArea.left) / 2;
    const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;

    ctx.save();
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#333";
    ctx.fillText(`${total}`, centerX, centerY - 10);
    ctx.font = "14px Arial";
    ctx.fillStyle = "#666";
    ctx.fillText("Total", centerX, centerY + 15);
    ctx.restore();
  },
};

const Dashboard = () => {
  const [dataCounts, setDataCounts] = useState({});
  const [agendaCounts, setAgendaCounts] = useState({});
  const [registrationCounts, setRegistrationCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalAgenda, setTotalAgenda] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataCounts = async () => {
      const memberCounts = {};
      let totalMembersCount = 0;

      for (const [key, path] of Object.entries(memPaths)) {
        const snapshot = await getDocs(collection(db, path));
        memberCounts[key] = snapshot.size;
        totalMembersCount += snapshot.size;
      }

      setDataCounts(memberCounts);
      setTotalMembers(totalMembersCount);
    };

    const fetchAgendaCounts = async () => {
      const counts = {};
      const registrations = {};
      let total = 0;

      for (const [key, path] of Object.entries(orgPaths)) {
        const snapshot = await getDocs(collection(db, path));
        let belumTerlaksana = 0;
        let sedangBerlangsung = 0;

        snapshot.forEach((doc) => {
          const { status } = doc.data();
          if (status === "Belum Terlaksana") belumTerlaksana++;
          else if (
            status === "Hanya untuk Anggota" ||
            status === "Open for Registration"
          ) {
            sedangBerlangsung++;
          }
        });

        counts[key] = belumTerlaksana;
        registrations[key] = sedangBerlangsung;
        total += snapshot.size;
      }

      setAgendaCounts(counts);
      setRegistrationCounts(registrations);
      setTotalAgenda(total);
      setLoading(false);
    };

    fetchDataCounts();
    fetchAgendaCounts();
  }, []);

  const generateUniqueColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `hsl(${(i * 360) / count}, 70%, 50%)`;
      colors.push(color);
    }
    return colors;
  };

  const chartOptions = (total) => ({
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
      customText: { total },
    },
  });

  const chartData = {
    labels: Object.keys(dataCounts),
    datasets: [
      {
        data: Object.values(dataCounts),
        backgroundColor: generateUniqueColors(Object.keys(dataCounts).length),
      },
    ],
  };

  const kegiatanBelumTerlaksanaData = {
    labels: Object.keys(agendaCounts),
    datasets: [
      {
        data: Object.values(agendaCounts),
        backgroundColor: generateUniqueColors(Object.keys(agendaCounts).length),
      },
    ],
  };

  const registrationChartData = {
    labels: Object.keys(registrationCounts),
    datasets: [
      {
        data: Object.values(registrationCounts),
        backgroundColor: generateUniqueColors(Object.keys(registrationCounts).length),
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <h2 className="text-lg text-gray-700 mb-6">Selamat datang, Admin.</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-3xl shadow-lg p-4">
          <h3 className="text-lg font-bold mb-2">Tambah Anggota Baru</h3>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => navigate(`/data-anggota/${e.target.value}`)}
          >
            <option value="">Pilih Organisasi</option>
            {Object.keys(memPaths).map((key) => (
              <option key={key} value={key}>{key.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-4">
          <h3 className="text-lg font-bold mb-2">Kelola Agenda Kegiatan</h3>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => navigate(`/agenda-kegiatan/${e.target.value}`)}
          >
            <option value="">Pilih Organisasi</option>
            {Object.keys(orgPaths).map((key) => (
              <option key={key} value={key}>{key.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-center mb-4">Persentase Anggota</h2>
          <Doughnut data={chartData} options={chartOptions(totalMembers)} plugins={[centerTextPlugin]} />
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-center mb-4">Kegiatan Belum Terlaksana</h2>
          <Doughnut data={kegiatanBelumTerlaksanaData} options={chartOptions(totalAgenda)} plugins={[centerTextPlugin]} />
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-center mb-4">Sedang dan Akan Berlangsung</h2>
          <Doughnut data={registrationChartData} options={chartOptions(totalAgenda)} plugins={[centerTextPlugin]} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
