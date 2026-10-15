# UI/UX Guidelines

## 1. Prinsip
Jelas dan sederhana, konsisten antar peran, dan umpan balik cepat. Mahasiswa harus selalu tahu: sedang di mana, apa yang harus dikerjakan, dan mengapa mendapat jalur tertentu (tampilkan alasan: skor CPMK dan rentang rule).

## 2. Responsif
Mobile-first. Titik lebar acuan: 360, 768, 1280 px. Tabel lebar menggulir horizontal dalam wadahnya. Target sentuh ≥ 44 px. Halaman pengerjaan evaluasi harus nyaman di ponsel.

## 3. Design Tokens (`PROPOSED`, dikonfigurasi di Tailwind theme)
| Token | Aturan |
|---|---|
| Warna | 1 warna primer, netral (abu), dan semantik: success, warning, danger, info. Warna jalur: MAIN (netral/biru), ENRICHMENT (hijau), REMEDIAL (oranye). **Jalur tidak boleh dibedakan hanya oleh warna** (tambahkan label/ikon). |
| Tipografi | 1 keluarga sans-serif, skala: 12/14/16/20/24/32 px, dan tubuh teks ≥ 16 px di mobile |
| Spacing | Skala kelipatan 4 px |
| Radius/Shadow | 2 ukuran radius, dan shadow hanya untuk elevasi (modal/dropdown) |
Nilai konkret ditetapkan di Tahap 7 dan dicatat di berkas konfigurasi tema (sumber tunggal).

## 4. Navigasi dan Interaksi
- Navigasi per peran (sidebar atau tab bawah di mobile): Mahasiswa (Mata kuliah, Evaluasi, Jalur saya), Dosen (Mata kuliah, Materi, Evaluasi, Penilaian, Rule), Admin (Pengguna, Enrollment).
- Aksi destruktif memerlukan konfirmasi. Form: validasi inline, tombol dinonaktifkan saat submit, dan pesan error spesifik.
- Pengerjaan evaluasi: timer terlihat, indikator autosave, peringatan sebelum meninggalkan halaman, dan konfirmasi sebelum submit.

## 5. Aksesibilitas
Target WCAG 2.1 AA untuk hal dasar: kontras teks ≥ 4.5:1, semua fungsi dapat dioperasikan dengan keyboard, fokus terlihat, label pada input, `alt` pada gambar, dan elemen semantik HTML. Status tidak hanya lewat warna.

## 6. State Wajib per Halaman Data
| State | Perilaku |
|---|---|
| Loading | Skeleton/spinner, tanpa layout bergeser |
| Empty | Pesan dan aksi lanjut (mis. "Belum ada materi, tambah materi") |
| Error | Pesan ramah dari `error.code`, tombol coba lagi, dan `correlationId` kecil untuk pelaporan |
| Success | Toast singkat |
| Pending adaptif | "Jalur belajar sedang diproses" saat `pathStatus=PENDING` |

## 7. Aset dan Komponen
Komponen dasar (Button, Input, Select, Modal, Table, Badge, Toast) dibuat sekali di `components/ui` dan dipakai ulang. Ikon dari satu pustaka. Tanpa gambar berat, dan tidak ada aset berhak cipta tanpa lisensi.

## 8. Kriteria Penerimaan Desain
- [ ] Menggunakan token dan komponen bersama.
- [ ] Lolos cek responsif 360/768/1280 px.
- [ ] Keempat state (loading, empty, error, success) ada.
- [ ] Dapat dioperasikan dengan keyboard dan kontras memadai.
- [ ] Teks antarmuka berbahasa Indonesia konsisten.
