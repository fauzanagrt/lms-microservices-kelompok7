# Coding Conventions

Struktur folder dan tanggung jawab lapisan: [06](../06-coding-guidelines.md).

## 1. Penamaan
| Objek | Konvensi | Contoh |
|---|---|---|
| File/folder backend | `kebab-case`, sufiks peran | `rule-selector.service.ts` |
| File komponen React | `PascalCase.tsx` | `AttemptTimer.tsx` |
| Variabel, fungsi | `camelCase`, kata kerja untuk fungsi | `selectRule()` |
| Class, tipe, interface | `PascalCase` (tanpa awalan `I`) | `AppError`, `LearningPath` |
| Konstanta, enum member | `UPPER_SNAKE_CASE` | `DEFAULT_REMEDIAL_MAX` |
| Boolean | awalan `is/has/can` | `isEnrolled` |
| Tabel/kolom DB | `snake_case`, tabel jamak | `learning_path_results` |
| JSON API | `camelCase` | `competencyScores` |
| Event type | `domain.action` huruf kecil | `assessment.graded` |
| Env var | `UPPER_SNAKE_CASE` | `RABBITMQ_URL` |

Pemetaan `snake_case` (DB) ↔ `camelCase` (API) dilakukan di lapisan repository.

## 2. Tooling (`PROPOSED`, versi dipin di Tahap 1)
- **TypeScript strict** (`strict: true`, `noUncheckedIndexedAccess`). Dilarang `any` tanpa komentar alasan, dan gunakan `unknown` + validasi.
- **ESLint** (+ plugin TypeScript) dan **Prettier**. Format otomatis saat simpan dan di pre-commit.
- Perintah wajib lulus sebelum merge: `lint`, `typecheck`, `test`.

## 3. Struktur Modul
Satu folder per domain (`modules/<domain>`) dengan berkas routes/controller/service/repository/schema. Modul tidak mengimpor `repository` modul lain, melainkan memanggil `service`-nya. Tidak ada impor melingkar.

## 4. Error Handling dan Validasi
Gunakan `AppError`. Validasi Zod di batas sistem. Detail: [06 §4–5](../06-coding-guidelines.md).

## 5. Pemisahan Logika
Logika bisnis di `service`/fungsi murni, bukan di controller atau komponen UI. Logika murni: tanpa akses DB, waktu sistem, atau jaringan (injeksikan `now()` bila perlu).

## 6. Maintainability
Fungsi ≤ ±40 baris sebagai panduan, kompleksitas rendah, tidak ada duplikasi lebih dari 2 tempat, dan tidak ada *magic number* atau string. Aturan bisnis ditulis sekali dan diberi komentar `// BR-004` agar terlacak.

## 7. Logging
Gunakan logger bersama dengan level yang tepat. Jangan `console.log` di kode produksi. Jangan mencatat secret, token, password, atau isi esai.

## 8. Async
Selalu `await` atau tangani promise (aturan lint `no-floating-promises`). Operasi multi-langkah yang harus atomik memakai transaksi DB.
