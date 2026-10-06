# Nuxt 4 + Drizzle ORM + MySQL CRUD App

Aplikasi web modern berbasis **Nuxt 4**, **Drizzle ORM**, dan **MySQL** yang menyediakan fitur Manajemen Pengguna (Users) & Produk (Products) secara utuh (*Create, Read, Update, Delete*).

---

## 🛠️ Teknologi yang Digunakan

- **Frontend & Backend Framework**: [Nuxt 4](https://nuxt.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database Driver**: `mysql2`
- **Validation**: [Zod](https://zod.dev/)
- **Password Hashing**: `bcryptjs`
- **Styling**: Vanilla CSS with modern responsive design system

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18+)
- MySQL Server (misal lewat XAMPP, Laragon, Docker, atau MySQL Community Server)

### 2. Konfigurasi Environment (`.env`)
Buat atau edit berkas `.env` di direktori utama:

```env
DATABASE_URL=mysql://root@localhost:3306/nuxtjs_drizzle_mysql
```
*Sesuaikan username, password, host, port, dan nama database sesuai setup MySQL Anda.*

### 3. Instalasi Dependensi
Jalankan perintah berikut di terminal:
```bash
npm install
```

### 4. Sinkronisasi Skema Database (Drizzle Migration)
Jalankan perintah push untuk mengaplikasikan tabel `users` dan `products` ke MySQL Anda:
```bash
npm run db:push
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser Anda dan kunjungi `http://localhost:3000`.

---

## 📚 Struktur Berkas & API Endpoints

### 1. Users Endpoint (`/api/users`)
- **`GET /api/users`** - Mengambil daftar seluruh pengguna.
- **`POST /api/users`** - Menambah pengguna baru (password otomatis di-hash).
- **`GET /api/users/:id`** - Mengambil rincian pengguna berdasarkan ID.
- **`PUT /api/users/:id`** - Memperbarui data pengguna berdasarkan ID.
- **`DELETE /api/users/:id`** - Menghapus pengguna berdasarkan ID.

### 2. Products Endpoint (`/api/products`)
- **`GET /api/products`** - Mengambil seluruh produk beserta informasi pemilik (User).
- **`POST /api/products`** - Menambah produk baru yang terikat pada `userId`.
- **`GET /api/products/:id`** - Mengambil rincian produk berdasarkan ID.
- **`PUT /api/products/:id`** - Memperbarui nama atau pemilik produk berdasarkan ID.
- **`DELETE /api/products/:id`** - Menghapus produk berdasarkan ID.

---

## 🖥️ Antarmuka Pengguna (UI)

- **Layout Navigation**: Terdapat navbar atas di [`app/layouts/default.vue`](file:///c:/Users/user/Desktop/nuxtjs-drizzle-mysql/app/layouts/default.vue) untuk kemudahan berpindah antara halaman **Users** dan **Products**.
- **Halaman Users (`/`)**: Form tambah/edit user dan tabel list pengguna beserta role & aksi hapus/edit.
- **Halaman Products (`/products`)**: Form tambah/edit produk dengan dropdown relasi ke User, serta tabel produk yang menampilkan pemiliknya.
