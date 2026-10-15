# ADR-007 — ORM dan Alat Migrasi

- **Status:** TBD (menunggu keputusan pengguna)
- **Tanggal:** 2026-10-15

## Konteks
Q10 meninggalkan pilihan antara Prisma dan Knex. Dibutuhkan: migrasi per layanan (4 database), transaksi (outbox), query kompleks sederhana, dan kemudahan bagi 1 developer.

## Alternatif
| Opsi | Keuntungan | Kekurangan |
|---|---|---|
| **Prisma** | Tipe otomatis, migrasi bawaan, produktif cepat | Satu schema/klien per layanan, `citext`/CHECK/exclusion constraint perlu SQL mentah di migrasi, dan resource klien lebih besar |
| **Knex** (query builder) | Dekat dengan SQL, kontrol penuh constraint, ringan | Tipe harus dibuat manual, lebih banyak kode boilerplate |
| Drizzle/Kysely | Tipe kuat, ringan | Tidak dibahas pengguna, dan ekosistem lebih kecil |

## Rekomendasi (belum keputusan)
Untuk 1 developer dan skripsi, Prisma mempercepat pengembangan. Namun skema ini memakai banyak constraint khusus PostgreSQL (CHECK, citext, exclusion), sehingga Knex atau Kysely dengan migrasi SQL lebih transparan. Verifikasi dukungan fitur terhadap dokumentasi resmi pada saat Tahap 0 sebelum memutuskan.

## Dampak
Menentukan struktur `repository`, alat migrasi di Tahap 2, dan Dockerfile. Harus diputuskan sebelum Tahap 2.
