Sistem Deteksi Kelayakan Mutu Pangan Berbasis Pengolahan Citra Digital (PCD)

Projek ini dibuat sebagai syarat kelayakan pemenuhan tugas mata kuliah Pengolahan Citra Digital (PCD) menggunakan integrasi Computer Vision & Model Generative AI Google Gemini.

🔬 Aspek Teoretis Pengolahan Citra Digital (PCD) yang Diterapkan

Sistem ini melakukan simulasi analisis visual (ekstraksi fitur) berbasis citra 2 dimensi dengan parameter-parameter keilmuan PCD sebagai berikut:

Ekstraksi Fitur Warna (Color Feature Extraction):

Menganalisis distribusi intensitas rona warna pada kanal Red, Green, dan Blue (RGB).

Mendeteksi degradasi mioglobin pada jaringan otot daging (pencokelatan/oksidasi) dan perubahan rona hijau/pudar akibat kontaminasi bakteri/diskolorasi pembusukan.

Analisis Tekstur Spasial (Texture Analysis):

Menganalisis keteraturan permukaan spasial citra (tingkat kekasaran permukaan).

Mengidentifikasi struktur asing berfrekuensi tinggi (seperti lapisan hifa/miselium kapang atau spora jamur visual yang berbulu halus).

Segmentasi Batas Tepi (Edge & Contour Representation):

Mengamati keutuhan struktural batas kontur fisik terluar komoditas daging atau ikan untuk mendeteksi dehidrasi ekstrem (freezer burn) atau disintegrasi fisik jaringan luar akibat kebusukan.

🛠️ Struktur Direktori Proyek

deteksi-daging-ai/
├── public/
│   └── index.html      # Gabungan antarmuka HTML, CSS Tailwind, & JS Frontend
├── .env.example        # Contoh konfigurasi kunci API
├── .gitignore          # Pengabaian berkas sensitif dari pelacakan Git
├── package.json        # Manifes proyek Node.js dan dependensi pustaka
├── README.md           # Dokumentasi akademis projek (berkas ini)
└── server.js           # Backend API Express & Integrasi Google Gemini SDK


🚀 Panduan Instalasi & Cara Menjalankan Lokal

1. Prasyarat Sistem

Pastikan laptop Anda telah terpasang Node.js (Sangat direkomendasikan versi 18 ke atas LTS).

2. Pemasangan Proyek

Buka terminal/CMD di dalam folder proyek ini, lalu lakukan langkah berikut:

# Inisialisasi proyek Node.js
npm init -y

# Memasang pustaka dependensi yang dibutuhkan
npm install express dotenv multer @google/genai


3. Konfigurasi Variabel Lingkungan

Duplikasi file .env.example dan ubah namanya menjadi .env.

Buka berkas .env tersebut, lalu masukkan kunci API Gemini Anda dari Google AI Studio:

GEMINI_API_KEY=AIzaSyD-MASUKKAN_KUNCI_API_ANDA_DISINI
PORT=3000


4. Menjalankan Aplikasi

Ketikkan perintah ini di terminal Anda:

node server.js


Buka browser Anda dan akses http://localhost:3000.

🌐 Panduan Publikasi / Deployment ke Server Hosting (Railway / Render)

Agar sistem ini bisa diakses secara publik (online) oleh dosen atau teman-teman kelas, Anda bisa mempublikasikannya ke platform cloud gratis seperti Render atau Railway:

Unggah Proyek ke GitHub:

Buat repositori baru di GitHub dengan status Private atau Public.

Lakukan inisialisasi Git lokal, komit perubahan, lalu push ke GitHub Anda. .gitignore yang telah disertakan otomatis akan mengamankan berkas .env Anda dari pengunggahan publik.

Daftarkan Akun di Layanan Hosting:

Buka Render atau Railway, lalu buat akun baru (disarankan masuk menggunakan akun GitHub Anda).

Hubungkan Repositori:

Pilih menu Create New Web Service (di Render) atau New Project (di Railway).

Hubungkan ke repositori GitHub deteksi-daging-ai Anda.

Konfigurasikan Build Commands:

Build Command: npm install

Start Command: npm start

Tambahkan Variabel Lingkungan di Panel Cloud:

Cari menu Environment Variables / Config Vars pada panel proyek hosting Anda.

Daftarkan kunci rahasia Anda seperti ini:

GEMINI_API_KEY = Kunci_API_Gemini_Asli_Anda

PORT = 3000

Deploy!

Server cloud akan melakukan instalasi dependensi dan meluncurkan server otomatis. Anda akan mendapatkan tautan URL publik yang siap dikumpulkan sebagai tugas kuliah!