import React, { useEffect, useState } from 'react'
import { collection, getDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'
import { useParams } from 'react-router-dom'

const StrukturOrganisasi = () => {
    const { orgName } = useParams()

    const orgPaths = {
        'hma-ftuh': 'Organisasi_mahasiswa/HMA-FTUH',
        'hms-ftuh': 'Organisasi_mahasiswa/HMS-FTUH',
        'hmdp-ftuh': 'Organisasi_mahasiswa/HMDP-FTUH',
        'hme-ftuh': 'Organisasi_mahasiswa/HME-FTUH',
        'hmm-ftuh': 'Organisasi_mahasiswa/HMM-FTUH',
        'hmtk-ftuh': 'Organisasi_mahasiswa/HMTK-FTUH',
        'hmg-ftuh': 'Organisasi_mahasiswa/HMG-FTUH',
        'hmti-ftuh': 'Organisasi_mahasiswa/HMTI-FTUH',
        'hmtl-ftuh': 'Organisasi_mahasiswa/HMTL-FTUH',
        'okif-ftuh': 'Organisasi_mahasiswa/OKIF-FTUH',
        'oksp-ftuh': 'Organisasi_mahasiswa/OKSP-FTUH',
        'permata-ftuh': 'Organisasi_mahasiswa/PERMATA-FTUH'
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
    const anggotaPath = `${orgPath}/Anggota_organisasi`

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [orgDetails, setOrgDetails] = useState({ deskripsi: '', visi: '', misi: '' })
    const [editRowId, setEditRowId] = useState(null)
    const [editedRow, setEditedRow] = useState({})

    useEffect(() => {
        if (!orgPath) {
            console.error('Path organisasi tidak ditemukan!')
            return
        }

        const fetchData = async () => {
            setLoading(true)
            try {
                const orgDoc = await getDoc(doc(db, orgPath))
                if (orgDoc.exists()) {
                    const { Deskripsi, Visi, Misi } = orgDoc.data()
                    setOrgDetails({
                        deskripsi: Deskripsi || 'Deskripsi tidak tersedia.',
                        visi: Visi || 'Visi tidak tersedia.',
                        misi: Misi || 'Misi tidak tersedia.'
                    })
                } else {
                    console.warn('Dokumen organisasi tidak ditemukan.')
                }

                const querySnapshot = await getDocs(collection(db, anggotaPath))
                const fetchedData = querySnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .filter((item) => item.Jabatan && !item.Jabatan.toLowerCase().includes('anggota'))
                    .sort((a, b) => {
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

        fetchData()
    }, [orgPath])

    const handleEditClick = (row) => {
        setEditRowId(row.id)
        setEditedRow(row)
    }

    const handleSaveClick = async () => {
        if (!editedRow || !editedRow.id) return

        try {
            const docRef = doc(db, anggotaPath, editedRow.id)
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
        <div className="p-6 max-w-5xl mx-auto bg-gray-100 shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
                {orgNames[orgName] || 'Nama Organisasi Tidak Ditemukan'}
            </h1>

            <div className="bg-white p-4 shadow-md rounded-lg mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Deskripsi</h2>
                <p className="text-gray-600 mb-4">{orgDetails.deskripsi}</p>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">Visi</h2>
                <p className="text-gray-600 mb-4">{orgDetails.visi}</p>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">Misi</h2>
                {Array.isArray(orgDetails.misi) ? (
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        {orgDetails.misi.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">{orgDetails.misi}</p>
                )}
            </div>

            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Struktur Organisasi</h2>

            {loading ? (
                <p className="text-center text-gray-500">Memuat data struktur organisasi...</p>
            ) : (
                <table className="w-full border border-gray-300 bg-white rounded-lg overflow-hidden">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left">Nama</th>
                            <th className="px-6 py-3 text-left">Jabatan</th>
                            <th className="px-6 py-3 text-left">Angkatan</th>
                            <th className="px-6 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-100 border-b">
                                <td className="px-6 py-4">
                                    {editRowId === row.id ? (
                                        <input
                                            type="text"
                                            name="Nama"
                                            value={editedRow.Nama || ''}
                                            onChange={handleChange}
                                            className="border p-2 rounded w-full"
                                        />
                                    ) : (
                                        row.Nama
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editRowId === row.id ? (
                                        <select
                                            name="Jabatan"
                                            value={editedRow.Jabatan || ''}
                                            onChange={handleChange}
                                            className="border p-2 rounded w-full"
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
                                <td className="px-6 py-4">
                                    {editRowId === row.id ? (
                                        <input
                                            type="text"
                                            name="Angkatan"
                                            value={editedRow.Angkatan || ''}
                                            onChange={handleChange}
                                            className="border p-2 rounded w-full"
                                        />
                                    ) : (
                                        row.Angkatan
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editRowId === row.id ? (
                                        <>
                                            <button
                                                onClick={handleSaveClick}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                                            >
                                                Simpan
                                            </button>
                                            <button
                                                onClick={handleCancelClick}
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            >
                                                Batal
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleEditClick(row)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Edit
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