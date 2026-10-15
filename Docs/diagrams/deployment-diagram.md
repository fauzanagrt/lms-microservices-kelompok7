# Deployment Diagram

**Tujuan:** lingkungan eksekusi. **Status:** DRAFT. Spesifikasi VPS dan domain `TBD` ([10](../10-deployment-guide.md)).

```mermaid
flowchart TB
    U[Pengguna] -->|HTTPS 443| FW[Firewall 80/443/22]
    subgraph VPS[VPS atau mesin lokal: Docker Compose]
      FW --> RP[reverse-proxy]
      RP --> WEB[web]
      RP --> GW[gateway]
      GW --> AUTH[auth-service]
      GW --> CRS[course-service]
      GW --> ASM[assessment-service]
      GW --> ADP[adaptive-service]
      AUTH --> PG[(postgres + volume)]
      CRS --> PG
      ASM --> PG
      ADP --> PG
      ASM --> MQ[rabbitmq + volume]
      ADP --> MQ
      CRS --> MQ
      PG -. pg_dump harian .-> BK[backup dir]
    end
    BK -. salin keluar .-> OFF[Penyimpanan di luar VPS TBD]
```

Hanya reverse-proxy yang memiliki port publik. Jaringan Docker internal untuk lainnya.
