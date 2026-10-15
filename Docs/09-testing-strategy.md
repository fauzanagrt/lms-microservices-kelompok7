# 09 — Testing Strategy

Prinsip: uji berbasis risiko. Logika inti (skor, rule, otorisasi, event) diuji paling dalam. UI cukup pada alur kritis. Standar penulisan tes: [standards/testing-standards.md](standards/testing-standards.md). Alat (`PROPOSED`, versi diverifikasi di Tahap 1): Jest + Supertest (backend), React Testing Library (komponen), Playwright (E2E), Testcontainers (PostgreSQL dan RabbitMQ nyata untuk integrasi), k6 (beban).

## 1. Level Pengujian

| Level | Cakupan | Kapan |
|---|---|---|
| Unit | Fungsi murni: skor CPMK, pemilihan rule, validasi rentang rule, validator Zod, util token | Setiap PR |
| Integration | Endpoint + DB nyata (Testcontainers), publikasi outbox, consumer event dengan RabbitMQ nyata | Setiap PR (CI) |
| Contract | Skema payload event dan format error dari `packages/shared` dipakai producer dan consumer | Setiap PR |
| E2E | 3 alur kritis lewat browser: login+RBAC, submit→jalur→materi, dosen mengatur rule | Sebelum rilis |
| Ketahanan | Matikan adaptive/RabbitMQ lalu hidupkan kembali | Tahap 8 |
| Beban | Skenario baca dan submit, 100 pengguna konkuren | Tahap 8 |
| Keamanan | Lihat §5 | Tahap 9 |

## 2. Kriteria Lulus

- Semua tes Must lulus, tidak ada tes yang di-skip tanpa alasan tertulis.
- Cakupan logika domain inti ≥ 70% (NFR-005), dan fungsi murni skor/rule ditargetkan ≥ 90%.
- Lint dan typecheck lulus.
- NFR-001: p95 baca < 500 ms dan tulis < 1 s pada 100 VU di lingkungan uji. Tulis spesifikasi mesin uji pada laporan.

## 3. Data Uji

Data sintetis, tanpa data mahasiswa nyata. Seed dev: 1 admin, 2 dosen, 30 mahasiswa, 2 mata kuliah dengan 3 CPMK, materi tiap jenis, 1 evaluasi campuran PG dan esai. Setiap tes integrasi memakai database bersih (migrasi lalu fixture) dan tidak bergantung urutan.

## 4. Matriks Skenario Utama

