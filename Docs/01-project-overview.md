# 01 — Project Overview

## 1. Latar Belakang dan Permasalahan

**[Fakta, dari brief]** Proyek ini adalah skripsi/proyek akademik berjudul *Penerapan Arsitektur Microservices pada Learning Management System untuk Personalisasi Pembelajaran Adaptif*.

Permasalahan yang diselesaikan:

1. LMS konvensional menyajikan materi yang sama kepada semua mahasiswa, tanpa memperhatikan capaian kompetensi masing-masing.
2. Aplikasi LMS monolitik sulit diskalakan dan dikembangkan per modul.

## 2. Tujuan dan Manfaat

| Tujuan | Manfaat |
|---|---|
| Membangun LMS web dengan 4 layanan independen berkomunikasi lewat REST dan RabbitMQ | Modularitas dan skalabilitas per layanan |
| Menerapkan evaluasi hibrida (PG + esai) dengan penilaian | Penilaian lebih komprehensif |
| Menetapkan jalur belajar otomatis (rule-based) per kompetensi | Mahasiswa mendapat pengayaan atau remedial sesuai capaian |
| Menghasilkan bukti uji fungsional dan beban sederhana | Dasar analisis skripsi |

## 3. Ruang Lingkup

**Dalam lingkup (In scope):**
- Autentikasi dan RBAC (Admin, Dosen, Mahasiswa).
- Manajemen mata kuliah, CPMK, silabus, dan bank materi (MAIN, ENRICHMENT, REMEDIAL) berupa teks Markdown dan tautan.
- Enrollment mahasiswa oleh admin/dosen.
- Evaluasi: soal PG (nilai otomatis) dan esai (nilai manual dengan rubrik).
- Rule engine adaptif per CPMK dengan ambang yang dapat dikonfigurasi dosen.
- Dashboard dasar per peran.
- Deployment Docker Compose, dan uji beban sederhana.

**Di luar lingkup (Won't, tahap ini):** self-registration, notifikasi email/push, forum/chat, upload dan streaming video, penilaian esai otomatis dengan AI/NLP, rekomendasi berbasis machine learning, integrasi SIAKAD/SSO kampus, aplikasi mobile native, Kubernetes.

## 4. Pengguna dan Stakeholder

| Peran | Kebutuhan utama |
|---|---|
| Mahasiswa | Mengakses materi, mengerjakan evaluasi, melihat nilai dan jalur belajar |
| Dosen | Mengelola mata kuliah, materi, soal, menilai esai, mengatur rule adaptif |
| Administrator | Mengelola akun dan hak akses, enrollment |
| Peneliti/pengembang (stakeholder) | Bukti arsitektur, data uji |
| Dosen pembimbing/penguji | Kesesuaian dengan tujuan penelitian |

## 5. Gambaran Fitur Utama

Users & Auth → Course & Content → Assessment → Adaptive Path Engine. Alur inti: *submit evaluasi → penilaian → event → rule engine → jalur belajar → materi sesuai jalur terbuka bagi mahasiswa*. Detail di [02](02-requirements.md) dan [03](03-system-architecture.md).

## 6. Batasan Sistem

- Waktu skripsi terbatas, sehingga cakupan fitur dibatasi sesuai prioritas MoSCoW.
- Infrastruktur terbatas (satu VPS atau mesin lokal dengan Docker).
- Logika adaptif hanya rule-based, deterministik, dan dapat dijelaskan.
- Materi hanya teks Markdown dan tautan eksternal (`APPROVED`, Q5).

## 7. Asumsi dan Dependensi

| ID | Asumsi/Dependensi | Status |
|---|---|---|
| AS-01 | Akun dibuat admin (termasuk impor CSV), tanpa self-register | APPROVED (Q6) |
| AS-02 | Esai dinilai manual oleh dosen | APPROVED (Q1) |
| AS-03 | Skala pengguna ±100–500, dengan uji beban sederhana | APPROVED (Q8) |
| AS-04 | Satu developer | APPROVED (Q9) |
| AS-05 | TypeScript di seluruh stack | APPROVED (Q10) |
| AS-06 | Spesifikasi VPS, domain, dan penyedia belum diketahui | TBD |
| AS-07 | Apakah ada perbandingan formal dengan arsitektur monolith dalam skripsi | TBD |
| AS-08 | Kebijakan data pribadi kampus (rujukan UU PDP) belum dikonfirmasi | TBD |
| DEP-01 | Docker dan Docker Compose tersedia di mesin dev dan VPS | PROPOSED |
| DEP-02 | Versi Node.js LTS, Next.js, dan Express diverifikasi ke dokumentasi resmi saat Tahap 3 lalu dipin | PROPOSED |

## 8. Kriteria Keberhasilan

| ID | Kriteria | Cara ukur |
|---|---|---|
| SC-01 | Seluruh FR berprioritas Must lulus acceptance criteria | Laporan pengujian |
| SC-02 | Alur E2E: submit → graded → jalur ditetapkan → materi terbuka berjalan benar | Tes E2E |
| SC-03 | Keempat layanan dapat dijalankan dengan satu perintah Compose | Uji deployment |
| SC-04 | Kegagalan Adaptive Engine tidak menggagalkan submit evaluasi, dan event diproses setelah layanan pulih | Tes ketahanan |
| SC-05 | Uji beban memenuhi NFR-001 | Laporan k6 |

## 9. Glosarium

| Istilah | Arti |
|---|---|
| CPMK | Capaian Pembelajaran Mata Kuliah, disebut *competency* di sistem |
| MAIN / ENRICHMENT / REMEDIAL | Jenis materi: utama, pengayaan (skor tinggi), remedial (skor rendah) |
| Attempt | Satu kali pengerjaan evaluasi oleh mahasiswa |
| PG | Pilihan ganda |
| Jalur belajar (learning path) | Hasil keputusan engine per mahasiswa per CPMK |
| Rule | Aturan rentang skor → jenis jalur |
| Event | Pesan asinkron di RabbitMQ |
| Outbox | Tabel perantara agar penyimpanan data dan publikasi event konsisten |
| DLQ | Dead-letter queue untuk pesan yang gagal diproses berulang |
| RBAC | Role-Based Access Control |
