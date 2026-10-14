# 📚 Learning Management System (LMS) - Microservices Architecture (REST API)

Aplikasi web *Learning Management System* (LMS) Adaptif yang dikembangkan menggunakan pendekatan arsitektur *Microservices* berbasis **REST API** untuk meningkatkan skalabilitas, modularitas, dan efisiensi komunikasi data. Sistem ini mengintegrasikan logika adaptif (*rule-based*) berbasis evaluasi hibrida melalui soal pilihan ganda dan esai untuk menyesuaikan jalur pembelajaran berdasarkan capaian kompetensi mahasiswa, dengan menyediakan materi pengayaan bagi mahasiswa yang memenuhi kriteria serta materi remedial bagi mahasiswa yang memerlukan penguatan pemahaman.

---

## 🏗️ Arsitektur Layanan (*Microservices*)

Sistem dipecah menjadi 4 *microservice* independen yang menerapkan pola *Database-per-Service* serta terhubung secara asinkron melalui *Message Broker*:

1. **`users-auth-service` (Layanan Pengguna & Autentikasi)**
   * **Fungsi:** Mengelola pendaftaran pengguna, manajemen profil, autentikasi (JWT), dan otorisasi hak akses (*roles*) untuk dosen, mahasiswa, dan admin.
   * **Database:** `Users DB` (PostgreSQL / Relational)

2. **`course-content-service` (Layanan Mata Kuliah & Konten)**
   * **Fungsi:** Mengelola struktur kurikulum, silabus, modul pembelajaran, serta bank materi (materi utama, pengayaan/advanced, dan remedial).
   * **Database:** `Course DB` (PostgreSQL / JSONB)

3. **`assessment-service` (Layanan Penilaian & Evaluasi)**
   * **Fungsi:** Mengelola bank soal (pilihan ganda dan esai), penilaian otomatis pilihan ganda secara *real-time*, serta penampungan nilai esai dari dosen.
   * **Database:** `Assessment DB` (PostgreSQL)

4. **`adaptive-path-engine` (Mesin Jalur Adaptif)**
   * **Fungsi:** Bertindak sebagai pusat logika adaptif (*rule-based logic*) yang menerima skor dari *Assessment Service* secara *real-time* via *Message Broker*, lalu menentukan jalur belajar mahasiswa (lanjut ke materi berikutnya atau remedial).
   * **Database:** `Adaptive DB` (PostgreSQL)

---

## 👥 Peran & Anggota Tim

| Nama | Peran (*Role*) | 
|---|---|
| **Abi Mahasiz** | **Backend Developer** |
| **Dede Ahmad Fauzan** | **Frontend Developer** | 

---

## 📂 Struktur Repositori

```text
├── Docs/                       # Dokumentasi proyek, proposal, dan diagram arsitektur
└── README.md                   # Dokumentasi utama proyek
