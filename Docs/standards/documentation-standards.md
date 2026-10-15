# Documentation Standards

## 1. Nama File dan Heading
- Dokumen utama: `NN-nama-dokumen.md` (nomor berurutan). ADR: `ADR-NNN-judul.md`. Diagram: `kebab-case.md`.
- Satu `#` H1 per file (judul), lalu `##`/`###` berurutan tanpa melompati level.
- Bahasa Indonesia profesional. Istilah teknis Inggris dipertahankan bila lebih tepat.

## 2. Format Markdown
Tabel untuk perbandingan/daftar terstruktur, checklist `- [ ]` untuk daftar tugas, blok kode dengan penanda bahasa, dan tautan relatif antar dokumen. Baris tidak perlu dibungkus manual.

## 3. Diagram
Mermaid sebagai sumber teks di `docs/diagrams/`, dengan judul, tujuan, dan status (DRAFT/Terverifikasi). Dokumen lain **merujuk** diagram, tidak menyalin ulang (hindari duplikasi, kecuali ringkasan kecil di [03](../03-system-architecture.md)).

## 4. ID dan Keterlacakan
ID unik dan stabil, tidak dipakai ulang: FR-, NFR-, BR-, UC-, SEC-, SC-, AS-, DEP-, CMP-, API (A-/C-/S-/P-), TC-, ADR-. ID yang dihapus ditandai *deprecated*, tidak dihapus nomornya.

## 5. Fakta, Asumsi, Rekomendasi, Keputusan
| Label | Arti |
|---|---|
| `APPROVED` | Disepakati, sebutkan dasarnya |
| `PROPOSED` | Usulan |
| `TBD` | Belum diputuskan, wajib ada pemilik dan tenggat saat ditinjau |
Asumsi dicatat di [01 §7](../01-project-overview.md) dan keputusan arsitektur di ADR. Jangan menulis hal yang belum diverifikasi sebagai fakta, dan jangan mengklaim tes/implementasi berhasil tanpa bukti.

## 6. Menjaga Dokumen Sinkron
- Perubahan kode yang memengaruhi kontrak, skema, event, atau perilaku **wajib** disertai perubahan dokumen pada PR yang sama.
- Perubahan arsitektur: buat ADR baru (jangan menghapus yang lama), lalu perbarui [03](../03-system-architecture.md) dan diagram.
- Setelah tiap tahap roadmap selesai: tinjau konsistensi 02 ↔ 04 ↔ 05 ↔ 09, ubah status dokumen/diagram dari DRAFT menjadi terverifikasi hanya bila sesuai implementasi.
- Dilarang memuat secret, kredensial, atau data pribadi nyata dalam dokumentasi.

## 7. Riwayat Perubahan
Riwayat mengandalkan Git. Perubahan kebutuhan yang signifikan dicatat di bagian "Catatan Perubahan" pada dokumen terkait dengan tanggal dan alasan.
