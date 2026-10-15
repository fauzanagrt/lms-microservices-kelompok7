# 06 — Coding Guidelines

Dokumen ini mengatur **struktur source code dan pembagian tanggung jawab**. Konvensi penamaan, formatting, dan lint ada di [standards/coding-conventions.md](standards/coding-conventions.md). Alur Git di [standards/git-workflow.md](standards/git-workflow.md).

## 1. Struktur Repository (Monorepo, `PROPOSED`)

Struktur Monorepo , sehingga satu repo, satu CI, dan paket bersama mudah dikelola. Lihat ADR-001.

```
lms-adaptive/
├── frontend/              # FE: Antarmuka LMS (Next.js)
│
├── backend/               # BE: API dan microservices
│   ├── gateway/
│   └── services/
│       ├── auth-service/
│       ├── course-service/
│       ├── assessment-service/
│       └── adaptive-service/
│
├── Infra/                # Konfigurasi Docker untuk BE dan layanan pendukung
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── postgres/init/ 
│   └── rabbitmq/
│
├── docs/                  # Dokumentasi proyek dan penelitian
│   ├── adr/
│   ├── diagrams/
│   └── standards/
│
├── tests/                 # Pengujian sistem
│
├── .env.example           # Contoh konfigurasi environment
├── .gitignore
└── README.md
```

## 2. Struktur Satu Layanan

```
services/<nama>-service/
├── src/
│   ├── config/          # baca dan validasi env (Zod), gagal cepat bila kurang
│   ├── modules/<domain>/
│   │   ├── <domain>.routes.ts        # routing + validasi skema
│   │   ├── <domain>.controller.ts    # HTTP in/out saja
│   │   ├── <domain>.service.ts       # logika bisnis
│   │   ├── <domain>.repository.ts    # akses DB
│   │   └── <domain>.schema.ts        # Zod
│   ├── events/          # publisher, consumer, outbox relay, handler
│   ├── middleware/      # auth, requireRole, errorHandler, correlationId
│   ├── lib/             # logger, db client, http client internal
│   ├── app.ts           # rakit Express (tanpa listen, agar mudah dites)
│   └── server.ts        # listen dan graceful shutdown
├── migrations/
├── tests/{unit,integration}/
└── Dockerfile
```

| Lapisan | Boleh | Tidak boleh |
|---|---|---|
| route | Pasang middleware dan validasi | Logika bisnis |
| controller | Ambil input tervalidasi, panggil service, bentuk respons | Query DB, aturan bisnis |
| service | Aturan bisnis, orkestrasi repository dan event | Mengenal `req`/`res` |
| repository | Query DB | Aturan bisnis |

Logika inti yang **harus murni dan mudah dites** (fungsi tanpa I/O): perhitungan skor CPMK (BR-002), pemilihan rule (BR-004), validasi rentang rule.

## 3. Pemisahan Business Logic dan Presentation (Frontend)

- Komponen UI hanya menampilkan dan menangkap input. Pemanggilan API lewat `lib/api` dan hook per fitur (`features/<domain>/hooks`).
- Tidak ada perhitungan skor/penentuan jalur di frontend. Frontend hanya menampilkan hasil dari backend.

## 4. Penanganan Error

- Lempar `AppError(code, httpStatus, message, details?)` dari service. Jangan melempar string.
- Satu `errorHandler` terpusat memetakan ke format baku ([05](05-api-design.md)). Kesalahan tak dikenal → 500 generik.
- Jangan menelan error (`catch {}` kosong). Jika ditangkap, catat atau lempar ulang dengan konteks.
- Handler event: error sementara → lempar agar di-retry, error permanen (payload tidak valid) → `nack` tanpa requeue (ke DLQ).

## 5. Validasi Input

Zod di batas sistem: body/query/param HTTP, payload event yang diterima, dan env. Data di dalam layanan setelah validasi dianggap bertipe benar.

## 6. Environment Variables

- Semua konfigurasi lewat env, dibaca **hanya** di `src/config`.
- `.env.example` berisi nama variabel dengan placeholder, **tanpa nilai asli**. `.env` tidak di-commit.
- Variabel minimum per layanan: `NODE_ENV`, `PORT`, `DATABASE_URL`, `RABBITMQ_URL`, `JWT_PUBLIC_KEY_PATH` (auth: `JWT_PRIVATE_KEY_PATH`), `INTERNAL_API_KEY`, `LOG_LEVEL`. Daftar final dibuat di Tahap 3.

## 7. Dokumentasi Kode

- Komentar menjelaskan **mengapa**, bukan apa. Fungsi publik di `shared` dan logika inti diberi TSDoc singkat.
- Perubahan kontrak API/event/skema wajib memperbarui [05](05-api-design.md), [03](03-system-architecture.md), atau [04](04-database-design.md) pada PR yang sama.

## 8. Dependensi dan Prinsip Clean Code

Aturan menambah package: [standards/dependency-management.md](standards/dependency-management.md). Prinsip: fungsi kecil dan satu tanggung jawab, tidak ada duplikasi (ekstrak setelah muncul kali ketiga), tidak ada *magic number* (konstanta bernama, mis. ambang default di satu tempat), dan tidak ada kode mati.

## 9. Contoh Ilustratif (bukan implementasi)

Bentuk fungsi murni pemilihan rule:

```ts
// Ilustrasi kontrak. Implementasi dibuat di Tahap 6.
type Rule = { id: string; min: number; max: number; pathType: PathType };
function selectRule(score: number, rules: Rule[]): Rule | undefined;
// min inklusif, max eksklusif, kecuali max === 100 (inklusif) — BR-004
```
