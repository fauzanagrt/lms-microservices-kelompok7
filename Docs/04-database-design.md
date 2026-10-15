# 04 — Database Design

## 1. Teknologi dan Alasan

**PostgreSQL** `APPROVED` (brief): relasional, transaksi ACID (penting untuk nilai dan outbox), tipe `jsonb` untuk payload event, dan ekosistem Node matang.

**Topologi** `APPROVED` (Q4): satu instance PostgreSQL, empat database terpisah: `auth_db`, `course_db`, `assessment_db`, `adaptive_db`. Masing-masing diakses oleh satu role DB milik layanannya (least privilege). **Tidak ada foreign key lintas database.** Referensi lintas layanan disimpan sebagai `uuid` tanpa FK (ditandai *logical ref*) dan divalidasi di aplikasi.

Konvensi umum: tabel `snake_case` jamak, PK `id uuid` (default `gen_random_uuid()`), `created_at`/`updated_at timestamptz` (UTC), enum sebagai `text` + `CHECK` (lebih mudah dimigrasi daripada tipe enum native). `PROPOSED`

## 2. auth_db

**users**

| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| email | citext | UNIQUE, NOT NULL |
| password_hash | text | NOT NULL |
| full_name | varchar(150) | NOT NULL |
| role | text | NOT NULL, CHECK IN (ADMIN, LECTURER, STUDENT) |
| identity_number | varchar(30) | NIM/NIDN, UNIQUE bila tidak null |
| is_active | boolean | NOT NULL default true |
| deleted_at | timestamptz | NULL (soft delete) |
| created_at, updated_at | timestamptz | NOT NULL |

**refresh_tokens**

| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → users(id) ON DELETE CASCADE |
| token_hash | text | UNIQUE, NOT NULL (hash SHA-256, token asli tidak disimpan) |
| family_id | uuid | NOT NULL (deteksi reuse) |
| expires_at | timestamptz | NOT NULL |
| revoked_at | timestamptz | NULL |
| created_at | timestamptz | NOT NULL |

**audit_logs**: `id`, `actor_id` (uuid), `action` (text), `entity` (text), `entity_id` (uuid), `metadata` (jsonb, tanpa data sensitif), `created_at`. Hanya INSERT. Index `(entity, entity_id)`, `(created_at)`.

Index: `users(role)`, `users(is_active)`, `refresh_tokens(user_id)`, `refresh_tokens(family_id)`, `refresh_tokens(expires_at)`.

## 3. course_db

**courses**: `id`, `code` varchar(20) UNIQUE, `name` varchar(200), `description` text, `lecturer_id` uuid *(logical ref → users)*, `academic_year` varchar(9), `semester` text CHECK (GANJIL, GENAP, PENDEK), `status` text CHECK (DRAFT, PUBLISHED, ARCHIVED) default DRAFT, timestamps. Index `(lecturer_id)`, `(status)`.

**competencies** (CPMK): `id`, `course_id` FK→courses ON DELETE RESTRICT, `code` varchar(20), `description` text, `order_no` int. UNIQUE `(course_id, code)`.

**syllabus_topics**: `id`, `course_id` FK→courses, `week_no` int CHECK 1..20, `title`, `description`, UNIQUE `(course_id, week_no, title)`.

**contents**

| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| course_id | uuid | FK → courses |
| competency_id | uuid | FK → competencies, NOT NULL |
| topic_id | uuid | FK → syllabus_topics, NULL |
| title | varchar(200) | NOT NULL |
| content_type | text | CHECK IN (MAIN, ENRICHMENT, REMEDIAL) |
| format | text | CHECK IN (MARKDOWN, LINK) |
| body_markdown | text | NULL, wajib bila MARKDOWN, maks 100 KB |
| url | text | NULL, wajib bila LINK, skema https |
| status | text | CHECK IN (DRAFT, PUBLISHED), default DRAFT |
| order_no | int | NOT NULL default 0 |
| timestamps | | |

Constraint: `CHECK ((format='MARKDOWN' AND body_markdown IS NOT NULL AND url IS NULL) OR (format='LINK' AND url IS NOT NULL AND body_markdown IS NULL))`. Index `(course_id, competency_id, content_type, status)`.

**enrollments**: `id`, `course_id` FK→courses, `student_id` uuid *(logical ref)*, `status` CHECK (ACTIVE, DROPPED), `enrolled_at`. UNIQUE `(course_id, student_id)`. Index `(student_id)`.

**student_path_assignments**: `id`, `student_id` uuid, `course_id` FK→courses, `competency_id` FK→competencies, `path_type` CHECK (MAIN, ENRICHMENT, REMEDIAL), `source_assessment_id` uuid *(logical ref)*, `source_attempt_id` uuid, `assigned_at`. UNIQUE `(student_id, competency_id)` (upsert, BR-006).

**processed_events**: `event_id uuid PK`, `event_type`, `processed_at`.

## 4. assessment_db

**assessments**: `id`, `course_id` uuid *(logical ref)*, `title`, `description`, `status` CHECK (DRAFT, PUBLISHED, CLOSED), `open_at`, `close_at` (CHECK close_at > open_at), `duration_minutes` int CHECK > 0, `max_attempts` int default 1 CHECK ≥ 1, `created_by` uuid, timestamps. Index `(course_id, status)`.

