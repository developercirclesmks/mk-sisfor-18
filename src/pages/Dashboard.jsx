import React, { useEffect, useState } from "react";
import { getAnggota } from "../service/anggotaService";
import { getKegiatan } from "../service/kegiatanService";
import { HiOutlineUser, HiOutlineCalendar, HiOutlinePlus } from "react-icons/hi";

export default function Dashboard() {
  const [totalAnggota, setTotalAnggota] = useState(0);
  const [kegiatanAkanDatang, setKegiatanAkanDatang] = useState(0);
  const [kegiatanSelesai, setKegiatanSelesai] = useState(0);

  useEffect(() => {
    const fetchAnggota = async () => {
      try {
        const anggota = await getAnggota();
        setTotalAnggota(anggota.length);
      } catch (error) {
        console.error("Gagal memuat data anggota:", error);
      }
    };

    const fetchKegiatan = async () => {
      try {
        const kegiatan = await getKegiatan();
        const sekarang = new Date();

        const akanDatang = kegiatan.filter(
          (k) => new Date(k.tanggal) > sekarang
        ).length;
        const selesai = kegiatan.filter(
          (k) => new Date(k.tanggal) <= sekarang
        ).length;

        setKegiatanAkanDatang(akanDatang);
        setKegiatanSelesai(selesai);
      } catch (error) {
        console.error("Gagal memuat data kegiatan:", error);
      }
    };

    fetchAnggota();
    fetchKegiatan();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Statistik */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded-lg flex items-center">
          <HiOutlineUser className="text-4xl mr-4" />
          <div>
            <p className="text-xl font-semibold">{totalAnggota}</p>
            <p>Total Anggota</p>
          </div>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg flex items-center">
          <HiOutlineCalendar className="text-4xl mr-4" />
          <div>
            <p className="text-xl font-semibold">{kegiatanAkanDatang}</p>
            <p>Kegiatan Akan Datang</p>
          </div>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
          <HiOutlineCalendar className="text-4xl mr-4" />
          <div>
            <p className="text-xl font-semibold">{kegiatanSelesai}</p>
            <p>Kegiatan Selesai</p>
          </div>
        </div>
      </div>

      {/* Shortcut */}
      <div className="grid grid-cols-3 gap-6">
        <button className="bg-gray-200 p-4 rounded-lg shadow hover:bg-gray-300 flex items-center justify-center">
          <HiOutlinePlus className="text-2xl mr-2" />
          Tambah Anggota
        </button>
        <button className="bg-gray-200 p-4 rounded-lg shadow hover:bg-gray-300 flex items-center justify-center">
          <HiOutlineCalendar className="text-2xl mr-2" />
          Kelola Agenda
        </button>
        <button className="bg-gray-200 p-4 rounded-lg shadow hover:bg-gray-300 flex items-center justify-center">
          <HiOutlineUser className="text-2xl mr-2" />
          Perbarui Informasi
        </button>
      </div>
    </div>
  );
}