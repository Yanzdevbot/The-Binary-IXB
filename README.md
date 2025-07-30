# The Binary IXB

Selamat datang di halaman resmi kelas 9B SMPN 3 Banjar Baru! Proyek ini adalah website kelas yang menampilkan struktur kelas, jadwal, galeri foto, dan fitur chat anonim.

## Cara Instalasi

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah sederhana di bawah ini:

### 1. Clone Repositori

Pertama, clone repositori ini ke mesin lokal Anda:

```javascript
git clone https://github.com/raolbyte/The-Binary-IXB.git
cd The-Binary-IXB # Atau nama folder proyek Anda
```

### 2. Instal Dependensi

Setelah masuk ke direktori proyek, instal semua dependensi yang diperlukan menggunakan npm atau yarn:

```bash
npm install --legacy-peer-deps
```

### 3. Konfigurasi GitHub Token (Penting!)

Fitur galeri dan chat anonim memerlukan akses ke repositori GitHub Anda (`raolbyte/database`) untuk menyimpan dan mengambil data. Anda perlu membuat Personal Access Token (PAT) GitHub dan menyimpannya sebagai variabel lingkungan.

1.  **Buat GitHub Personal Access Token (PAT):**
    *   Buka [GitHub Developer Settings](https://github.com/settings/tokens).
    *   Klik `Generate new token` (atau `Generate new token (classic)`).
    *   Berikan nama token yang deskriptif (misalnya, `webkelas_token`).
    *   Berikan izin (`scopes`) yang diperlukan: minimal `repo` (untuk akses penuh ke repositori) atau lebih spesifik `contents` (untuk membaca/menulis file).
    *   Salin token yang dihasilkan. **Anda tidak akan bisa melihatnya lagi!**

2.  **Buat file `.env`:**
    Di root direktori proyek Anda, buat file baru bernama `.env` dan tambahkan baris berikut, ganti `<YOUR_GITHUB_TOKEN>` dengan token yang baru saja Anda salin:

    ```dotenv
    VITE_GITHUB_TOKEN=<YOUR_GITHUB_TOKEN>
    ```

    **Penting:** Jangan pernah mengunggah file `.env` Anda ke repositori publik! File `.gitignore` sudah dikonfigurasi untuk mengabaikannya.

### 4. Jalankan Aplikasi

Setelah dependensi terinstal dan token GitHub dikonfigurasi, Anda bisa menjalankan aplikasi dalam mode pengembangan:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:80` (atau port lain yang tersedia).


