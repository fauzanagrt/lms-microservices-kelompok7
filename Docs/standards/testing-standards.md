# Testing Standards

Strategi dan matriks: [09](../09-testing-strategy.md).

## 1. Kapan Memakai Level Mana
| Situasi | Level |
|---|---|
| Fungsi murni / aturan bisnis (skor, rule) | Unit |
| Endpoint, query, transaksi, outbox, consumer | Integration (DB/RabbitMQ nyata via container) |
| Kontrak event/error | Contract (skema Zod bersama) |
| Alur lintas layanan dan UI kritis | E2E (secukupnya) |

Jangan me-mock database pada tes integrasi (mock tidak menangkap pelanggaran constraint).

## 2. Penamaan
Berkas `*.test.ts` berdampingan dengan modul (unit) atau di `tests/integration`. Nama tes menjelaskan perilaku: `describe('selectRule') → it('memilih ENRICHMENT saat skor tepat 80')`. Sertakan ID kebutuhan/TC di deskripsi bila relevan: `[TC-ADP-01]`.

## 3. Data dan Environment
Data sintetis dan deterministik (fixture/factory). Tiap tes mandiri (tidak bergantung urutan) dan database dibersihkan/dibuat ulang. Waktu dan UUID diinjeksikan agar deterministik. Tidak ada kredensial nyata, dan environment tes memakai `.env.test` dengan nilai placeholder.

## 4. Cakupan Skenario
Setiap fitur minimal: jalur normal, **edge case** (nilai batas, kosong, maksimum), dan **error case** (input salah, tidak berwenang, sumber daya tidak ada, dependensi gagal).

## 5. Hak Akses dan Keamanan
Setiap endpoint baru wajib tes: tanpa token (401), peran salah (403), dan sumber daya milik pengguna lain (403/404). Validasi input negatif untuk setiap skema.

## 6. Kriteria Lulus Perubahan
- Semua tes lulus di CI, tidak ada tes `skip`/`only` yang tertinggal.
- Perubahan perilaku disertai tes baru/diperbarui.
- Cakupan logika domain inti tidak turun di bawah 70% (target fungsi murni ≥ 90%).
- Bug yang diperbaiki mendapat tes regresi.

## 7. Cakupan Realistis
Tidak mengejar 100% global. Prioritas berdasarkan risiko: otorisasi, penilaian, adaptif, event, dan autentikasi lebih dahulu. UI: tes komponen untuk logika (form, timer), dan E2E untuk 3 alur kritis.

## 8. Tes yang Tidak Stabil (flaky)
Jangan diabaikan. Perbaiki akar masalah atau karantina dengan issue tertulis dan tenggat.