**questions**: `id`, `assessment_id` FK→assessments ON DELETE CASCADE, `competency_id` uuid *(logical ref)*, `type` CHECK (MCQ, ESSAY), `text`, `points` numeric(6,2) CHECK > 0, `rubric` text (esai), `order_no`. Index `(assessment_id, competency_id)`.

**question_options**: `id`, `question_id` FK→questions ON DELETE CASCADE, `label` char(1), `text`, `is_correct` boolean. UNIQUE `(question_id, label)`. Aturan aplikasi: tepat 1 opsi benar per soal PG.

**attempts**

| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| assessment_id | uuid | FK → assessments |
| student_id | uuid | logical ref |
| attempt_no | int | UNIQUE `(assessment_id, student_id, attempt_no)` |
| status | text | CHECK IN (IN_PROGRESS, SUBMITTED, GRADED) |
| started_at / expires_at / submitted_at / graded_at | timestamptz | |
| total_score | numeric(5,2) | NULL sampai GRADED |
| competency_scores | jsonb | NULL sampai GRADED, `[{competencyId, score, earned, max}]` |

Index `(student_id, assessment_id)`, `(assessment_id, status)`.

**answers**: `id`, `attempt_id` FK→attempts ON DELETE CASCADE, `question_id` FK→questions, `selected_option_id` FK→question_options NULL, `essay_text` text NULL, `score` numeric(6,2) NULL, `is_auto_graded` boolean, `feedback` text, `graded_by` uuid, `graded_at`. UNIQUE `(attempt_id, question_id)`. Index `(attempt_id)`.

**outbox_events**: `id uuid PK` (= eventId), `event_type`, `payload jsonb`, `status` CHECK (PENDING, PUBLISHED), `created_at`, `published_at`, `attempts int`. Index `(status, created_at)`.

## 5. adaptive_db

**adaptive_rules**: `id`, `course_id` uuid NULL *(NULL = default global)*, `competency_id` uuid NULL *(NULL = level mata kuliah)*, `min_score` numeric(5,2), `max_score` numeric(5,2), `path_type` CHECK (MAIN, ENRICHMENT, REMEDIAL), `is_active`, `created_by`, timestamps. CHECK `0 ≤ min_score < max_score ≤ 100`. Index `(course_id, competency_id, is_active)`. Keanggotaan rentang tidak tumpang tindih divalidasi di aplikasi per scope (transaksi), dan dapat dikuatkan dengan exclusion constraint `PROPOSED`.

**learning_path_results**: `id`, `student_id`, `course_id`, `assessment_id`, `attempt_id`, `competency_id` (semuanya logical ref), `score` numeric(5,2), `path_type`, `rule_id` FK→adaptive_rules NULL, `status` CHECK (ASSIGNED, FAILED), `decided_at`. UNIQUE `(attempt_id, competency_id)`. Index `(student_id, course_id)`, `(course_id, path_type)`.

**outbox_events**, **processed_events**: sama seperti di assessment_db dan course_db.

## 6. ERD

ERD Mermaid per layanan ada di [diagrams/erd.md](diagrams/erd.md) (sumber tunggal agar tidak duplikat).

## 7. Migration dan Seeding

- Migration per layanan, berurutan dan bernomor, disimpan di `services/<nama>/migrations/`. Alat: sesuai ADR-007 (`TBD`, Prisma Migrate atau Knex).
- Prinsip: *forward-only* di produksi, setiap migration dapat ditinjau, dan perubahan destruktif dilakukan bertahap (expand → migrate → contract).
- Migration dijalankan oleh langkah terpisah (`docker compose run --rm <svc> migrate`), bukan otomatis saat start di produksi.
- Seed:
  - **Wajib (semua env):** rule default global (BR-005) dan akun admin awal (password dari env, bukan di repo).
  - **Dev/test saja:** data contoh dosen, mahasiswa, mata kuliah, CPMK, materi, evaluasi.

## 8. Backup dan Pemulihan

- `pg_dump` harian per database (retensi 7 harian + 4 mingguan) ke direktori di luar volume data, lalu disalin keluar VPS (`TBD` tujuan).
- Uji restore minimal sekali sebelum go-live dan setelah perubahan skema besar.
- RPO ≤ 24 jam dan RTO ≤ 4 jam (target proyek akademik, `PROPOSED`).

## 9. Penghapusan dan Retensi

| Data | Aturan |
|---|---|
| users | Soft delete, tidak dihapus fisik (BR-011) |
| courses | Diarsipkan (`ARCHIVED`), bukan dihapus |
| competencies/contents | Hapus hanya jika belum dirujuk (RESTRICT), jika tidak, nonaktifkan |
| attempts/answers | Dipertahankan selama mata kuliah ada (bukti penilaian) |
| refresh_tokens | Dibersihkan berkala setelah kedaluwarsa + 30 hari |
| outbox_events PUBLISHED | Dibersihkan setelah 30 hari |
| processed_events | Dibersihkan setelah 30 hari |
| audit_logs | Dipertahankan ≥ 1 tahun (`TBD`, ikuti kebijakan kampus) |

## 10. Akses dan Perlindungan Data Sensitif

- Role DB terpisah per layanan dengan hak hanya pada database miliknya. Akun superuser tidak dipakai aplikasi.
- Data sensitif: password (hash Argon2id), token refresh (hash), email/identitas, dan jawaban/nilai mahasiswa. Tidak dicatat di log.
- Koneksi DB hanya di jaringan internal Docker, dan port 5432 tidak dipublikasikan ke host di produksi.
- Query selalu berparameter (tidak ada string concatenation).
