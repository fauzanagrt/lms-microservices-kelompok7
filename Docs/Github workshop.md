# GitHub Workflow Kolaborasi Tim

## 1. Tujuan

Dokumen ini menjadi panduan kolaborasi tim dalam pengembangan proyek **LMS Microservices untuk Personalisasi Pembelajaran Adaptif**. Workflow ini bertujuan agar setiap anggota dapat mengembangkan fitur secara terpisah, menghindari konflik kode, dan mengintegrasikan perubahan melalui GitHub.

## 2. Aturan Branch

| Branch      | Fungsi                  |
| ----------- | ----------------------- |
| `main`      | Kode utama yang stabil  |
| `feature/*` | Pengembangan fitur baru |
| `fix/*`     | Perbaikan bug           |
| `docs/*`    | Perubahan dokumentasi   |

Setiap anggota wajib bekerja pada branch masing-masing dan tidak melakukan perubahan langsung ke `main`.

Contoh nama branch:

```text
feature/auth-service
feature/course-service
feature/assessment-service
feature/adaptive-engine
fix/login-error
docs/github-workflow
```

## 3. Langkah Kolaborasi Git

### 3.1 Clone Repository

```bash
git clone URL_REPOSITORY
cd NAMA_FOLDER
```

**Penjelasan:**

* `git clone`: mengunduh salinan repository dari GitHub ke komputer.
* `URL_REPOSITORY`: alamat repository GitHub kelompok.
* `cd NAMA_FOLDER`: masuk ke folder proyek yang telah diunduh.

Perintah ini cukup dijalankan satu kali ketika pertama kali mengambil proyek.

### 3.2 Memperbarui Kode Terbaru

```bash
git switch main
git pull origin main
```

**Penjelasan:**

* `git switch main`: berpindah ke branch `main`.
* `git pull origin main`: mengambil dan menggabungkan perubahan terbaru dari branch `main` di GitHub ke branch lokal.

Lakukan sebelum membuat branch fitur baru agar pekerjaan dimulai dari kode terbaru.

### 3.3 Membuat Branch Fitur

```bash
git switch -c feature/nama-fitur
```

**Penjelasan:**

* `git switch`: berpindah branch.
* `-c`: membuat branch baru sekaligus berpindah ke branch tersebut.
* `feature/nama-fitur`: nama branch sesuai tugas yang dikerjakan.

Contoh:

```bash
git switch -c feature/auth-service
```

Perintah ini membuat branch khusus untuk pengembangan layanan autentikasi.

### 3.4 Memeriksa dan Menyimpan Perubahan

```bash
git status
git diff
git add .
git commit -m "feat: add authentication service"
```

**Penjelasan:**

* `git status`: melihat file yang berubah, belum dilacak, atau sudah disiapkan untuk commit.
* `git diff`: melihat rincian perubahan kode yang belum masuk staging.
* `git add .`: menyiapkan perubahan file di direktori saat ini untuk commit.
* `git commit -m "pesan"`: menyimpan perubahan yang sudah disiapkan ke riwayat Git lokal.

Pastikan tidak ada file rahasia seperti `.env`, password, atau token sebelum menggunakan `git add .`.

### 3.5 Mengirim Perubahan ke GitHub

```bash
git push -u origin feature/nama-fitur
```

**Penjelasan:**

* `git push`: mengirim commit lokal ke repository remote.
* `-u`: menghubungkan branch lokal dengan branch remote agar push berikutnya lebih mudah.
* `origin`: nama remote repository GitHub.
* `feature/nama-fitur`: branch yang dikirim.

Setelah berhasil, buka GitHub untuk membuat Pull Request (PR).

### 3.6 Pull Request dan Merge

Pull Request dilakukan melalui halaman repository GitHub.

1. Pilih **Compare & pull request**.
2. Pilih branch tujuan, biasanya `main`.
3. Jelaskan perubahan yang dibuat.
4. Minta anggota lain memeriksa kode.
5. Perbaiki jika ada masukan.
6. Lakukan merge setelah disetujui dan pengujian berhasil.

**Pull Request** adalah pengajuan perubahan untuk diperiksa, sedangkan **merge** adalah proses menggabungkan perubahan ke branch tujuan.

### 3.7 Memperbarui Kode Setelah Merge

```bash
git switch main
git pull origin main
```

**Penjelasan:** berpindah ke branch utama dan mengambil perubahan terbaru yang sudah digabungkan oleh tim. Setelah itu, anggota dapat membuat branch fitur berikutnya.

## 4. Standar Commit Message

Gunakan format pesan commit berikut:

| Prefix      | Fungsi                        | Contoh                          |
| ----------- | ----------------------------- | ------------------------------- |
| `feat:`     | Fitur baru                    | `feat: add course API`          |
| `fix:`      | Perbaikan bug                 | `fix: resolve login error`      |
| `docs:`     | Dokumentasi                   | `docs: update README`           |
| `refactor:` | Perapian kode                 | `refactor: simplify auth logic` |
| `test:`     | Pengujian                     | `test: add assessment tests`    |
| `chore:`    | Konfigurasi atau pemeliharaan | `chore: update dependencies`    |

Gunakan pesan yang singkat, jelas, dan sesuai dengan perubahan.

## 5. Mengatasi Konflik Git

Jika ingin mengambil perubahan terbaru dari `main` ke branch fitur yang sedang dikerjakan:

```bash
git fetch origin
git merge origin/main
```

**Penjelasan:**

* `git fetch origin`: mengambil informasi dan commit terbaru dari remote tanpa langsung menggabungkannya ke branch aktif.
* `git merge origin/main`: menggabungkan perubahan dari `main` remote ke branch yang sedang aktif.

Jika terjadi konflik, buka file yang ditandai Git, selesaikan bagian yang bertentangan, lalu jalankan:

```bash
git add .
git commit -m "fix: resolve merge conflict"
git push
```

Perintah tersebut menyiapkan file hasil penyelesaian konflik, menyimpan penyelesaian sebagai commit, dan mengirimnya ke GitHub. Jangan menghapus perubahan anggota lain tanpa koordinasi.

## 6. Aturan Wajib Tim

1. Jangan melakukan push langsung ke `main`.
2. Gunakan branch terpisah untuk setiap fitur atau perbaikan.
3. Periksa kode sebelum commit dan push.
4. Gunakan Pull Request untuk mengajukan perubahan.
5. Lakukan code review sebelum merge.
6. Jangan mengunggah file `.env` atau kredensial.
7. Koordinasikan perubahan API dan database dengan anggota terkait.

## 7. Alur Singkat

```text
Clone Repository
       ↓
Update Branch Main
       ↓
Buat Branch Fitur
       ↓
Coding dan Testing
       ↓
Add → Commit → Push
       ↓
Pull Request
       ↓
Code Review
       ↓
Merge ke Main
       ↓
Update Kode Terbaru
```

## 8. Penutup

Seluruh anggota tim wajib mengikuti workflow ini agar pengembangan LMS Microservices berjalan terstruktur, perubahan kode mudah ditelusuri, dan integrasi antarfitur dapat dilakukan dengan lebih aman.
