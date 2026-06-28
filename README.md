<div align="center">
  <img src="https://img.icons8.com/?size=100&id=102554&format=png&color=000000" alt="Empang V2 Logo" width="100"/>
  
  # 🎣 Empang V2
  
  **Manajemen Pemancingan & Sistem Booking Lomba Terpadu**
  
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

  <p align="center">
    Empang V2 adalah aplikasi modern untuk pengelolaan pemancingan dan lomba yang mengedepankan pengalaman pengguna (UX) yang ciamik serta performa backend yang super cepat!
  </p>
</div>

---

## ✨ Fitur Utama

- 🏠 **Halaman Publik Interaktif** - Informasi lengkap mengenai pemancingan & jadwal lomba terkini.
- 🎟️ **Sistem Booking Cerdas** - Pendaftaran lomba mandiri dengan generate Kode Booking otomatis (contoh: *CMBR-007*).
- 🔍 **Lacak Status Peserta** - Cek status pembayaran dan tiket secara instan (Lunas/Pending).
- 🛡️ **Dashboard Admin Aman** - Dilindungi otentikasi JWT (JSON Web Token) yang super kuat.
- 📊 **Manajemen Rekap & Laporan** - Laporan harian/bulanan, metode pembayaran, serta kalkulasi pendapatan yang sangat akurat.
- 🖼️ **Manajemen Profil & Galeri** - Kostumisasi info rekening, nomor WhatsApp admin, hingga potret kegiatan.

---

## 🚀 Teknologi yang Digunakan

| Kategori | Teknologi |
| --- | --- |
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios |
| **Backend** | Node.js, Express, Prisma ORM, JSON Web Token (JWT) |
| **Database** | MySQL (Aiven Cloud) |
| **Bahasa** | TypeScript |

---

## 📂 Struktur Direktori

```text
empang-v2/
├── 📁 backend/       # Node.js REST API (Express, Prisma, Controllers, Middleware)
├── 📁 frontend/      # React Client App (Komponen UI, State Management, Views)
└── 📄 README.md
```

---

## 🛠️ Cara Memulai (Panduan Setup)

Pastikan komputer Anda sudah terinstal **Node.js** (v18+) dan **npm**.

### 1. Setup Backend ⚙️

Buka terminal dan navigasi ke direktori backend:

```bash
cd backend
```

Install semua dependensi:
```bash
npm install
```

Salin pengaturan *environment* (sesuaikan konfigurasi database jika diperlukan):
```bash
cp .env.example .env
```
> **Info:** Project ini secara *default* sudah dihubungkan ke Aiven MySQL Cloud pada variabel `DATABASE_URL` di file `.env`.

Sinkronisasikan database dan jalankan server *development*:
```bash
npx prisma generate
npm run dev
```
🎉 Backend akan menyala di `http://localhost:8000`.

### 2. Setup Frontend 🎨

Buka tab terminal baru dan masuk ke folder frontend:

```bash
cd frontend
```

Install dependensi UI:
```bash
npm install
```

Jalankan aplikasi React:
```bash
npm run dev
```
🎉 Frontend bisa diakses melalui `http://localhost:5173`. Frontend sudah terkonfigurasi untuk mem-*proxy* API ke port 8000 secara otomatis!

---

## 🔐 Kredensial Akses Admin

Gunakan data berikut untuk mengakses halaman rahasia pengelola:

- **Halaman Login:** `http://localhost:5173/empang-rahasia`
- **Email:** `admin@gmail.com`
- **Kata Sandi:** `password`

*(⚠️ Sangat disarankan untuk mengubah kata sandi ini setelah aplikasi di-*deploy* ke production)*

---

## 🛣️ Rute Utama (Routing)

### Akses Pengunjung
* `/` — Beranda (Jadwal & Galeri)
* `/booking` — Formulir Pendaftaran Lomba
* `/status` — Pengecekan Tiket Peserta

### Akses Administrator (Terproteksi)
* `/empang-rahasia` — Gerbang Login Admin
* `/admin/dashboard` — Pusat Kontrol Booking
* `/admin/lomba` — Pengaturan Jadwal
* `/admin/rekap-hybrid` — Kasir & Rekapitulasi
* `/admin/reports` — Laporan Keuangan
* `/admin/settings` — Konfigurasi Identitas & Potret

---

## 📦 Panduan Rilis (Production)

Untuk merilis aplikasi, Anda perlu mem-build kedua sisinya.

**Backend:**
```bash
cd backend
npm run build
npm run start
```

**Frontend:**
```bash
cd frontend
npm run build
```
*(Hasil build akan masuk ke dalam folder `frontend/dist`)*

---

<div align="center">
  Dibuat dengan ❤️ untuk kemajuan pemancingan Nusantara.
</div>
