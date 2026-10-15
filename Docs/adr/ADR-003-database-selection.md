# ADR-003 — Pemilihan Database dan Topologi

- **Status:** Accepted
- **Tanggal:** 2026-10-15

## Konteks
Data akademik bersifat relasional dan memerlukan transaksi (nilai, enrollment, outbox). Prinsip microservices: kepemilikan data per layanan. Resource server terbatas.

## Persyaratan dan Batasan
NFR-010 (tanpa FK lintas layanan), NFR-011 (backup), hemat resource, PostgreSQL sudah dipilih dalam brief.

## Alternatif
| Alternatif | Alasan tidak dipilih |
|---|---|
| Satu database, schema bersama | Coupling antar layanan |
| Satu instance, schema per layanan | Isolasi hak akses lebih lemah dibanding database terpisah |
| Instance PostgreSQL per layanan | Boros RAM/CPU untuk skala ini |
| MongoDB/NoSQL | Data relasional dan kebutuhan transaksi lebih cocok dengan SQL |

## Keputusan
PostgreSQL, **satu instance, empat database** (`auth_db`, `course_db`, `assessment_db`, `adaptive_db`) dengan role DB terpisah. Referensi lintas layanan berupa UUID tanpa FK (Q4). Kolom enum memakai `text + CHECK`. Detail: [04](../04-database-design.md).

## Konsekuensi
- (+) Hemat resource, isolasi akses, dan skema dapat berevolusi per layanan.
- (−) Satu instance berarti satu titik kegagalan dan resource bersama. Mitigasi: backup harian dan pemisahan instance di kemudian hari tanpa mengubah kode (URL koneksi per layanan sudah terpisah).
- (−) Integritas lintas layanan dijaga aplikasi, bukan DB.
- Keamanan: hak minimum per role. Performa: cukup untuk skala target. Pemeliharaan: migrasi per layanan.

## Referensi
[04](../04-database-design.md), dokumentasi resmi PostgreSQL.
