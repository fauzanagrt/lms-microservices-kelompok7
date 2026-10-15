# 02 — Requirements Specification

Prioritas memakai MoSCoW: **M**ust, **S**hould, **C**ould, **W**on't. Penomoran layanan: AUTH, CRS (Course), ASM (Assessment), ADP (Adaptive).

## 1. Aktor dan Hak Akses

| Aktor | Deskripsi |
|---|---|
| ADMIN | Mengelola pengguna dan enrollment, dapat melihat semua mata kuliah |
| LECTURER | Mengelola mata kuliah miliknya, materi, soal, penilaian esai, rule adaptif |
| STUDENT | Mengakses mata kuliah yang diikuti, mengerjakan evaluasi, melihat hasil dan jalur |
| SYSTEM | Consumer event (Adaptive Engine, Course & Content) |

Matriks hak akses ringkas (rinci per endpoint ada di [05](05-api-design.md)):

| Sumber daya | ADMIN | LECTURER | STUDENT |
|---|---|---|---|
| Pengguna | CRUD | Lihat diri | Lihat diri |
| Mata kuliah | CRUD semua | CRUD miliknya | Baca yang di-enroll |
| Enrollment | Kelola semua | Kelola mata kuliah miliknya | Lihat diri |
| Materi dan CPMK | Baca semua | CRUD miliknya | Baca sesuai aturan visibilitas (BR-009) |
| Evaluasi dan soal | Baca semua | CRUD miliknya | Kerjakan (tanpa kunci jawaban) |
| Penilaian esai | — | Nilai miliknya | — |
| Rule adaptif | Baca semua | CRUD miliknya | — |
| Jalur belajar | Baca semua | Baca mahasiswa miliknya | Baca diri sendiri |

## 2. Kebutuhan Fungsional

### Users & Auth

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-001 | Pengguna login dengan email dan password | M |
| FR-002 | Sistem menerbitkan access token pendek dan refresh token, dan dapat memperbarui sesi | M |
| FR-003 | Pengguna logout dan refresh token dicabut | M |
| FR-004 | Admin membuat, melihat, mengubah, dan menonaktifkan akun | M |
| FR-005 | Admin mengimpor akun massal dari CSV | S |
| FR-006 | Akses sumber daya dibatasi berdasarkan peran (RBAC) | M |
| FR-007 | Pengguna mengganti password sendiri | S |
| FR-008 | Pengguna melihat profil sendiri | M |

### Course & Content

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-010 | Dosen/admin CRUD mata kuliah (status DRAFT/PUBLISHED/ARCHIVED) | M |
| FR-011 | Dosen mengelola CPMK per mata kuliah | M |
| FR-012 | Dosen mengelola topik silabus per mata kuliah | S |
| FR-013 | Dosen mengelola materi dengan jenis MAIN/ENRICHMENT/REMEDIAL, terhubung ke CPMK, berformat teks Markdown atau tautan | M |
| FR-014 | Dosen mempublikasikan atau menarik materi | M |
| FR-015 | Admin/dosen mendaftarkan dan mengeluarkan mahasiswa dari mata kuliah | M |
| FR-016 | Mahasiswa melihat mata kuliah yang diikuti dan materi yang boleh diakses | M |
| FR-017 | Course & Content menerima keputusan jalur dan mengatur visibilitas materi ENRICHMENT/REMEDIAL per mahasiswa per CPMK | M |
| FR-018 | Mahasiswa menandai materi selesai | C |

