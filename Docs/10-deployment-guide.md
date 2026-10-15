# 10 — Deployment Guide

Dokumen ini adalah **rancangan** (`PROPOSED`). Belum ada yang dijalankan atau diverifikasi. Spesifikasi VPS, penyedia, dan domain belum diketahui (`TBD`, AS-06), dan tidak diasumsikan tersedia.

## 1. Target Environment

| Environment | Tujuan | Catatan |
|---|---|---|
| `dev` | Pengembangan lokal | Compose, port layanan dipublikasikan ke host |
| `staging/uji` | Uji beban dan E2E | Compose, dapat di VPS yang sama bila resource cukup |
| `prod` | Demo/penggunaan nyata | Compose + reverse proxy, hanya 80/443 publik |

Perkiraan kebutuhan minimum VPS (perlu diukur saat uji beban): 2 vCPU, 4 GB RAM, 40 GB disk `TBD`. Ada 8 container (web, gateway, 4 layanan, PostgreSQL, RabbitMQ) ditambah reverse proxy.

## 2. Persyaratan Runtime

- Docker Engine dan Docker Compose plugin.
- Node.js LTS hanya untuk pengembangan lokal non-container. Versi mengikuti `.nvmrc` yang ditetapkan di Tahap 1 setelah verifikasi ke dokumentasi resmi.
- Git.

## 3. Konfigurasi Environment (placeholder)

Disimpan di `.env` per environment, tidak di-commit. Contoh format `.env.example`:

```
NODE_ENV=production
POSTGRES_HOST=postgres
POSTGRES_AUTH_URL=postgres://<auth_user>:<password>@postgres:5432/auth_db
POSTGRES_COURSE_URL=postgres://<course_user>:<password>@postgres:5432/course_db
POSTGRES_ASSESSMENT_URL=postgres://<assessment_user>:<password>@postgres:5432/assessment_db
POSTGRES_ADAPTIVE_URL=postgres://<adaptive_user>:<password>@postgres:5432/adaptive_db
RABBITMQ_URL=amqp://<mq_user>:<password>@rabbitmq:5672/lms
INTERNAL_API_KEY=<random-long-string>
JWT_PRIVATE_KEY_PATH=/run/secrets/jwt_private.pem
JWT_PUBLIC_KEY_PATH=/run/secrets/jwt_public.pem
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
CORS_ALLOWED_ORIGINS=https://<domain>
INITIAL_ADMIN_EMAIL=<email>
INITIAL_ADMIN_PASSWORD=<set-at-first-deploy-then-change>
LOG_LEVEL=info
```

Semua nilai `<...>` diisi di server, tidak pernah ditulis ke repo atau dokumentasi.

## 4. Langkah Instalasi dan Menjalankan (rancangan)

1. Clone repository dan salin `.env.example` menjadi `.env`, lalu isi nilai.
2. Buat keypair JWT (RS256) dan letakkan sebagai secret file (private hanya untuk auth-service).
3. `docker compose -f infra/docker-compose.yml -f infra/docker-compose.prod.yml build`.
4. Jalankan PostgreSQL dan RabbitMQ, lalu **migrasi** tiap layanan (`docker compose run --rm <svc> migrate`) dan seed wajib (rule default, admin awal).
5. `docker compose up -d`.
6. Verifikasi `GET /health` dan `/ready` setiap layanan, lalu login admin dan ubah password awal.

Perintah dan nama skrip final ditetapkan di Tahap 1 dan 10.

## 5. Migrasi Database

Dijalankan manual terpisah dari start aplikasi di produksi. Cadangkan database **sebelum** migrasi. Strategi di [04 §7](04-database-design.md).

## 6. Hosting, Domain, dan HTTPS

- Reverse proxy (Caddy atau Nginx, `TBD`): `/api/*` → gateway, selain itu → web. Hanya port 80/443 publik.
- HTTPS dengan sertifikat otomatis (Let's Encrypt) **bila ada domain**. Tanpa domain, jalankan HTTP di jaringan lokal/kampus, dan SEC-05 (`Secure` cookie) perlu penyesuaian (ADR baru).
- Firewall dan SSH sesuai [08 §6](08-security-guidelines.md).

## 7. CI/CD

`TBD` (platform belum ditentukan). Usulan minimum `PROPOSED`: pipeline lint, typecheck, unit dan integrasi, `npm audit`, build image. Deploy manual melalui SSH + `docker compose pull/up` pada tahap awal, dan otomatisasi `Could`.

## 8. Health Check dan Monitoring

- Healthcheck Compose memakai `/ready` tiap layanan, `depends_on: condition: service_healthy` untuk PG dan RabbitMQ.
- Pantau: `docker compose ps`, log JSON, jumlah pesan di DLQ (RabbitMQ UI via SSH tunnel), disk dan memori VPS.
- Alarm sederhana (uptime checker eksternal) `Could`.

## 9. Backup dan Rollback

- Backup: `pg_dump` terjadwal (cron) sesuai [04 §8](04-database-design.md), salin ke luar VPS.
- Rollback aplikasi: simpan image bertag versi, lalu `docker compose up -d` dengan tag sebelumnya.
- Rollback skema: restore dari backup pra-migrasi (migrasi *forward-only*), sehingga migrasi destruktif harus bertahap.

## 10. Troubleshooting (awal)

| Gejala | Kemungkinan penyebab | Tindakan |
|---|---|---|
| Layanan tidak `ready` | DB/RabbitMQ belum siap atau kredensial salah | Periksa log, `.env`, dan healthcheck dependensi |
| 401 di semua layanan selain auth | Public key tidak sama dengan private key auth | Cocokkan keypair, dan restart layanan |
| Jalur belajar tidak muncul | Consumer/adaptive mati atau pesan di DLQ | Cek `adaptive.assessment-graded.dlq`, log adaptive, outbox `PENDING` |
| Outbox menumpuk `PENDING` | RabbitMQ tidak terjangkau | Pulihkan RabbitMQ, dan relay akan mengirim ulang |
| CORS error | `CORS_ALLOWED_ORIGINS` tidak cocok | Sesuaikan origin |
| Cookie refresh tidak terkirim | HTTPS tidak aktif atau `SameSite`/path | Lihat §6 dan [08](08-security-guidelines.md) |
