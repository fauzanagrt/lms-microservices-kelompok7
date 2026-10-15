# Sequence Diagrams

**Status:** DRAFT. Alur data end-to-end juga tergambar di sini dan [03 §8](../03-system-architecture.md).

## SD-01 Login dan refresh

```mermaid
sequenceDiagram
    participant W as Web
    participant G as Gateway
    participant A as auth-service
    W->>G: POST /auth/login
    G->>A: teruskan (rate limit)
    A->>A: verifikasi password (Argon2id)
    A-->>W: accessToken (body) + refresh cookie HttpOnly
    Note over W: Access token di memori
    W->>G: POST /auth/refresh (cookie)
    G->>A: teruskan
    A->>A: rotasi, cek reuse
    A-->>W: accessToken baru + cookie baru
```

## SD-02 Mulai attempt (cek akses)

```mermaid
sequenceDiagram
    participant W as Web
    participant G as Gateway
    participant S as assessment-service
    participant C as course-service
    W->>G: POST /assessments/:id/attempts (JWT)
    G->>S: verifikasi JWT, teruskan
    S->>C: GET /internal/courses/:id/access (X-Internal-Key)
    C-->>S: isEnrolled, competencyIds
    S->>S: cek jadwal dan batas attempt, buat attempt
    S-->>W: 201 attempt + soal tanpa kunci
```

## SD-03 Penilaian esai dan publikasi event

```mermaid
sequenceDiagram
    participant L as Dosen
    participant S as assessment-service
    participant DB as assessment_db
    participant R as Outbox relay
    participant MQ as RabbitMQ
    L->>S: PUT .../answers/:qid/grade
    S->>DB: simpan skor
    alt semua jawaban bernilai
        S->>DB: attempt GRADED + outbox (satu transaksi)
        R->>DB: ambil PENDING
        R->>MQ: publish assessment.graded
        R->>DB: tandai PUBLISHED
    end
    S-->>L: 200 attemptStatus
```

## SD-04 Keputusan adaptif

```mermaid
sequenceDiagram
    participant MQ as RabbitMQ
    participant A as adaptive-service
    participant C as course-service
    MQ->>A: assessment.graded
    A->>A: eventId sudah diproses? jika ya ack dan selesai
    A->>A: pilih rule per CPMK
    A->>A: simpan hasil + processed_events + outbox
    A->>MQ: learning-path.assigned
    MQ->>C: deliver
    C->>C: upsert student_path_assignments
    Note over A,MQ: Gagal sementara, retry 3x lalu DLQ
```

## SD-05 Mahasiswa melihat materi sesuai jalur

```mermaid
sequenceDiagram
    participant W as Web
    participant C as course-service
    W->>C: GET /courses/:id/contents (via gateway)
    C->>C: cek enrollment, ambil jalur mahasiswa
    C->>C: filter materi (BR-009)
    C-->>W: materi MAIN + pengayaan/remedial yang berhak
```
