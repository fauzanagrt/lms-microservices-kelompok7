# Activity Flow

**Tujuan:** alur bisnis penilaian hingga jalur belajar, dan algoritma pemilihan rule. **Status:** DRAFT.

## Dari submit hingga jalur

```mermaid
flowchart TD
    A[Mahasiswa submit attempt] --> B[Nilai PG otomatis]
    B --> C{Ada esai?}
    C -- Tidak --> G[Status GRADED]
    C -- Ya --> D[Status SUBMITTED: menunggu dosen]
    D --> E[Dosen menilai esai]
    E --> F{Semua esai bernilai?}
    F -- Tidak --> D
    F -- Ya --> G
    G --> H[Hitung skor per CPMK]
    H --> I[Simpan event ke outbox]
    I --> J[Publish assessment.graded]
    J --> K[Adaptive: pilih rule per CPMK]
    K --> L[Simpan hasil + outbox]
    L --> M[Publish learning-path.assigned]
    M --> N[Course: upsert jalur]
    N --> O[Materi sesuai jalur terlihat]
```

## Pemilihan rule per CPMK (BR-004)

```mermaid
flowchart TD
    S[Skor CPMK] --> R1{Rule aktif spesifik CPMK cocok?}
    R1 -- Ya --> OK[Pakai rule, simpan hasil]
    R1 -- Tidak --> R2{Rule level mata kuliah cocok?}
    R2 -- Ya --> OK
    R2 -- Tidak --> R3{Rule default global cocok?}
    R3 -- Ya --> OK
    R3 -- Tidak --> F[Tandai FAILED dan catat log]
```

Pseudocode:

```
for each (competencyId, score) in event.competencyScores:
    rule = firstMatch([rulesForCompetency, rulesForCourse, globalRules], score)
    # cocok bila min <= score < max, atau max == 100 dan score <= 100
    save result(rule ? ASSIGNED : FAILED)
```
