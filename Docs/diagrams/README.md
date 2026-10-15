# Diagrams

**Tujuan:** representasi visual sistem. Semua diagram berformat Mermaid (teks, dapat ditinjau lewat Git). Semua diagram berstatus **DRAFT (rancangan)** dan belum mencerminkan implementasi aktual.

| File | Status | Isi |
|---|---|---|
| system-context.md | Wajib | Pengguna dan sistem |
| container-architecture.md | Wajib | Container dan komunikasi |
| component-diagram.md | Wajib | Komponen internal layanan dan hubungan antarlayanan |
| use-case-diagram.md | Opsional (berguna untuk laporan skripsi) | Aktor dan use case |
| activity-flow.md | Opsional | Alur bisnis dan algoritma adaptif |
| sequence-diagrams.md | Wajib | Interaksi berurutan (termasuk alur data) |
| erd.md | Wajib | ERD per layanan |
| deployment-diagram.md | Wajib | Lingkungan eksekusi |
| *(data-flow.md)* | **Tidak dibuat** | Alur data sudah tercakup di sequence-diagrams dan [03 §8](../03-system-architecture.md), untuk menghindari duplikasi |

## Aturan Pembaruan

Perbarui diagram pada PR yang sama bila: layanan/komponen ditambah atau dihapus, kontrak event atau endpoint berubah, tabel/kolom/relasi berubah, atau topologi deployment berubah. Hapus label DRAFT hanya setelah diverifikasi terhadap implementasi. Dilarang memuat kredensial atau data rahasia.
