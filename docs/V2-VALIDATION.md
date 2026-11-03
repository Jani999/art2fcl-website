# Cinematic V2 — hasil validasi

Tanggal: 3 November 2026. Target: `feature/cinematic-v2`, Next.js static export. Produksi `main` tetap commit `c529d1d56f0bffad782edaec1ddf47fb36cd9ff3` selama implementasi.

## Pemeriksaan lokal

- TypeScript, ESLint tanpa warning, dan production build: lulus.
- Playwright / Microsoft Edge: **8/8 lulus**. Suite mencakup 30 screenshot (enam bab × lima viewport), sembilan dossier, focus/Escape, seluruh perintah terminal, autocomplete/history, audio MP3 nyata, seek/volume/mute, dan playback lintas scene.
- Viewport: 1920×1080, 1440×900, 1366×768, 390×844, 375×812. Tidak ada horizontal overflow atau console/page error dalam traversal visual.
- Enam pin desktop menjadi tiga pin mobile; resize kembali menghasilkan enam, tanpa pin ganda. Transform anatomi berbeda saat maju dan kembali saat dibalik. Restart/skip kembali ke awal.
- Instrumentasi `WebGL2RenderingContext.drawElements`: shader menggambar saat aktif, berhenti setelah progress/velocity stabil, dan tidak menggambar di luar layar. Simulasi `WEBGL_lose_context` memulihkan gambar fallback.
- Reduced motion: tanpa pin/canvas, gambar utuh terlihat; quality preference bertahan setelah reload. Simulasi audio unavailable tetap menghasilkan UI yang dapat dipakai.
- Perbaikan dari inspeksi: progress menghitung seluruh panjang halaman setelah pin; RGB split diperkecil; timbangan adegan akhir diposisikan kembali di dalam layar mobile; anotasi akhir dipisahkan dari bagian bawah gambar.

Hasil browser merupakan pengujian desktop Edge dengan viewport mobile, bukan benchmark perangkat iOS/Android fisik. Tidak mengklaim FPS minimum pada semua GPU. Screenshot beberapa progress menunjukkan fragmentasi/typography clipping yang disengaja, bukan keadaan final gambar.

## Aset

Sumber aktual workspace bernama `Cybernetic Marble Lady Justice.png` (tanpa suffix `(1)`). Identitas sesuai patung yang disediakan. Sumber dipertahankan, SHA256 `b6fe70a846ae1a8d18c72587b07a1cb50686f68bf9c938085fbcd3703c64b848`.

Jalankan `python scripts/clean-goddess.py` dengan Pillow dan NumPy untuk mereproduksi WebP lossless 1152×1664 (padding 64px). Script hanya memperbaiki kontaminasi RGB batas dan normalisasi alpha; tidak mengikis siluet, mengaburkan seluruh gambar, atau membuat detail anatomi baru. [Perbandingan hitam/abu-abu](v2-assets/alpha-comparison.jpg) dan [laporan alpha](v2-assets/alpha-report.json).

Tidak ada GLB/GLTF yang ditemukan. Hasil berupa **layered 2.5D + GLSL image plane**, bukan mesh patung 3D. Interface viewer opsional tetap mendukung `public/models/goddess.glb` bila model asli tersedia nanti.

## Preview dan produksi

`npm ci`, `npm run build`, kemudian `npm run preview` untuk membuka static export di http://127.0.0.1:3000. Workflow `Validate cinematic preview` menguji Chromium pada Ubuntu dan mengunggah artifact `cinematic-v2-review` berisi `out/`, screenshot, dan hasil tes. Artifact dapat diunduh melalui tab Actions. Sajikan folder `out` sebagai root HTTP untuk meninjau.

Workflow deploy V1 tidak diubah. Branch V2 tidak memiliki deployment otomatis ke Pages. Custom domain tetap `art2fcl.my.id`, HTTPS enforced aktif pada pemeriksaan read-only; DNS/DNSSEC tidak diubah. Penggabungan PR dan deployment V2 menunggu review pengguna.

## Dependensi

Tidak ada library animasi baru. Stack existing: GSAP/ScrollTrigger (Standard No-Charge), Lenis/Three/Fiber/Drei/Motion (MIT), Lucide (ISC). Tambahan font lokal Noto Sans JP (SIL OFL). Tujuh proyek referensi dievaluasi, tidak ada kode atau aset demo disalin; lihat [audit V2](V2-RESEARCH.md).

Audit dependency V1 mencatat 0 kerentanan runtime dan 16 moderate pada rantai tooling lint; V2 tidak mengubah rantai lint tersebut. Jangan menggunakan audit dev sebagai klaim bahwa dependency runtime rentan.
