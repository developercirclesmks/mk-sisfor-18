### **Sistem Informasi Manajemen Organisasi Mahasiswa**

**Deskripsi Singkat**: Sistem ini dirancang untuk membantu pengelolaan organisasi mahasiswa di fakultas, mencakup informasi tentang struktur organisasi, anggota, dan agenda kegiatan. Mahasiswa dapat melihat profil organisasi dan agenda yang tersedia, sementara admin organisasi dapat mengelola data anggota, struktur organisasi, serta jadwal kegiatan.

---

### **Tugas untuk Kelompok 18 (Admin Panel / Pengelolaan Organisasi dan Kegiatan)**

#### **1. Halaman Login Admin**
- Gunakan Firebase Authentication untuk login admin organisasi.
- Pastikan hanya admin yang dapat mengakses halaman ini.

---

#### **2. Dashboard Admin**
- Menampilkan statistik rekapitulasi:
  - Total jumlah anggota organisasi.
  - Total kegiatan yang akan datang.
  - Total kegiatan yang telah selesai.
- Sediakan shortcut untuk menambah anggota baru, mengelola agenda, atau memperbarui informasi organisasi.

---

#### **3. Halaman Manajemen Data Anggota**
- **Tambah Anggota Baru**:
  - Form input data anggota dengan field berikut:
    - Nama anggota.
    - Jabatan/Divisi.
    - Kontak (opsional, seperti email atau nomor telepon).
  - Data disimpan ke koleksi **anggota_organisasi** di Firestore.
- **Edit Data Anggota**:
  - Menampilkan data anggota yang sudah ada di form untuk diubah.
  - Perbarui data anggota di Firestore ketika disimpan.
- **Hapus Anggota**:
  - Tambahkan tombol untuk menghapus data anggota dari Firestore.

---

#### **4. Halaman Manajemen Agenda Kegiatan**
- **Tambah Kegiatan Baru**:
  - Form input data kegiatan dengan field berikut:
    - Nama kegiatan.
    - Tanggal dan waktu.
    - Lokasi kegiatan.
    - Deskripsi.
    - Status kegiatan (misalnya: Terbuka/Tertutup).
  - Data disimpan ke koleksi **agenda_kegiatan** di Firestore.
- **Edit Agenda Kegiatan**:
  - Menampilkan data kegiatan yang sudah ada di form untuk diubah.
  - Perbarui data kegiatan di Firestore ketika disimpan.
- **Hapus Agenda Kegiatan**:
  - Tambahkan tombol untuk menghapus data kegiatan dari Firestore.

---

#### **5. Halaman Manajemen Struktur Organisasi**
- Form untuk memperbarui struktur organisasi, termasuk:
  - Nama jabatan.
  - Nama pengurus yang mengisi jabatan tersebut.
- Perbarui data di koleksi **organisasi_mahasiswa**.

---

#### **6. Firebase Integration**
- Gunakan Firebase Firestore untuk menyimpan dan mengelola data organisasi, anggota, dan kegiatan.
- Gunakan Firebase Authentication untuk autentikasi admin.

---

#### **7. Fitur Tambahan (Opsional)**
- Tambahkan fitur untuk mengirimkan email notifikasi ke anggota tentang agenda kegiatan.
- Tambahkan fitur untuk mengunduh daftar anggota atau agenda dalam format CSV.

---

#### **Fitur Utama yang Harus Selesai**
1. Sistem login admin menggunakan Firebase Authentication.
2. CRUD data anggota organisasi di Firestore.
3. CRUD agenda kegiatan di Firestore.
4. Dashboard dengan statistik dan shortcut.


---

### **Struktur Firebase Firestore untuk Data Organisasi**
**Koleksi**: `organisasi_mahasiswa`  
**Dokumen (contoh)**:
```json
{
  "id": "org_001",
  "nama_organisasi": "BEM Fakultas Teknik",
  "visi": "Menjadi pelopor kemajuan mahasiswa.",
  "misi": [
    "Meningkatkan partisipasi mahasiswa dalam kegiatan kampus.",
    "Memfasilitasi kebutuhan mahasiswa."
  ],
  "struktur": [
    { "jabatan": "Ketua", "nama": "Andi Baso" },
    { "jabatan": "Wakil Ketua", "nama": "Budi Santoso" }
  ]
}
```

**Koleksi**: `anggota_organisasi`  
**Dokumen (contoh)**:
```json
{
  "id": "anggota_001",
  "nama": "Muhammad Aryandi",
  "jabatan": "Anggota Divisi Humas",
  "kontak": "aryandi@example.com"
}
```

**Koleksi**: `agenda_kegiatan`  
**Dokumen (contoh)**:
```json
{
  "id": "agenda_001",
  "nama_kegiatan": "Workshop Kepemimpinan",
  "tanggal": "2024-12-10",
  "waktu": "09:00",
  "lokasi": "Aula Fakultas",
  "deskripsi": "Kegiatan untuk meningkatkan keterampilan kepemimpinan.",
  "status": "Terbuka untuk pendaftaran"
}
```

---

### **Integrasi Antar Kelompok**
1. **Standar Data**:
   - Kelompok admin bertugas memastikan data anggota, organisasi, dan kegiatan disimpan dengan format yang sesuai di Firestore.
   - Kelompok front-end bertugas membaca data ini dan menampilkannya kepada mahasiswa.
2. **API Firebase**:
   - Gunakan koleksi **organisasi_mahasiswa**, **anggota_organisasi**, dan **agenda_kegiatan** sebagai sumber data utama.
3. **Koordinasi**:
   - Pastikan kedua kelompok berkomunikasi untuk menyinkronkan kebutuhan data.

---

### **Estimasi Timeline (6 Minggu)**


#### **Kelompok 18: Admin Panel**
- **Minggu 1**: Setup repositori, install dependency, setup Firebase Authentication dan Firestore.
- **Minggu 2**: Membuat halaman login admin.
- **Minggu 3**: Membuat halaman manajemen anggota.
- **Minggu 4**: Membuat halaman manajemen agenda kegiatan.
- **Minggu 5**: Membuat halaman manajemen struktur organisasi dan testing.
- **Minggu 6**: Debugging dan dokumentasi admin panel.
