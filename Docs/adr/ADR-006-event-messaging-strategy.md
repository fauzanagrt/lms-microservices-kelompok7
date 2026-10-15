# ADR-006 — Strategi Event Messaging

- **Status:** Proposed
- **Tanggal:** 2026-10-15

## Konteks
Penilaian selesai harus memicu keputusan adaptif tanpa menggagalkan submit saat RabbitMQ/adaptive bermasalah (NFR-002), dan pesan tidak boleh hilang atau memberi efek ganda (NFR-007).

## Alternatif
| Alternatif | Catatan |
|---|---|
| Publish langsung setelah commit DB | Event bisa hilang bila proses mati di antara keduanya |
| Publish sebelum commit | Event terkirim padahal transaksi gagal |
| Two-phase commit | Tidak praktis dengan RabbitMQ |
| Polling REST dari adaptive | Coupling dan beban |

## Keputusan
1. **Transactional outbox** di assessment_db dan adaptive_db, serta relay periodik (polling berinterval pendek) yang memublikasikan lalu menandai `PUBLISHED`.
2. Exchange `lms.events` (topic, durable, persistent messages), queue durable, dan manual ack.
3. Consumer **idempoten** (`processed_events` dalam transaksi yang sama dengan efeknya).
4. Retry 3× dengan backoff (queue retry TTL), lalu DLQ.
5. Event ber-versi dan payload divalidasi Zod di consumer.

## Konsekuensi
- (+) Tidak ada event hilang, dan submit tidak bergantung pada RabbitMQ.
- (−) Tabel dan komponen tambahan (relay), latensi tambahan ±interval polling (target ≤ 10 detik, NFR-012).
- (−) Urutan pesan tidak dijamin global. Hal ini diterima karena BR-006 memakai attempt terbaru berdasarkan `gradedAt`, dan consumer membandingkan waktu sebelum menimpa.
- Pemeliharaan: pembersihan outbox/processed_events berkala.

## Referensi
[03 §7](../03-system-architecture.md), dokumentasi resmi RabbitMQ (dead lettering, publisher confirms).
