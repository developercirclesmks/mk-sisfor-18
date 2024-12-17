import React, { useEffect, useState } from 'react'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'
import { useParams } from 'react-router-dom'

const StrukturOrganisasi = () => {
    const { orgName } = useParams()

    // Map orgName ke path collection di Firestore
    const orgPaths = {
        'hma-ftuh': 'Organisasi_mahasiswa/HMA-FTUH/Anggota_organisasi',
        'hms-ftuh': 'Organisasi_mahasiswa/HMS-FTUH/Anggota_organisasi',
        'hmdp-ftuh': 'Organisasi_mahasiswa/HMDP-FTUH/Anggota_organisasi',
        'hme-ftuh': 'Organisasi_mahasiswa/HME-FTUH/Anggota_organisasi',
        'hmm-ftuh': 'Organisasi_mahasiswa/HMM-FTUH/Anggota_organisasi',
        'hmtk-ftuh': 'Organisasi_mahasiswa/HMTK-FTUH/Anggota_organisasi',
        'hmg-ftuh': 'Organisasi_mahasiswa/HMG-FTUH/Anggota_organisasi',
        'hmti-ftuh': 'Organisasi_mahasiswa/HMTI-FTUH/Anggota_organisasi',
        'hmtl-ftuh': 'Organisasi_mahasiswa/HMTL-FTUH/Anggota_organisasi',
        'okif-ftuh': 'Organisasi_mahasiswa/OKIF-FTUH/Anggota_organisasi',
        'oksp-ftuh': 'Organisasi_mahasiswa/OKSP-FTUH/Anggota_organisasi',
        'permata-ftuh': 'Organisasi_mahasiswa/PERMATA-FTUH/Anggota_organisasi'
    }

    const orgNames = {
        'hma-ftuh': 'Himpunan Mahasiswa Arsitektur (HMA-FTUH)',
        'hms-ftuh': 'Himpunan Mahasiswa Sipil (HMS-FTUH)',
        'hmdp-ftuh': 'Himpunan Mahasiswa Departemen Perkapalan(HMDP-FTUH)',
        'hme-ftuh': 'Himpunan Mahasiswa Elektro (HME-FTUH)',
        'hmm-ftuh': 'Himpunan Mahasiswa Mesin (HMM-FTUH)',
        'hmtk-ftuh': 'Himpunan Mahasiswa Teknik Kelautan (HMTK-FTUH)',
        'hmg-ftuh': 'Himpunan Mahasiswa Geologi (HMG-FTUH)',
        'hmti-ftuh': 'Himpunan Mahasiswa Teknik Industri (HMTI-FTUH)',
        'hmtl-ftuh': 'Himpunan Mahasiswa Teknik Lingkungan (HMTL-FTUH)',
        'okif-ftuh': 'Organisasi Kemahasiswaan Informatika (OKIF-FTUH)',
        'oksp-ftuh': 'Organisasi Kemahasiswaan Sistem Perkapalan (OKSP-FTUH)',
        'permata-ftuh': 'Persatuan Mahasiswa Mahasiswa Tambang (PERMATA-FTUH)'
    }

    const jabatanOptions = ['Ketua Umum', 'Ketua Dewan', 'Sekretaris Dewan', 'Sekretaris Umum', 'Bendahara Umum']

    const orgPath = orgPaths[orgName]
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [editRowId, setEditRowId] = useState(null)
    const [editedRow, setEditedRow] = useState({})

    useEffect(() => {
        if (!orgPath) {
            console.error('Path organisasi tidak ditemukan!')
            return
        }

        const fetchStruktur = async () => {
            setLoading(true)
            try {
                const querySnapshot = await getDocs(collection(db, orgPath))
                const fetchedData = querySnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .filter(
                        (item) => item.Jabatan && !item.Jabatan.toLowerCase().includes('anggota') // Cek substring "anggota"
                    )
                    .sort((a, b) => {
                        // Mengatur agar anggota dengan jabatan "Ketua" muncul di atas
                        const isAketua = a.Jabatan.toLowerCase().includes('ketua')
                        const isBketua = b.Jabatan.toLowerCase().includes('ketua')

                        if (isAketua && !isBketua) return -1
                        if (!isAketua && isBketua) return 1
                        return 0
                    })

                setData(fetchedData)
            } catch (error) {
                console.error('Error fetching data: ', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStruktur()
    }, [orgPath])

    const handleEditClick = (row) => {
        setEditRowId(row.id)
        setEditedRow(row)
    }

    const handleSaveClick = async () => {
        if (!editedRow || !editedRow.id) return

        try {
            const docRef = doc(db, orgPath, editedRow.id)
            await updateDoc(docRef, editedRow)

            setData((prevData) => prevData.map((row) => (row.id === editedRow.id ? editedRow : row)))
            setEditRowId(null)
            setEditedRow({})
        } catch (error) {
            console.error('Error updating document: ', error)
        }
    }

    const handleCancelClick = () => {
        setEditRowId(null)
        setEditedRow({})
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditedRow((prevRow) => ({ ...prevRow, [name]: value }))
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{orgNames[orgName] || 'Nama Organisasi Tidak Ditemukan'}</h1>

            <h2 className="text-xl font-semibold mb-4">Struktur Organisasi</h2>

            {loading ? (
                <p>Memuat data struktur organisasi...</p>
            ) : (
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Nama</th>
                            <th className="border border-gray-300 px-4 py-2">Jabatan</th>
                            <th className="border border-gray-300 px-4 py-2">Angkatan</th>
                            <th className="border border-gray-300 px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">
                                    {editRowId === row.id ? (
                                        <input
                                            type="text"
                                            name="Nama"
                                            value={editedRow.Nama || ''}
                                            onChange={handleChange}
                                            className="border border-gray-300 p-1 w-full"
                                        />
                                    ) : (
                                        row.Nama
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {editRowId === row.id ? (
                                        <select
                                            name="Jabatan"
                                            value={editedRow.Jabatan || ''}
                                            onChange={handleChange}
                                            className="border border-gray-300 p-1 w-full"
                                        >
                                            <option value="">Pilih Jabatan</option>
                                            {jabatanOptions.map((jabatan) => (
                                                <option key={jabatan} value={jabatan}>
                                                    {jabatan}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        row.Jabatan
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {editRowId === row.id ? (
                                        <input
                                            type="text"
                                            name="Angkatan"
                                            value={editedRow.Angkatan || ''}
                                            onChange={handleChange}
                                            className="border border-gray-300 p-1 w-full"
                                        />
                                    ) : (
                                        row.Angkatan
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {editRowId === row.id ? (
                                        <>
                                            <button
                                                onClick={handleSaveClick}
                                                className="bg-blue-500 text-white px-4 py-1 rounded border border-blue-700 hover:bg-blue-600 mr-2"
                                            >
                                                Simpan
                                            </button>
                                            <button
                                                onClick={handleCancelClick}
                                                className="bg-red-500 text-white px-4 py-1 rounded border border-red-700 hover:bg-red-600"
                                            >
                                                Batal
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleEditClick(row)}
                                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition duration-300 ease-in-out"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182l-12.3 12.3a4.5 4.5 0 0 1-1.84 1.137l-3.034.879a.375.375 0 0 1-.464-.464l.879-3.034a4.5 4.5 0 0 1 1.137-1.84l12.3-12.3z"
                                                />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 6 17 3.5" />
                                            </svg>
                                            <span className="font-semibold">Edit</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default StrukturOrganisasi
