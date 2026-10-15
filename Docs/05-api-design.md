# 05 — API Design

## 1. Prinsip

- Base URL: `/api/v1` lewat Gateway. Versi di path sudah disiapkan, dan v2 baru dibuat bila ada perubahan *breaking*.
- Format JSON, UTF-8, tanggal ISO-8601 UTC, ID berupa UUID.
- Autentikasi: header `Authorization: Bearer <accessToken>` (kecuali endpoint publik).
- Header: `X-Correlation-Id` (opsional dari klien, selalu ada di respons).
- Kontrak ini bersifat rancangan (`PROPOSED`) dan menjadi acuan implementasi.

## 2. Format Respons

Sukses:

```json
{ "data": { }, "meta": { "page": 1, "limit": 20, "total": 134 } }
```
`meta` hanya ada pada respons daftar.

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input tidak valid",
    "details": [{ "field": "email", "issue": "format tidak valid" }],
    "correlationId": "b1c9e6f0-..."
  }
}
```

| HTTP | `code` | Keterangan |
|---|---|---|
| 400 | `BAD_REQUEST` | Body/parameter rusak |
| 401 | `UNAUTHENTICATED` / `TOKEN_EXPIRED` | Token tidak ada/tidak valid/kedaluwarsa |
| 403 | `FORBIDDEN` | Peran/kepemilikan tidak sesuai |
| 404 | `NOT_FOUND` | Tidak ada atau tidak boleh diketahui |
| 409 | `CONFLICT` | Duplikat atau konflik status |
| 422 | `VALIDATION_ERROR` / `BUSINESS_RULE_VIOLATION` | Validasi atau aturan bisnis gagal |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan |
| 500 | `INTERNAL_ERROR` | Kesalahan tak terduga |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan hilir tidak tersedia |

## 3. Konvensi Daftar

Query: `page` (default 1), `limit` (default 20, maks 100), `sort` (mis. `-createdAt`), serta filter spesifik per endpoint. Hanya field yang dipublikasikan di tabel yang boleh dipakai untuk sort/filter (whitelist).

## 4. Rate Limiting (Gateway)

| Cakupan | Batas (`PROPOSED`) |
|---|---|
| `POST /auth/login` | 5 / menit / IP + email |
| `POST /auth/refresh` | 20 / menit / IP |
| Endpoint lain terautentikasi | 300 / menit / pengguna |

## 5. Daftar Endpoint

Singkatan peran: **A**=ADMIN, **L**=LECTURER, **S**=STUDENT. "pemilik" = dosen pemilik mata kuliah, dan "ter-enroll" = mahasiswa terdaftar aktif.

### 5.1 auth-service

| ID | Method & URL | Fungsi | Akses | FR |
|---|---|---|---|---|
| A-01 | `POST /auth/login` | Login | Publik | FR-001 |
| A-02 | `POST /auth/refresh` | Rotasi token (cookie refresh) | Publik (cookie) | FR-002 |
| A-03 | `POST /auth/logout` | Cabut refresh token | Terautentikasi | FR-003 |
| A-04 | `GET /auth/me` | Profil sendiri | Semua | FR-008 |
| A-05 | `PATCH /auth/me/password` | Ganti password | Semua | FR-007 |
| A-06 | `POST /users` | Buat akun | A | FR-004 |
| A-07 | `GET /users?role=&q=&isActive=` | Daftar pengguna | A | FR-004 |
| A-08 | `GET /users/:id` | Detail pengguna | A | FR-004 |
| A-09 | `PATCH /users/:id` | Ubah nama/peran/status | A | FR-004 |
| A-10 | `DELETE /users/:id` | Nonaktifkan (soft delete) | A | FR-004 |
| A-11 | `POST /users/import` | Impor CSV (multipart, maks 1 MB, baris divalidasi, mengembalikan ringkasan sukses/gagal) | A | FR-005 |

### 5.2 course-service

| ID | Method & URL | Fungsi | Akses |
|---|---|---|---|
| C-01 | `POST /courses` | Buat mata kuliah | A, L |
| C-02 | `GET /courses?status=&q=` | Daftar (L: miliknya, S: ter-enroll, A: semua) | A, L, S |
| C-03 | `GET /courses/:courseId` | Detail | A, pemilik, ter-enroll |
| C-04 | `PATCH /courses/:courseId` | Ubah (termasuk status) | A, pemilik |
| C-05 | `DELETE /courses/:courseId` | Arsipkan | A, pemilik |
| C-06 | `POST /courses/:courseId/competencies` | Tambah CPMK | A, pemilik |
| C-07 | `GET /courses/:courseId/competencies` | Daftar CPMK | A, pemilik, ter-enroll |
| C-08 | `PATCH /courses/:courseId/competencies/:id` | Ubah CPMK | A, pemilik |
| C-09 | `DELETE /courses/:courseId/competencies/:id` | Hapus CPMK (RESTRICT bila dirujuk) | A, pemilik |
| C-10 | `POST /courses/:courseId/topics` | Tambah topik silabus | A, pemilik |
| C-11 | `GET /courses/:courseId/topics` | Daftar topik | A, pemilik, ter-enroll |
| C-12 | `PATCH`/`DELETE /courses/:courseId/topics/:id` | Ubah/hapus topik | A, pemilik |
| C-13 | `POST /courses/:courseId/contents` | Buat materi | A, pemilik |
| C-14 | `GET /courses/:courseId/contents?competencyId=&type=` | Daftar materi (S: sesuai BR-009) | A, pemilik, ter-enroll |
| C-15 | `GET /courses/:courseId/contents/:id` | Detail materi | A, pemilik, ter-enroll (BR-009) |
| C-16 | `PATCH /courses/:courseId/contents/:id` | Ubah/publikasi materi | A, pemilik |
| C-17 | `DELETE /courses/:courseId/contents/:id` | Hapus materi | A, pemilik |
| C-18 | `POST /courses/:courseId/enrollments` | Daftarkan mahasiswa (satu atau banyak) | A, pemilik |
| C-19 | `GET /courses/:courseId/enrollments` | Daftar peserta | A, pemilik |
| C-20 | `DELETE /courses/:courseId/enrollments/:studentId` | Keluarkan peserta | A, pemilik |
| C-21 | `GET /courses/:courseId/my-path` | Jalur belajar sendiri per CPMK | S |
| C-22 | `GET /internal/courses/:courseId/access?userId=` | **Internal.** Mengembalikan `{ isOwner, isEnrolled, competencyIds[] }` | Layanan (`X-Internal-Key`), tidak dirutekan oleh gateway |

### 5.3 assessment-service

| ID | Method & URL | Fungsi | Akses |
|---|---|---|---|
| S-01 | `POST /assessments` | Buat evaluasi | pemilik mata kuliah (L), A |
| S-02 | `GET /assessments?courseId=&status=` | Daftar evaluasi | pemilik, ter-enroll |
| S-03 | `GET /assessments/:id` | Detail (S: tanpa kunci) | pemilik, ter-enroll |
| S-04 | `PATCH /assessments/:id` | Ubah | pemilik |
| S-05 | `POST /assessments/:id/publish` | Publikasi (validasi ≥ 1 soal dan 1 opsi benar per PG) | pemilik |
| S-06 | `POST /assessments/:id/questions` | Tambah soal | pemilik |
| S-07 | `PATCH /assessments/:id/questions/:qid` | Ubah soal (ditolak bila BR-010) | pemilik |
| S-08 | `DELETE /assessments/:id/questions/:qid` | Hapus soal (BR-010) | pemilik |
| S-09 | `POST /assessments/:id/attempts` | Mulai attempt | S |
| S-10 | `GET /attempts/:attemptId` | Lihat/lanjutkan attempt (tanpa kunci) | S pemilik attempt, L pemilik |
| S-11 | `PUT /attempts/:attemptId/answers/:questionId` | Simpan jawaban | S pemilik attempt |
| S-12 | `POST /attempts/:attemptId/submit` | Submit | S pemilik attempt |
| S-13 | `GET /assessments/:id/attempts?status=` | Daftar attempt | pemilik |
| S-14 | `GET /attempts/pending-grading?courseId=` | Esai menunggu dinilai | L pemilik |
| S-15 | `PUT /attempts/:attemptId/answers/:questionId/grade` | Nilai esai | L pemilik |
| S-16 | `GET /attempts/:attemptId/result` | Hasil dan umpan balik | S pemilik attempt, L pemilik |

### 5.4 adaptive-service

| ID | Method & URL | Fungsi | Akses |
|---|---|---|---|
| P-01 | `POST /adaptive/rules` | Buat rule | L pemilik, A |
| P-02 | `GET /adaptive/rules?courseId=` | Daftar rule (termasuk default global) | L pemilik, A |
| P-03 | `PATCH /adaptive/rules/:id` | Ubah rule | L pemilik, A |
| P-04 | `DELETE /adaptive/rules/:id` | Hapus/nonaktifkan rule (default global tidak dapat dihapus) | L pemilik, A |
| P-05 | `GET /adaptive/results?courseId=&studentId=&assessmentId=` | Hasil keputusan | L pemilik, A |
| P-06 | `GET /adaptive/me/paths?courseId=` | Jalur milik sendiri | S |
| P-07 | `GET /adaptive/courses/:courseId/summary` | Rekap jumlah per jalur per CPMK | L pemilik, A |

### 5.5 Operasional (tiap layanan)

`GET /health` dan `GET /ready` (tanpa autentikasi, tanpa data sensitif, tidak dirutekan gateway ke publik kecuali `/health` gateway).

## 6. Contoh Request dan Response

### A-01 Login

```http
POST /api/v1/auth/login
{ "email": "mhs@kampus.example", "password": "<password>" }
```
```json
{
  "data": {
    "accessToken": "<jwt>",
    "expiresIn": 900,
    "user": { "id": "7f0c...", "fullName": "Siti Aminah", "role": "STUDENT" }
  }
}
```
Refresh token dikirim sebagai cookie `HttpOnly`, bukan di body.

### C-13 Buat materi

```json
{
  "competencyId": "a1b2...",
  "title": "Normalisasi Lanjutan",
  "contentType": "ENRICHMENT",
  "format": "MARKDOWN",
  "bodyMarkdown": "# Pengayaan ...",
  "status": "DRAFT"
}
```

### S-06 Tambah soal PG

```json
{
  "type": "MCQ",
  "competencyId": "a1b2...",
  "text": "Bentuk normal ketiga mensyaratkan ...",
  "points": 10,
  "options": [
    { "label": "A", "text": "...", "isCorrect": false },
    { "label": "B", "text": "...", "isCorrect": true }
  ]
}
```

### S-11 Simpan jawaban

```json
{ "selectedOptionId": "c3d4..." }
```
atau untuk esai `{ "essayText": "..." }`.

### S-15 Nilai esai

```json
{ "score": 7.5, "feedback": "Argumen kurang lengkap pada bagian ..." }
```
Respons menyertakan `attemptStatus` (`SUBMITTED` atau `GRADED`).

### S-16 Hasil attempt

```json
{
  "data": {
    "attemptId": "e5f6...",
    "status": "GRADED",
    "totalScore": 72.5,
    "competencyScores": [
      { "competencyId": "a1b2...", "code": "CPMK-1", "score": 55.0 },
      { "competencyId": "b2c3...", "code": "CPMK-2", "score": 90.0 }
    ],
    "pathStatus": "PENDING"
  }
}
```
`pathStatus` = `PENDING` bila jalur belum diproses (eventual consistency).

### P-01 Buat rule

```json
{
  "courseId": "d4e5...",
  "competencyId": null,
  "minScore": 0, "maxScore": 60, "pathType": "REMEDIAL"
}
```

### C-21 / P-06 Jalur sendiri

```json
{
  "data": [
    { "competencyId": "a1b2...", "code": "CPMK-1", "pathType": "REMEDIAL", "score": 55.0, "assignedAt": "2026-10-15T08:00:03Z" },
    { "competencyId": "b2c3...", "code": "CPMK-2", "pathType": "ENRICHMENT", "score": 90.0, "assignedAt": "2026-10-15T08:00:03Z" }
  ]
}
```

## 7. Validasi

Seluruh body/query/param divalidasi dengan skema Zod di lapisan route sebelum controller (aturan di [02 §6](02-requirements.md)). Field tak dikenal ditolak (`strict`). Validasi aturan bisnis (kepemilikan, status, rentang rule) dilakukan di lapisan service.
