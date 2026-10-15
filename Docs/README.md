# Indeks Dokumentasi

Dokumentasi ini adalah *single source of truth* untuk pengembangan LMS Adaptif. Setiap perubahan arsitektur atau kebutuhan **harus** tercermin di sini sebelum atau bersamaan dengan perubahan kode.

- **Versi dokumen:** 0.1 (draft untuk ditinjau)
- **Tanggal:** 2026-10-15
- **Status keseluruhan:** menunggu persetujuan pengguna. Kode belum boleh dimulai.

## Label Status

| Label | Arti |
|---|---|
| `APPROVED` | Disepakati pengguna (dasar disebutkan, misalnya jawaban klarifikasi Q#) |
| `PROPOSED` | Usulan, belum disetujui eksplisit |
| `TBD` | Belum diputuskan, perlu input |

## Dokumen Utama

| File | Isi |
|---|---|
| [01-project-overview.md](01-project-overview.md) | Latar belakang, tujuan, ruang lingkup, glosarium |
| [02-requirements.md](02-requirements.md) | FR, NFR, aktor, use case, business rules, keterlacakan |
| [03-system-architecture.md](03-system-architecture.md) | Arsitektur, alur, event, error handling, observability |
| [04-database-design.md](04-database-design.md) | Tabel, constraint, migration, backup |
| [05-api-design.md](05-api-design.md) | Endpoint, format request/response, error |
| [06-coding-guidelines.md](06-coding-guidelines.md) | Struktur source code, modul, env, error handling |
| [07-development-roadmap.md](07-development-roadmap.md) | Tahap implementasi berurutan |
| [08-security-guidelines.md](08-security-guidelines.md) | Kontrol keamanan |
| [09-testing-strategy.md](09-testing-strategy.md) | Strategi dan matriks pengujian |
| [10-deployment-guide.md](10-deployment-guide.md) | Environment, Docker Compose, backup, troubleshooting |

## Direktori Pendukung

| Direktori | Menjawab pertanyaan |
|---|---|
| [adr/](adr/README.md) | **Mengapa** keputusan arsitektur diambil |
| [diagrams/](diagrams/README.md) | **Bagaimana** sistem digambarkan secara visual |
| [standards/](standards/README.md) | **Bagaimana** tim menulis, menguji, dan meninjau kode |
| [Laporan/] | **Bagaimana** Laporan artikel |

## Cara Memakai 

1. Sebelum mengerjakan tugas, cari ID kebutuhan (FR/NFR) di [02](02-requirements.md) dan tahap terkait di [07](07-development-roadmap.md).
2. Ikuti kontrak di [05](05-api-design.md), skema di [04](04-database-design.md), dan event di [03](03-system-architecture.md). Jangan mengubah kontrak tanpa memperbarui dokumen.
3. Patuhi [standards/](standards/README.md) dan [08](08-security-guidelines.md).
4. Jika perlu menyimpang dari dokumen, buat ADR baru atau perbarui dokumen lebih dulu, lalu minta persetujuan.
5. Jangan mengklaim fitur selesai tanpa tes yang tercantum di [09](09-testing-strategy.md) lulus.
6. Jika dokumen dan kode bertentangan, hentikan pekerjaan dan laporkan, jangan memilih diam-diam.

## Pertanyaan Terbuka (ringkasan)

Daftar lengkap ada di bagian "Keputusan yang Perlu Persetujuan" pada respons penyerahan dan di setiap ADR berstatus `Proposed`/`TBD`.
