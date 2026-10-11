# 📚 Learning Management System (LMS) - Microservices Architecture

Aplikasi web **Learning Management System (LMS)** yang dikembangkan menggunakan pendekatan **Arsitektur Microservices** untuk mengatasi keterbatasan sistem monolitik, sehingga menghasilkan platform pembelajaran yang modular, mudah dipelihara, dan dapat dikembangkan serta diskalakan secara independen via REST API.

---

## 👥 Peran & Anggota Tim

| Nama | Peran (*Role*) | Tanggung Jawab Utama |
|---|---|---|
| **Abi Mahasiz** | **Backend Developer** | Perancangan arsitektur microservices, pengembangan REST API, autentikasi, serta pengelolaan database |
| **Dede Ahmad Fauzan** | **Frontend Developer** | Perancangan antarmuka pengguna (UI/UX), integrasi REST API ke tampilan web, dan alur interaksi pengguna |

---

## 📑 Abstrak Proyek

Perkembangan teknologi informasi mendorong pemanfaatan sistem pembelajaran digital untuk mendukung proses belajar mengajar yang lebih fleksibel dan terstruktur. *Learning Management System* (LMS) merupakan aplikasi berbasis web yang digunakan untuk mengelola kegiatan pembelajaran, mulai dari pengelolaan pengguna, penyampaian materi, hingga pengumpulan tugas.

Namun, pengembangan aplikasi dengan arsitektur monolitik dapat menimbulkan tantangan dalam hal pemeliharaan, skalabilitas, dan pengembangan fitur seiring bertambahnya kebutuhan sistem. Oleh karena itu, proyek ini bertujuan untuk mengembangkan aplikasi web LMS menggunakan pendekatan arsitektur microservices. 

Metode pengembangan dilakukan melalui tahapan analisis kebutuhan, perancangan arsitektur sistem, implementasi layanan, dan pengujian fungsional. Arsitektur microservices diterapkan dengan memisahkan fungsi-fungsi utama aplikasi ke dalam layanan yang memiliki tanggung jawab masing-masing serta dapat berkomunikasi melalui *Application Programming Interface* (API). Pembagian layanan ini diharapkan dapat meningkatkan modularitas sistem, mempermudah pemeliharaan, serta mendukung pengembangan dan penskalaan layanan secara independen.

---

## 📌 Aktor & Fungsionalitas (*Use Case*)

### 🛡️ 1. Admin
* **Login:** Autentikasi awal masuk ke dalam sistem LMS dengan kredensial yang valid.
* **Kelola Akun Pengguna:** Menambah, mengubah, menghapus, atau memverifikasi data akun pengguna (Admin, Dosen, Mahasiswa).
* **Kelola Kelas:** Mengatur ruang kelas atau kelompok belajar (membuat kelas baru, kapasitas, atau menghapus kelas).
* **Kelola Mata Kuliah:** Mengatur daftar mata kuliah dan mendistribusikannya ke program studi/semester.

### 👨‍🏫 2. Dosen
* **Login:** Akses masuk ke sistem menggunakan akun dosen.
* **Upload Materi Pembelajaran:** Mengunggah file modul, bahan ajar, presentasi, atau video pembelajaran.
* **Membuat Tugas dan Kuis:** Merancang dan mempublikasikan tugas/kuis beserta batas waktu (*deadline*).
* **Mengelola Nilai:** Memeriksa pekerjaan, memberikan penilaian (skor), dan merekap nilai mahasiswa.

### 👨‍🎓 3. Mahasiswa
* **Login:** Akses masuk ke sistem menggunakan akun mahasiswa.
* **Melihat Materi Pembelajaran:** Mengunduh atau membaca materi/modul pembelajaran.
* **Mengerjakan Kuis:** Menjawab soal kuis atau ujian online yang disediakan dosen.
* **Mengumpulkan Tugas:** Mengunggah file hasil pengerjaan tugas (*upload file tugas*) sebelum *deadline*.
* **Melihat Nilai:** Memeriksa umpan balik (*feedback*) dan riwayat nilai tugas/kuis.

---

## 🛠️ Stack & Teknologi

* **Architecture:** Microservices (REST API)
* **Frontend:** HTML, CSS, JavaScript / Framework Web
* **Backend:** PHP / Node.js / Laravel *(sesuaikan)*
* **Database:** MySQL / PostgreSQL
* **Version Control:** Git & GitHub

---

## 📂 Struktur Repositori

```text              # Dokumentasi proyek, diagram use case, & file proposal 
├── #1_lms/             # Source code untuk masing-masing microservice
│   ├── Pengembangan Aplikasi Web Learning Management System.pdf/
│   
└── README.md             # Dokumentasi utama proyek