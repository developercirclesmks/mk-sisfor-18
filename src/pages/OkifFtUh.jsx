import React, { useState } from 'react'

const OkifFtUh = () => {
    const [members, setMembers] = useState([
        { name: 'Andi Syafiuddin Musafir', role: 'Ketua Umum HMIF FT-UH' },
        { name: 'Andi Muh Fathan Mubin', role: 'Ketua DMMIF FT-UH' },
        { name: 'Khadi Musaid Syah', role: 'Sekretaris Umum HMIF FT-UH' },
        { name: 'Muh Imam Saleh Djamal', role: 'Sekretaris/Anggota DMMIF FT-UH' },
        { name: 'Pyta Nur Chumairah', role: 'Bendahara Umum HMIF FT-UH' }
    ])

    const [isEditing, setIsEditing] = useState(false) // State untuk mode edit

    const handleEdit = (index, field, value) => {
        const updatedMembers = [...members]
        updatedMembers[index][field] = value
        setMembers(updatedMembers) // Mengupdate state dengan nilai baru
    }

    return (
        <div className="text-center mt-10 mx-auto">
            <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-xl">
                {/* Header Section */}
                <div className="bg-blue-200 py-6 rounded-lg mb-8 text-center">
                    <h1 className="text-5xl font-bold text-blue-600">STRUKTUR ORGANISASI</h1>
                    <p className="mt-3 text-xl text-gray-700">
                        OKIF FT-UH adalah singkatan dari Organisasi Kemahasiswaan Informatika Fakultas Teknik
                        Universitas Hasanuddin
                    </p>
                </div>

                {/* Tombol Edit */}
                <div className="text-center mb-9">
                    <button
                        onClick={() => setIsEditing(!isEditing)} // Toggle antara mode edit dan lihat
                        className="bg-blue-600 text-white py-4 px-12 rounded-md text-2xl"
                    >
                        {isEditing ? 'Selesai Edit' : 'Edit'}
                    </button>
                </div>

                {/* Members Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {members.map((member, index) => (
                        <div
                            key={index}
                            className="bg-gray-200 p-8 rounded-lg shadow-lg flex flex-col transition duration-300 hover:shadow-2xl"
                        >
                            {/* Jika mode edit aktif, tampilkan input, jika tidak tampilkan teks biasa */}
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={member.name}
                                        onChange={(e) => handleEdit(index, 'name', e.target.value)} // Mengupdate nama anggota
                                        className="text-2xl font-semibold bg-gray-100 text-center outline-none mb-6 px-4 py-2 rounded-md w-full border border-gray-300"
                                    />
                                    <input
                                        type="text"
                                        value={member.role}
                                        onChange={(e) => handleEdit(index, 'role', e.target.value)} // Mengupdate jabatan anggota
                                        className="text-xl text-gray-600 bg-gray-100 text-center outline-none px-6 py-2 rounded-md w-full border border-gray-300"
                                    />
                                </>
                            ) : (
                                <>
                                    <p className="text-2xl font-semibold">{member.name}</p>
                                    <p className="text-xl text-gray-600">{member.role}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OkifFtUh