| TC | Skenario | FR/NFR | Level |
|---|---|---|---|
| TC-AUTH-01 | Login benar → 200 dan token. Salah → 401 generik. Nonaktif → 403 | FR-001 | Integration |
| TC-AUTH-02 | Refresh merotasi token. Pemakaian ulang token lama mencabut family | FR-002 | Integration |
| TC-AUTH-03 | Logout mencabut refresh token | FR-003 | Integration |
| TC-USER-01 | Admin CRUD dan nonaktifkan pengguna. Non-admin ditolak | FR-004 | Integration |
| TC-USER-02 | Impor CSV: baris valid masuk, tidak valid dilaporkan | FR-005 | Integration |
| TC-RBAC-01 | Matriks peran × endpoint: setiap kombinasi terlarang → 403 | FR-006 | Integration |
| TC-RBAC-02 | IDOR: mahasiswa A membuka attempt/hasil mahasiswa B → 403/404 | FR-006 | Integration |
| TC-CRS-01 | Dosen hanya mengelola mata kuliah miliknya | FR-010, BR-008 | Integration |
| TC-CRS-02 | CPMK tidak dapat dihapus bila dirujuk materi | FR-011 | Integration |
| TC-CNT-01 | Materi MARKDOWN/LINK memenuhi CHECK. CPMK lintas mata kuliah → 422 | FR-013 | Integration |
| TC-ENR-01 | Enroll, duplikasi → 409. Mahasiswa tak ter-enroll → 403 | FR-015, BR-007 | Integration |
| TC-PATH-01 | Visibilitas BR-009: jalur REMEDIAL/ENRICHMENT/MAIN menampilkan materi benar | FR-017 | Integration |
| TC-PATH-02 | Event `learning-path.assigned` ganda tidak menggandakan data | FR-017, NFR-007 | Integration |
| TC-ASM-01 | Soal PG wajib tepat 1 opsi benar. Publikasi tanpa soal ditolak | FR-020–022 | Integration |
| TC-ASM-02 | Soal tidak dapat diubah setelah ada attempt | BR-010 | Integration |
| TC-ATT-01 | Mulai attempt: jadwal, batas attempt, enrollment | FR-023, FR-030 | Integration |
| TC-ATT-02 | Autosave dan lanjut attempt. Auto-submit saat waktu habis | FR-024–025 | Integration |
| TC-ATT-03 | Skor PG otomatis benar. Kunci jawaban tidak bocor di respons mahasiswa | FR-026, SEC-14 | Integration |
| TC-GRD-01 | Skor esai di luar 0..bobot → 422 | FR-027, BR-013 | Integration |
| TC-GRD-02 | Esai terakhir dinilai → GRADED dan tepat 1 event outbox | FR-028 | Integration |
| TC-GRD-03 | Skor CPMK sesuai BR-002 (tes unit dengan beberapa kombinasi) | FR-028 | Unit |
| TC-RULE-01 | Rentang tumpang tindih atau berlubang → 422 | FR-040 | Unit+Integration |
| TC-RULE-02 | Presedensi rule CPMK > mata kuliah > global | BR-004 | Unit |
| TC-ADP-01 | Batas skor: 59.99→REMEDIAL, 60→MAIN, 79.99→MAIN, 80→ENRICHMENT, 100→ENRICHMENT | FR-042 | Unit |
| TC-ADP-02 | Consumer menyimpan hasil dengan `rule_id`, `score`, `decided_at` | FR-046 | Integration |
| TC-ADP-03 | Attempt lebih baru menggantikan keputusan lama | BR-006 | Integration |
| TC-ADP-04 | Payload event tidak valid → DLQ tanpa merusak consumer | NFR-007 | Integration |
| TC-RES-01 | Adaptive dimatikan saat submit: submit tetap sukses dan event diproses saat pulih | NFR-002 | Ketahanan |
| TC-RES-02 | RabbitMQ mati saat GRADED: event tetap di outbox lalu terkirim | NFR-002 | Ketahanan |
| TC-E2E-01..03 | Tiga alur kritis (§1) | SC-02 | E2E |
| TC-LOAD-01 | Baca daftar mata kuliah/materi 100 VU | NFR-001 | Beban |
| TC-LOAD-02 | Submit serentak 50 mahasiswa, adaptif selesai ≤ 10 detik | NFR-001, NFR-012 | Beban |
| TC-SEC-* | Lihat §5 | NFR-004 | Keamanan |
| TC-DEP-01 | `docker compose up` dari bersih, health semua hijau, smoke test | NFR-009 | Smoke |
| TC-DEP-02 | Backup dan restore database | NFR-011 | Manual |

## 5. Pengujian Keamanan (TC-SEC)

TC-SEC-01 token kedaluwarsa/dipalsukan/algoritma `none` ditolak. TC-SEC-02 rate limit login. TC-SEC-03 SQL injection pada parameter filter/sort. TC-SEC-04 XSS pada Markdown dan esai tidak tereksekusi. TC-SEC-05 mass assignment (mis. mengirim `role` pada update profil). TC-SEC-06 `/internal/*` tidak terjangkau dari gateway. TC-SEC-07 flag cookie refresh. TC-SEC-08 `npm audit` tanpa High/Critical. TC-SEC-09 tidak ada secret di repo (gitleaks).

## 6. Responsif dan Kompatibilitas

Uji manual pada lebar 360, 768, dan 1280 px, serta Chrome dan Firefox versi terbaru. Safari `Could`.

## 7. Pelaporan

Hasil dicatat di `docs/test-reports/` (dibuat saat tahap pengujian). **Tidak ada klaim "lulus" tanpa laporan.** Dokumen ini hanya rancangan.
