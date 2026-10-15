# ADR-002 — Arsitektur Sistem: Microservices, Gateway, Komunikasi

- **Status:** Accepted (inti: 4 layanan, REST + RabbitMQ, gateway; dasar: brief dan Q3) · Proposed (detail pemanggilan internal)
- **Tanggal:** 2026-10-15

## Konteks
Tujuan penelitian: menerapkan microservices pada LMS adaptif dengan 4 domain: Users & Auth, Course & Content, Assessment, Adaptive Path Engine.

## Persyaratan dan Batasan
FR-017/042/043, NFR-002/003/007/010, 1 developer, resource server terbatas.

## Alternatif
| Alternatif | Alasan tidak dipilih |
|---|---|
| Monolith modular | Tidak memenuhi tujuan riset (microservices) |
| Lebih dari 4 layanan (mis. pisah Notification, Gradebook) | Berlebihan untuk skala dan waktu |
| gRPC antarlayanan | Menambah kompleksitas tanpa kebutuhan performa |
| Tanpa gateway (frontend memanggil tiap layanan) | CORS/JWT/rate limit tersebar, dan topologi bocor ke klien |
| Gateway siap pakai (Kong/Traefik) | Beban operasional lebih besar daripada gateway Express |

## Keputusan
1. Empat layanan bisnis + gateway Express (validasi JWT awal, routing, rate limit, correlationId).
2. REST untuk permintaan klien. RabbitMQ untuk alur `assessment.graded` → `learning-path.assigned`.
3. Pemanggilan REST internal ke course-service untuk cek kepemilikan/enrollment (endpoint C-22, `X-Internal-Key`, timeout 3 s, 1 retry) `PROPOSED`.
4. Tidak ada akses DB lintas layanan.

## Konsekuensi
- (+) Batas domain jelas, penskalaan dan kegagalan terisolasi, dan pemisahan penilaian dari adaptif.
- (−) Kompleksitas operasional dan eventual consistency pada jalur belajar.
- (−) Ketergantungan assessment/adaptive pada course-service untuk cek akses. Mitigasi: timeout, error 503 jelas. Caching singkat `Could`.
- Risiko: gateway menjadi titik tunggal kegagalan (diterima untuk skala proyek).

## Referensi
[03](../03-system-architecture.md), [diagrams/container-architecture.md](../diagrams/container-architecture.md).
