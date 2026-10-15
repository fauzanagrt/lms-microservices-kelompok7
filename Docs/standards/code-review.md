# Code Review

Dengan 1 developer, review dilakukan **mandiri** memakai checklist ini sebelum merge (jeda singkat atau baca ulang diff di PR). Bila ada reviewer (mis. dosen pembimbing/teman), checklist yang sama dipakai.

## Checklist

**Kesesuaian**
- [ ] Sesuai FR/NFR yang dirujuk dan acceptance criteria di [02](../02-requirements.md).
- [ ] Sesuai arsitektur [03](../03-system-architecture.md), kontrak [05](../05-api-design.md), dan skema [04](../04-database-design.md). Jika berbeda, dokumen diperbarui (atau ADR baru) pada PR yang sama.
- [ ] Tidak ada fitur di luar lingkup (scope creep).

**Kualitas**
- [ ] Mudah dibaca, penamaan jelas, dan fungsi kecil.
- [ ] Tidak ada duplikasi, kode mati, atau `console.log`/TODO tanpa issue.
- [ ] Lapisan dihormati (controller tipis, logika di service).

**Keamanan** ([08](../08-security-guidelines.md))
- [ ] Otorisasi peran dan kepemilikan di setiap endpoint, tanpa IDOR.
- [ ] Input divalidasi, query berparameter, dan DTO eksplisit.
- [ ] Tidak ada secret, dan data sensitif tidak masuk log/respons.

**Performa dan Ketahanan**
- [ ] Tidak ada query N+1 jelas, pagination dipakai, dan index sesuai.
- [ ] Error ditangani dengan format baku, panggilan eksternal punya timeout.
- [ ] Event: idempoten dan payload tervalidasi.

**Pengujian dan Dokumentasi**
- [ ] Tes baru/diperbarui (normal, edge, error, hak akses) dan lulus.
- [ ] Dokumentasi dan diagram terdampak diperbarui.

## Aturan Komentar dan Persetujuan
Komentar spesifik, beralasan, dan menyarankan tindakan. Tandai `blocker` (wajib diperbaiki) atau `saran`. Merge setelah semua blocker selesai dan CI hijau.

## Wajib Diperbaiki Sebelum Merge
Celah otorisasi/keamanan, bug yang melanggar acceptance criteria, tes gagal atau tidak ada untuk perilaku baru, perubahan kontrak tanpa pembaruan dokumen, dan secret di diff.
