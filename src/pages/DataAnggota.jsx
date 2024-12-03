import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useParams } from "react-router-dom";

const DataAnggota = () => {
  const { orgName } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map orgName ke path collection di firestoreku
  const orgPaths = {
    "hma-ftuh": "Organisasi_mahasiswa/HMA-FTUH/Anggota_organisasi",
    "hms-ftuh": "Organisasi_mahasiswa/HMS-FTUH/Anggota_organisasi",
    "hmdp-ftuh": "Organisasi_mahasiswa/HMDP-FTUH/Anggota_organisasi",
    "hme-ftuh": "Organisasi_mahasiswa/HME-FTUH/Anggota_organisasi",
    "hmm-ftuh": "Organisasi_mahasiswa/HMM-FTUH/Anggota_organisasi",
    "hmtk-ftuh": "Organisasi_mahasiswa/HMTK-FTUH/Anggota_organisasi",
    "hmg-ftuh": "Organisasi_mahasiswa/HMG-FTUH/Anggota_organisasi",
    "hmti-ftuh": "Organisasi_mahasiswa/HMTI-FTUH/Anggota_organisasi",
    "hmtl-ftuh": "Organisasi_mahasiswa/HMTL-FTUH/Anggota_organisasi",
    "okif-ftuh": "Organisasi_mahasiswa/OKIF-FTUH/Anggota_organisasi",
    "oksp-ftuh": "Organisasi_mahasiswa/OKSP-FTUH/Anggota_organisasi",
    "permata-ftuh": "Organisasi_mahasiswa/PERMATA-FTUH/Anggota_organisasi",
  };

  const orgPath = orgPaths[orgName];

  useEffect(() => {
    if (!orgPath) {
      console.error("Path organisasi tidak ditemukan!");
      return;
    }

    const fetchMembers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, orgPath));
        const membersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMembers(membersData);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [orgPath]);

  if (loading) return <p>Loading...</p>;
  if (!orgPath) return <p>Organisasi tidak ditemukan!</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Data Anggota  {orgName.toUpperCase()}</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Nama</th>
            <th className="border border-gray-300 p-2">Jabatan</th>
            <th className="border border-gray-300 p-2">Angkatan</th>
            <th className="border border-gray-300 p-2">Kontak</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">{member.Nama}</td>
              <td className="border border-gray-300 p-2">{member.Jabatan}</td>
              <td className="border border-gray-300 p-2">{member.Angkatan}</td>
              <td className="border border-gray-300 p-2">{member.Kontak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataAnggota;