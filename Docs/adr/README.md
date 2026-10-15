# Architecture Decision Records (ADR)

**Fungsi:** mencatat **mengapa** keputusan arsitektur diambil. Penjelasan hasil keputusan ada di [03](../03-system-architecture.md).

## Daftar

| ADR | Judul | Status | Dasar |
|---|---|---|---|
| [ADR-001](ADR-001-technology-stack.md) | Technology stack dan struktur monorepo | Accepted (stack) / Proposed (monorepo) | Brief, Q9, Q10 |
| [ADR-002](ADR-002-system-architecture.md) | Microservices, gateway, dan komunikasi | Accepted (inti) / Proposed (detail) | Brief, Q3 |
| [ADR-003](ADR-003-database-selection.md) | PostgreSQL, satu instance, database per layanan | Accepted | Brief, Q4 |
| [ADR-004](ADR-004-authentication-strategy.md) | Strategi autentikasi JWT | Accepted (inti) / Proposed (detail) | Q7 |
| [ADR-005](ADR-005-deployment-strategy.md) | Docker Compose di VPS | Accepted (inti) / Proposed (detail) | Brief |
| [ADR-006](ADR-006-event-messaging-strategy.md) | Strategi event: outbox, idempotensi, retry, DLQ | **Proposed** | Usulan baru |
| [ADR-007](ADR-007-orm-and-migration-tool.md) | ORM dan alat migrasi | **TBD** | Q10 |

"Accepted" di sini berarti didasarkan pada informasi yang telah dikonfirmasi pengguna (brief dan jawaban klarifikasi "pakai default"). Bagian bertanda Proposed adalah detail usulan. **Seluruh paket dokumen tetap menunggu persetujuan akhir pengguna sebelum coding.**

## Aturan

1. Satu ADR membahas satu keputusan arsitektur utama.
2. ADR lama tidak diubah untuk menghapus riwayat. Jika keputusan berubah, buat ADR baru yang merujuk ADR sebelumnya dan ubah status lama menjadi `Superseded by ADR-xxx`.
3. Bedakan Proposed dan Accepted. Keputusan ditolak yang alasannya penting dicatat (Rejected).
4. Jangan membuat ADR untuk keputusan kecil tanpa dampak arsitektural.
5. Nama file: `ADR-NNN-judul-singkat.md`, nomor berurutan, tidak dipakai ulang.
6. Format: ID dan judul, status, tanggal, konteks, persyaratan dan batasan, alternatif, keputusan dan alasan, konsekuensi (keuntungan, kekurangan, risiko), dampak, referensi.

## Template

Salin struktur dari [ADR-003](ADR-003-database-selection.md).
