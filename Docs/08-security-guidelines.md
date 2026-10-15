# 08 — Security Guidelines

Tingkat risiko: sistem menyimpan data nilai dan identitas mahasiswa (sensitif sedang), dan terpapar internet bila di VPS. Kontrol disesuaikan, tanpa berlebihan.

## 1. Authentication

| ID | Kontrol |
|---|---|
| SEC-01 | Password di-hash Argon2id (fallback bcrypt cost ≥ 12). Tidak pernah dicatat atau dikirim balik. |
| SEC-02 | Kebijakan password: min 10 karakter, huruf dan angka (FR-007, validasi §6 di [02](02-requirements.md)). |
| SEC-03 | JWT RS256, access token ±15 menit, claim minimal. Layanan non-auth hanya memegang public key. |
| SEC-04 | Refresh token acak (≥ 256 bit), disimpan **hash**-nya, rotasi tiap pemakaian. Pemakaian ulang token lama mencabut seluruh `family_id`. |
| SEC-05 | Refresh token di cookie `HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth`. Access token hanya di memori klien. |
| SEC-06 | Login gagal memberi pesan generik (tidak membocorkan keberadaan akun), dan respons dibuat waktu-konstan secukupnya. |
| SEC-07 | Rate limit login dan refresh ([05 §4](05-api-design.md)). Penguncian sementara setelah 5 gagal beruntun `PROPOSED`. |

## 2. Authorization (RBAC)

- SEC-10: Setiap endpoint menyatakan peran yang diizinkan (matriks [02 §1](02-requirements.md) dan [05](05-api-design.md)). Default **tolak**.
- SEC-11: Cek kepemilikan/keanggotaan di service (BR-007/008), bukan hanya peran. Mencegah IDOR (mis. mahasiswa membuka attempt orang lain).
- SEC-12: Respons 404 dipakai bila keberadaan sumber daya tidak boleh diketahui.
- SEC-13: Layanan memverifikasi JWT sendiri (tidak hanya percaya gateway), dan endpoint `/internal/*` hanya menerima `X-Internal-Key` dan tidak dirutekan oleh gateway.
- SEC-14: Kunci jawaban PG tidak pernah dikirim ke mahasiswa (BR-014), dan DTO terpisah untuk respons mahasiswa.

## 3. Validasi dan Sanitasi Input

- Zod di semua batas input (HTTP, event, env), field tak dikenal ditolak, dan batas ukuran body (mis. 1 MB, import CSV 1 MB).
- Markdown materi dan teks esai dirender dengan **sanitizer** (tanpa HTML mentah/`<script>`), dan tautan hanya `https`.
- Tautan eksternal dibuka dengan `rel="noopener noreferrer"`.

## 4. Proteksi Ancaman Umum

| Ancaman | Kontrol |
|---|---|
| SQL injection | Query berparameter melalui ORM/query builder, tanpa string concatenation |
| XSS | Sanitasi Markdown, escape default React, CSP (`default-src 'self'`) di Next.js dan reverse proxy |
| CSRF | Access token via header (bukan cookie), refresh cookie `SameSite=Strict` dan path dibatasi, CORS whitelist origin |
| IDOR | SEC-11 |
| Brute force | SEC-07 |
| Mass assignment | Skema `strict` dan DTO eksplisit (tidak menyebar `req.body` ke DB) |
| SSRF | Tidak ada fitur fetch URL dari server (tautan hanya ditampilkan) |
| Header | `helmet`, HSTS di HTTPS |
| Message poisoning | Validasi payload event, `eventId` idempoten, dan DLQ |
| Dependensi rentan | `npm audit` di CI, ikuti [standards/dependency-management.md](standards/dependency-management.md) |

## 5. Secret dan Environment

- Tidak ada secret di repo, log, dokumentasi, atau image. `.env` masuk `.gitignore`, dan hanya `.env.example` dengan placeholder.
- Private key JWT dipasang sebagai file/secret volume read-only hanya di auth-service.
- Secret produksi berbeda dari dev, dan rotasi dilakukan bila ada dugaan bocor (kunci JWT: ganti dan paksa login ulang).
- Pemeriksaan secret sebelum commit (`gitleaks` atau pre-commit, `PROPOSED`).

## 6. Pembatasan Akses Infrastruktur

- Hanya reverse proxy (80/443) yang terbuka ke publik. PostgreSQL, RabbitMQ (5672), dan layanan internal hanya di jaringan Docker. RabbitMQ Management UI (15672) tidak dipublikasikan, akses lewat SSH tunnel.
- Role DB per layanan dengan hak minimum. RabbitMQ memakai user terpisah (bukan `guest`) dengan hak per vhost `lms`.
- Container berjalan sebagai user non-root, dan image dasar minimal.
- VPS: login SSH dengan key, password dinonaktifkan, firewall aktif (hanya 22/80/443), dan pembaruan keamanan OS.

## 7. Upload File

Tidak ada upload materi pada tahap ini (Q5). Satu-satunya upload adalah impor CSV (A-11): maks 1 MB, tipe `text/csv`, diurai di memori, baris divalidasi, dan sel yang diawali `=`, `+`, `-`, `@` dinetralkan bila nanti diekspor (injeksi formula). Jika upload materi ditambahkan, wajib ADR baru (batas ukuran, tipe, penyimpanan di luar webroot, pemindaian).

## 8. Audit Log

`audit_logs` (auth_db) mencatat: login gagal berulang, pembuatan/ubah peran/nonaktif pengguna, impor CSV, dan reset/ubah password. Perubahan nilai esai dan rule dicatat melalui kolom `graded_by/graded_at` dan `created_by`, serta log aplikasi. Log audit hanya-tambah.

## 9. Data Pribadi

- Prinsip minimisasi: hanya `email`, `nama`, `NIM/NIDN`, peran.
- Mahasiswa hanya melihat datanya, dan dosen hanya mahasiswa di mata kuliahnya.
- Data pribadi tidak ditulis ke log dan tidak dipakai di data uji (gunakan data sintetis).
- Kebijakan retensi: [04 §9](04-database-design.md). Kesesuaian dengan UU Pelindungan Data Pribadi dan kebijakan kampus `TBD` (AS-08).

## 10. Backup, Pemulihan, dan Insiden

- Backup dan restore: [04 §8](04-database-design.md) dan [10](10-deployment-guide.md). Backup berisi data sensitif sehingga disimpan dengan akses terbatas (enkripsi `PROPOSED`).
- Penanganan insiden (ringkas): (1) isolasi (cabut token/ganti kunci, hentikan layanan terdampak), (2) kumpulkan log berdasarkan `correlationId`, (3) pulihkan dari backup bila perlu, (4) catat penyebab dan perbaikan di ADR/catatan, (5) informasikan pihak berwenang kampus bila data pribadi terdampak.

## 11. Verifikasi

Kontrol diuji pada Tahap 9 dengan TC-SEC ([09](09-testing-strategy.md)).