### Assessment

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-020 | Dosen membuat evaluasi (judul, jadwal, durasi, batas percobaan) | M |
| FR-021 | Dosen membuat soal PG (opsi, kunci, bobot) yang ditautkan ke CPMK | M |
| FR-022 | Dosen membuat soal esai (bobot, rubrik) yang ditautkan ke CPMK | M |
| FR-023 | Mahasiswa memulai attempt pada evaluasi yang dibuka dan memenuhi syarat | M |
| FR-024 | Jawaban attempt tersimpan bertahap (autosave) | M |
| FR-025 | Mahasiswa men-submit attempt, atau auto-submit saat waktu habis | M |
| FR-026 | Sistem menilai soal PG otomatis saat submit | M |
| FR-027 | Dosen menilai jawaban esai (skor 0..bobot dan umpan balik) | M |
| FR-028 | Saat semua jawaban sudah bernilai, attempt berstatus GRADED dan sistem menerbitkan event `assessment.graded` berisi skor per CPMK | M |
| FR-029 | Mahasiswa melihat hasil attempt dan umpan balik | M |
| FR-030 | Batas waktu dan batas jumlah attempt ditegakkan | S |
| FR-031 | Pengacakan urutan soal dan opsi | C |

### Adaptive Path Engine

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-040 | Dosen mengelola rule (rentang skor → jenis jalur) per mata kuliah dan opsional per CPMK | M |
| FR-041 | Tersedia rule default global (BR-005) bila dosen belum mengatur | M |
| FR-042 | Engine mengonsumsi `assessment.graded` dan menetapkan jalur per CPMK sesuai rule | M |
| FR-043 | Engine menerbitkan `learning-path.assigned` | M |
| FR-044 | Mahasiswa melihat jalur belajarnya | M |
| FR-045 | Dosen melihat rekap jalur per mata kuliah | S |
| FR-046 | Setiap keputusan menyimpan skor, rule yang dipakai, dan waktu (auditable) | M |
| FR-047 | Rekomendasi berbasis ML | W |

### Lain-lain (Won't)

FR-050 notifikasi, FR-051 upload/streaming video, FR-052 forum, FR-053 self-registration: **W** tahap ini.

## 3. Kebutuhan Nonfungsional

| ID | Kategori | Kebutuhan | Prioritas |
|---|---|---|---|
| NFR-001 | Performa | p95 latensi endpoint baca < 500 ms dan endpoint tulis < 1 s pada 100 pengguna konkuren di lingkungan uji | M |
| NFR-002 | Ketahanan | Submit evaluasi tetap berhasil jika Adaptive Engine atau RabbitMQ sementara tidak tersedia, dan event terkirim setelah pulih (outbox) | M |
| NFR-003 | Skalabilitas | Setiap layanan dapat dijalankan sebagai container terpisah dan stateless, sehingga dapat direplikasi | M |
| NFR-004 | Keamanan | Password di-hash (Argon2id), HTTPS di VPS, RBAC di setiap endpoint, detail di [08](08-security-guidelines.md) | M |
| NFR-005 | Maintainability | Setiap layanan punya batas modul jelas, lint/type check lulus, cakupan tes logika domain inti ≥ 70% | M |
| NFR-006 | Observability | Log terstruktur JSON dengan `correlationId`, endpoint `/health` dan `/ready` | M |
| NFR-007 | Reliabilitas pesan | Event at-least-once dan consumer idempoten | M |
| NFR-008 | Usability | Antarmuka responsif (≥ 360 px), dan state loading/empty/error konsisten | S |
| NFR-009 | Deployability | Seluruh sistem dapat dijalankan dengan `docker compose up` | M |
| NFR-010 | Integritas data | Tidak ada foreign key lintas layanan, dan referensi lintas layanan divalidasi di aplikasi | M |
| NFR-011 | Pemulihan | Backup database harian dan prosedur restore teruji | S |
| NFR-012 | Latensi adaptif | Jalur ditetapkan ≤ 10 detik setelah attempt GRADED pada kondisi normal | S |

## 4. Business Rules

