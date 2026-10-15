# ERD

**Tujuan:** struktur data per layanan. **Status:** DRAFT. Detail kolom: [04](../04-database-design.md). Atribut bertanda "logical ref" adalah referensi lintas layanan, **bukan foreign key**.

## auth_db

```mermaid
erDiagram
    users ||--o{ refresh_tokens : has
    users {
        uuid id PK
        citext email UK
        text password_hash
        text role
        boolean is_active
        timestamptz deleted_at
    }
    refresh_tokens {
        uuid id PK
        uuid user_id FK
        text token_hash UK
        uuid family_id
        timestamptz expires_at
        timestamptz revoked_at
    }
    audit_logs {
        uuid id PK
        uuid actor_id
        text action
        text entity
        uuid entity_id
        jsonb metadata
    }
```

## course_db

```mermaid
erDiagram
    courses ||--o{ competencies : has
    courses ||--o{ syllabus_topics : has
    courses ||--o{ contents : has
    courses ||--o{ enrollments : has
    competencies ||--o{ contents : tagged
    competencies ||--o{ student_path_assignments : for
    courses ||--o{ student_path_assignments : in
    syllabus_topics |o--o{ contents : groups
    courses {
        uuid id PK
        varchar code UK
        uuid lecturer_id "logical ref users"
        text status
    }
    competencies {
        uuid id PK
        uuid course_id FK
        varchar code
    }
    contents {
        uuid id PK
        uuid course_id FK
        uuid competency_id FK
        text content_type
        text format
        text status
    }
    enrollments {
        uuid id PK
        uuid course_id FK
        uuid student_id "logical ref users"
        text status
    }
    student_path_assignments {
        uuid id PK
        uuid student_id
        uuid competency_id FK
        text path_type
        uuid source_attempt_id
    }
    syllabus_topics {
        uuid id PK
        uuid course_id FK
        int week_no
    }
    processed_events {
        uuid event_id PK
    }
```

## assessment_db

```mermaid
erDiagram
    assessments ||--o{ questions : has
    questions ||--o{ question_options : has
    assessments ||--o{ attempts : has
    attempts ||--o{ answers : has
    questions ||--o{ answers : answered
    assessments {
        uuid id PK
        uuid course_id "logical ref course"
        text status
        timestamptz open_at
        timestamptz close_at
        int max_attempts
    }
    questions {
        uuid id PK
        uuid assessment_id FK
        uuid competency_id "logical ref course"
        text type
        numeric points
    }
    question_options {
        uuid id PK
        uuid question_id FK
        char label
        boolean is_correct
    }
    attempts {
        uuid id PK
        uuid assessment_id FK
        uuid student_id "logical ref users"
        int attempt_no
        text status
        numeric total_score
        jsonb competency_scores
    }
    answers {
        uuid id PK
        uuid attempt_id FK
        uuid question_id FK
        uuid selected_option_id FK
        numeric score
    }
    outbox_events {
        uuid id PK
        text event_type
        jsonb payload
        text status
    }
```

## adaptive_db

```mermaid
erDiagram
    adaptive_rules ||--o{ learning_path_results : applied
    adaptive_rules {
        uuid id PK
        uuid course_id "nullable, NULL=global"
        uuid competency_id "nullable"
        numeric min_score
        numeric max_score
        text path_type
        boolean is_active
    }
    learning_path_results {
        uuid id PK
        uuid student_id
        uuid attempt_id
        uuid competency_id
        numeric score
        text path_type
        uuid rule_id FK
        text status
    }
    outbox_events {
        uuid id PK
        text event_type
        jsonb payload
        text status
    }
    processed_events {
        uuid event_id PK
    }
```
