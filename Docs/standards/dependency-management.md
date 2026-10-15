# Dependency Management

## 1. Kriteria Memilih Library
Pilih hanya bila: (1) kebutuhan nyata dan tidak mudah ditulis sendiri, (2) dipelihara aktif (rilis dan isu direspons), (3) dukungan TypeScript baik, (4) ukuran dan jumlah dependensi turunan wajar, (5) lisensi kompatibel (MIT/Apache-2.0/BSD/ISC diutamakan), dan (6) tidak ada kerentanan terbuka yang serius. Utamakan pustaka yang sudah ada dibanding menambah yang baru.

## 2. Kompatibilitas Versi
Verifikasi kompatibilitas ke dokumentasi resmi (Node.js LTS, Next.js, Express, driver PostgreSQL, klien RabbitMQ) saat Tahap 1 dan sebelum upgrade major. Versi Node dipin di `.nvmrc` dan `engines`. Satu versi untuk tiap pustaka bersama di seluruh workspace.

## 3. Lockfile
`package-lock.json` **wajib di-commit**. Pasang dengan `npm ci` di CI/Docker. Jangan edit lockfile manual.

## 4. Kebijakan Pembaruan
- Patch/minor: ditinjau berkala (mis. dua mingguan atau bulanan) dan diuji sebelum merge.
- Major: satu per PR, baca catatan rilis, dan tes penuh.
- Pembaruan keamanan: prioritas tinggi, segera setelah `npm audit` melaporkan High/Critical yang relevan.
- Jangan menambahkan versi yang baru dirilis beberapa hari tanpa alasan, dan pin versi yang sudah teruji.

## 5. Lisensi dan Keamanan
Jalankan `npm audit` di CI. Periksa lisensi dependensi baru (catat dalam PR). Hindari paket tanpa pemelihara, dengan nama mirip paket populer (typosquatting), atau dengan skrip `postinstall` mencurigakan.

## 6. Prosedur Menambah Dependensi
1. Tulis alasan dan alternatif yang dipertimbangkan di deskripsi PR.
2. Periksa kriteria §1 dan §5.
3. Pasang di workspace yang membutuhkan saja (bukan root), dan pisahkan `dependencies` dan `devDependencies`.
4. Commit `package.json` dan lockfile bersama, lalu jalankan lint, tes, dan audit.
5. Dependensi bernilai arsitektural (ORM, broker client, framework) memerlukan ADR.

## 7. Prosedur Menghapus Dependensi
Cari penggunaan, hapus impor, jalankan tes dan build, lalu commit `package.json` + lockfile.