| ID | Aturan |
|---|---|
| BR-001 | Semua skor memakai skala 0–100 (desimal 2 digit). |
| BR-002 | Skor CPMK = (Σ poin diperoleh pada soal CPMK tsb / Σ poin maksimum soal CPMK tsb) × 100. |
| BR-003 | Engine hanya diproses untuk attempt berstatus GRADED. Attempt dengan esai belum dinilai belum memicu event. |
| BR-004 | Pencocokan rule: rule spesifik CPMK > rule level mata kuliah (CPMK null) > rule default global. Rentang `[min, max)`, kecuali rentang yang berakhir di 100 bersifat inklusif. Rentang dalam satu scope tidak boleh tumpang tindih dan harus menutup 0–100 (divalidasi saat disimpan). |
| BR-005 | Default global: skor < 60 → REMEDIAL, 60 ≤ skor < 80 → MAIN, skor ≥ 80 → ENRICHMENT. |
| BR-006 | Pada beberapa attempt, keputusan dari attempt GRADED terbaru menggantikan keputusan sebelumnya untuk CPMK yang sama. `PROPOSED` |
| BR-007 | Mahasiswa hanya mengakses mata kuliah yang di-enroll dan berstatus PUBLISHED. |
| BR-008 | Dosen hanya mengelola sumber daya mata kuliah yang ia miliki (`lecturer_id`). |
| BR-009 | Materi MAIN yang PUBLISHED terlihat oleh mahasiswa ter-enroll. ENRICHMENT/REMEDIAL untuk suatu CPMK hanya terlihat bila jalur mahasiswa pada CPMK itu bertipe sama. Untuk jalur MAIN, hanya materi MAIN yang terlihat. |
| BR-010 | Soal evaluasi tidak dapat diubah/dihapus setelah ada attempt. |
| BR-011 | Pengguna dinonaktifkan (soft delete), tidak dihapus fisik. |
| BR-012 | CPMK tanpa soal pada suatu evaluasi tidak dievaluasi oleh evaluasi tersebut. |
| BR-013 | Skor esai berada pada 0..bobot soal. |
| BR-014 | Mahasiswa melihat skor dan umpan balik setelah GRADED, tetapi tidak melihat kunci jawaban PG. `PROPOSED` |
| BR-015 | Evaluasi hanya dapat dikerjakan antara `open_at` dan `close_at`, dan durasi per attempt dibatasi `duration_minutes`. |

## 5. Use Case

| ID | Use case | Aktor |
|---|---|---|
| UC-01 | Login dan kelola sesi | Semua |
| UC-02 | Kelola pengguna dan impor CSV | ADMIN |
| UC-03 | Kelola mata kuliah, CPMK, silabus | LECTURER, ADMIN |
| UC-04 | Kelola materi (MAIN/ENRICHMENT/REMEDIAL) | LECTURER |
| UC-05 | Kelola enrollment | ADMIN, LECTURER |
| UC-06 | Buat evaluasi dan soal | LECTURER |
| UC-07 | Kerjakan dan submit evaluasi | STUDENT |
| UC-08 | Nilai esai | LECTURER |
| UC-09 | Atur rule adaptif | LECTURER |
| UC-10 | Lihat jalur belajar dan materi sesuai jalur | STUDENT |
| UC-11 | Pantau rekap jalur kelas | LECTURER |

### Alur utama UC-07 → UC-10 (end-to-end)

1. Mahasiswa memulai attempt (cek enrollment, jadwal, batas attempt).
2. Mahasiswa menjawab dan autosave, lalu submit.
3. Assessment menilai PG otomatis.
4. Bila ada esai, status `SUBMITTED` menunggu dosen menilai (UC-08). Bila tidak ada esai, langsung `GRADED`.
5. Saat `GRADED`, event `assessment.graded` dicatat di outbox lalu dipublikasikan.
6. Adaptive Engine memilih rule per CPMK, menyimpan hasil, dan menerbitkan `learning-path.assigned`.
7. Course & Content menyimpan penugasan jalur. Mahasiswa melihat materi sesuai jalur (BR-009).

### Alur alternatif dan kegagalan

| Kondisi | Perilaku |
|---|---|
| Waktu habis sebelum submit | Auto-submit dengan jawaban tersimpan terakhir |
| Dosen belum menilai esai | Attempt tetap `SUBMITTED`, tidak ada event, mahasiswa melihat status "menunggu penilaian" |
| RabbitMQ tidak tersedia saat GRADED | Event tetap di outbox dan dipublikasikan ulang oleh relay |
| Adaptive Engine mati | Pesan menunggu di queue dan diproses saat layanan pulih |
| Pesan gagal diproses 3 kali | Masuk DLQ dan ditinjau manual |
| Tidak ada rule yang cocok | Pakai default global (BR-004). Jika tetap gagal, keputusan ditandai `FAILED` dan dicatat log |
| Event duplikat | Diabaikan (tabel `processed_events`) |
| Mahasiswa tidak ter-enroll | 403 pada endpoint terkait |

