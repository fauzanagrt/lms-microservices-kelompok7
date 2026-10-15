# Component Diagram

**Tujuan:** komponen internal layanan (pola yang sama di semua layanan) dan komponen khusus event. **Status:** DRAFT.

```mermaid
flowchart TB
    subgraph Service[Pola umum satu layanan]
      MW[middleware: auth, requireRole, errorHandler, correlationId] --> R[routes + validasi Zod]
      R --> C[controller]
      C --> S[service]
      S --> RP[repository]
      RP --> DB[(DB layanan)]
    end
    subgraph Events[Khusus event]
      S --> OB[(outbox_events)]
      RELAY[outbox relay] --> OB
      RELAY --> MQ{{RabbitMQ}}
      MQ --> CON[consumer + processed_events]
      CON --> S
    end
```

```mermaid
flowchart LR
    subgraph assessment-service
      SC[ScoringCalculator murni]
      GR[GradingService]
    end
    subgraph adaptive-service
      RS[RuleSelector murni]
      RM[RuleManager]
      DEC[DecisionService]
    end
    subgraph course-service
      VIS[ContentVisibility BR-009]
      PA[PathAssignmentConsumer]
    end
    GR --> SC
    DEC --> RS
    DEC --> RM
    PA --> VIS
```

Komponen bertanda "murni" tidak melakukan I/O, dan wajib mendapat unit test paling lengkap.
