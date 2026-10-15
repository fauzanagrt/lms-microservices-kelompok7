# ADR-005 — Strategi Deployment

- **Status:** Accepted (Docker Compose di VPS/lokal, dasar: brief) · Proposed (reverse proxy, CI/CD) · TBD (penyedia VPS, domain)
- **Tanggal:** 2026-10-15

## Konteks
Target: VPS atau Docker lokal untuk pengembangan dan pengujian, dengan keterbatasan infrastruktur. Kebutuhan: satu perintah untuk menjalankan seluruh sistem (NFR-009).

## Alternatif
| Alternatif | Alasan tidak dipilih |
|---|---|
| Kubernetes/k3s | Berlebihan untuk 1 developer dan skala kelas |
| PaaS per layanan | Biaya dan ketergantungan platform, dan RabbitMQ/PG tambahan |
| Proses Node langsung (PM2) | Tidak konsisten antar environment dan lebih sulit direproduksi |

## Keputusan
Docker Compose dengan file dasar + override produksi. Reverse proxy (Caddy/Nginx, `TBD`) sebagai satu-satunya port publik. Migrasi dijalankan manual terpisah. Backup `pg_dump` terjadwal. CI/CD minimal (lint, test, audit, build), deploy manual awalnya.

## Konsekuensi
- (+) Reprodusibel, murah, dan mudah didemonstrasikan.
- (−) Tidak ada orkestrasi/auto-healing selain `restart: unless-stopped`, dan satu host adalah titik tunggal kegagalan.
- Risiko: resource VPS kurang untuk 9 container. Mitigasi: batas memori per container dan ukur saat uji beban.

## Referensi
[10](../10-deployment-guide.md), [diagrams/deployment-diagram.md](../diagrams/deployment-diagram.md).