## 6. Validasi Input (aturan umum)

| Field | Aturan |
|---|---|
| email | format valid, maks 255, unik (case-insensitive) |
| password | min 10 karakter, kombinasi huruf dan angka |
| UUID | format UUID v4/v7 |
| skor | angka 0–100 (esai: 0..bobot) |
| rule | `0 ≤ min < max ≤ 100`, tanpa tumpang tindih |
| teks bebas (judul/nama) | trim, 1–200 karakter |
| Markdown materi | maks 100 KB, disanitasi saat render (lihat [08](08-security-guidelines.md)) |
| URL materi | skema `https` saja |
| pagination | `page ≥ 1`, `limit` 1–100 (default 20) |

## 7. Acceptance Criteria (kebutuhan Must utama)

| FR | Acceptance criteria (Given/When/Then, ringkas) |
|---|---|
| FR-001 | Given akun aktif, When kredensial benar, Then 200 dengan access token. Kredensial salah → 401 pesan generik. Akun nonaktif → 403. |
| FR-006 | Given STUDENT, When memanggil endpoint khusus LECTURER, Then 403. |
| FR-013 | Given dosen pemilik, When membuat materi dengan `contentType` dan `competencyId` valid, Then 201. CPMK dari mata kuliah lain → 422. |
| FR-017 | Given jalur REMEDIAL pada CPMK-1, When mahasiswa melihat materi, Then materi REMEDIAL CPMK-1 terlihat dan ENRICHMENT CPMK-1 tidak. |
| FR-026 | Given PG benar/salah, When submit, Then skor PG = Σ bobot jawaban benar. |
| FR-028 | Given semua jawaban bernilai, Then status GRADED dan tepat satu event dibuat di outbox. |
| FR-040 | Given rentang tumpang tindih, When disimpan, Then 422 dengan detail. |
| FR-042 | Given skor CPMK 55, rule default, Then hasil REMEDIAL. Skor 80 → ENRICHMENT. Skor 79.99 → MAIN. |
| FR-046 | Given keputusan dibuat, Then tersimpan `rule_id`, `score`, `decided_at`. |

## 8. Keterlacakan Kebutuhan

Kolom Endpoint merujuk ID di [05](05-api-design.md), Tabel merujuk [04](04-database-design.md), TC merujuk [09](09-testing-strategy.md).

| FR | Layanan | Endpoint | Tabel utama | TC |
|---|---|---|---|---|
| FR-001–003, 008 | auth | A-01–A-04 | users, refresh_tokens | TC-AUTH |
| FR-004–005, 007 | auth | A-05–A-11 | users, audit_logs | TC-USER |
| FR-006 | semua | semua | — | TC-RBAC |
| FR-010–012 | course | C-01–C-12 | courses, competencies, syllabus_topics | TC-CRS |
| FR-013–014, 016, 018 | course | C-13–C-17 | contents | TC-CNT |
| FR-015 | course | C-18–C-20 | enrollments | TC-ENR |
| FR-017 | course | C-21, consumer event | student_path_assignments, processed_events | TC-PATH |
| FR-020–022, 030–031 | assessment | S-01–S-08 | assessments, questions, question_options | TC-ASM |
| FR-023–026, 029 | assessment | S-09–S-12, S-16 | attempts, answers | TC-ATT |
| FR-027–028 | assessment | S-13–S-15 | answers, attempts, outbox_events | TC-GRD |
| FR-040–041 | adaptive | P-01–P-04 | adaptive_rules | TC-RULE |
| FR-042–043, 046 | adaptive | consumer event | learning_path_results, outbox_events, processed_events | TC-ADP |
| FR-044–045 | adaptive | P-05–P-07 | learning_path_results | TC-ADP |
