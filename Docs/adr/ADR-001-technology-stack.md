# ADR-001 — Technology Stack dan Struktur Repository

- **Status:** Accepted (pemilihan stack, dasar: brief dan Q10) · Proposed (monorepo)
- **Tanggal:** 2026-10-15

## Konteks
Skripsi dengan 1 developer (Q9), waktu terbatas, dan stack sudah direncanakan: React/Next.js, Tailwind, Node.js/Express, REST, RabbitMQ, PostgreSQL.

## Persyaratan dan Batasan
Satu developer, skala ±100–500 pengguna, infrastruktur terbatas, kemudahan dokumentasi dan pengujian.

## Alternatif
| Alternatif | Catatan |
|---|---|
| JavaScript tanpa TypeScript | Lebih cepat awalnya, tetapi kontrak antarlayanan rawan salah |
| NestJS | Struktur kuat, tetapi menyimpang dari rencana dan menambah kurva belajar |
| Polyrepo per layanan | Isolasi baik, tetapi overhead untuk 1 developer |

## Keputusan
TypeScript di seluruh stack (Q10). Node.js + Express untuk layanan. Next.js + Tailwind untuk frontend. **Monorepo** dengan npm workspaces dan paket `shared` terbatas (tipe, skema event, error) `PROPOSED`. Versi runtime dan framework diverifikasi ke dokumentasi resmi pada Tahap 1 lalu dipin.

## Konsekuensi
- (+) Kontrak bertipe, satu CI, refactor lintas layanan mudah.
- (−) Express tidak memaksakan struktur, sehingga butuh disiplin lewat [06](../06-coding-guidelines.md).
- (−) Paket `shared` dapat menjadi sumber coupling, sehingga dibatasi tanpa logika bisnis.
- Dampak biaya: nol lisensi. Pemeliharaan: lebih rendah dibanding polyrepo untuk 1 orang.

## Referensi
Brief proyek, [06](../06-coding-guidelines.md).
