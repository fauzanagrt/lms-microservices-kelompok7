# ADR-004 — Strategi Autentikasi dan Otorisasi

- **Status:** Accepted (JWT asimetris, dasar Q7) · Proposed (TTL, cookie refresh, deteksi reuse, internal key)
- **Tanggal:** 2026-10-15

## Konteks
Beberapa layanan harus memverifikasi identitas tanpa memanggil auth-service pada setiap request. Pengguna: Admin, Dosen, Mahasiswa. Akun dibuat admin (Q6).

## Persyaratan dan Batasan
FR-001–003, FR-006, NFR-004, SEC-01–SEC-14.

## Alternatif
| Alternatif | Catatan |
|---|---|
| Session server-side + cookie | Sulit lintas layanan, butuh store sesi bersama |
| JWT simetris (HS256) | Semua layanan memegang secret yang dapat menerbitkan token, sehingga risiko lebih besar |
| Introspeksi token ke auth-service tiap request | Menambah latensi dan ketergantungan |
| OAuth2/OIDC penuh (Keycloak) | Berlebihan untuk skala ini |

## Keputusan
JWT **RS256**: auth-service memegang private key, layanan lain public key. Access token ±15 menit (claim: `sub`, `role`, `iss`, `iat`, `exp`, `jti`). Refresh token acak, hash disimpan, rotasi, deteksi reuse berbasis `family_id`, dikirim sebagai cookie `HttpOnly; Secure; SameSite=Strict`. Otorisasi berlapis: peran + kepemilikan/enrollment. Panggilan internal memakai `X-Internal-Key`.

## Konsekuensi
- (+) Verifikasi lokal tanpa panggilan jaringan, dan kebocoran satu layanan tidak memungkinkan pemalsuan token.
- (−) Pencabutan access token sebelum kedaluwarsa tidak instan (diterima karena TTL pendek). Rotasi kunci memerlukan prosedur (`kid` `Could`).
- (−) `Secure` cookie memerlukan HTTPS, sehingga tanpa domain/HTTPS perlu penyesuaian (ADR baru).
- Risiko: private key bocor → ganti keypair dan paksa login ulang.

## Referensi
[08](../08-security-guidelines.md), RFC 7519 (JWT).
