# Git Workflow

Disesuaikan untuk 1 developer (Q9). Prinsip tetap sama bila tim bertambah.

## 1. Strategi Branch
**Trunk-based dengan feature branch pendek.** `main` selalu dapat dibangun dan lulus tes. Cabang kerja dibuat dari `main`, hidup paling lama beberapa hari, lalu digabung lewat Pull Request (walau review mandiri, PR memicu CI dan menjadi catatan).

## 2. Penamaan Branch
`<tipe>/<ID>-<deskripsi-singkat>`; tipe: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
Contoh: `feat/FR-042-rule-selection`, `docs/adr-007-orm`.

## 3. Commit Message (Conventional Commits)
```
<tipe>(<scope>): <ringkasan imperatif, ≤ 72 karakter>

<isi opsional: mengapa, bukan apa>
Refs: FR-042
```
Scope: `auth`, `course`, `assessment`, `adaptive`, `gateway`, `web`, `shared`, `infra`, `docs`. Satu commit = satu perubahan logis.

## 4. Pull Request
Deskripsi: tujuan, FR/NFR terkait, perubahan dokumen/kontrak, cara uji. Syarat merge: CI hijau (lint, typecheck, test, audit), checklist [code-review.md](code-review.md) terpenuhi, dan dokumen yang terdampak sudah diperbarui. Gunakan **squash merge** agar riwayat `main` bersih.

## 5. Konflik
Rebase cabang kerja ke `main` terbaru. Selesaikan konflik secara lokal, jalankan tes ulang, dan jangan menimpa perubahan orang lain tanpa memeriksa isinya. Konflik di migrasi: jangan edit migrasi yang sudah di-merge, buat migrasi baru.

## 6. Perlindungan `main`
Aktifkan (bila platform mendukung): wajib PR, wajib CI lulus, dan larang force-push.

## 7. Larangan Memasukkan ke Repo
`.env` dan file kredensial, private key, `node_modules`, `dist`/`.next`, dump database/backup, data mahasiswa nyata, dan file editor/OS lokal. Pastikan `.gitignore` mencakupnya sejak commit pertama. Bila secret terlanjur ter-commit: anggap bocor, ganti secret, dan bersihkan riwayat.

## 8. Tag dan Rilis
Tag semantik `vMAJOR.MINOR.PATCH` untuk versi yang dideploy, dan image Docker memakai tag yang sama.
