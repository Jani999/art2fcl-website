# ART2FCL // SYSTEM BREACH

Pengalaman seni digital sinematik tentang JUSTICE.exe, dibangun di `D:\ART2FCL`. Next.js App Router, TypeScript, Tailwind CSS, GSAP/ScrollTrigger, Lenis, Motion, serta Three.js / React Three Fiber / Drei untuk model masa depan.

**Live:** https://art2fcl.my.id — **Source:** https://github.com/Jani999/art2fcl-website

## Cinematic V2 — review branch

`feature/cinematic-v2` berisi enam koreografi scroll baru, tekstur transparan yang dibersihkan, shader GLSL orisinal, archive perspektif, dan terminal dengan autocomplete serta corrupt/restore/scan. Produksi tetap V1 sampai PR ditinjau dan digabungkan. Workflow validasi V2 hanya menghasilkan artifact preview, tanpa deployment.

Lihat [QA V2](docs/V2-VALIDATION.md), [riset dan lisensi](docs/V2-RESEARCH.md), serta [perbandingan alpha](docs/v2-assets/alpha-comparison.jpg). Aset utama V2 adalah `public/assets/goddess-clean.webp`, diproses non-destruktif dari `Cybernetic Marble Lady Justice.png`. Tidak ada GLB asli yang ditemukan; rendering memakai bidang gambar 2.5D dan shader transparan, bukan rotasi 360° palsu.

Deployment pertama [berhasil](https://github.com/Jani999/art2fcl-website/actions/runs/41591972599). Custom domain, redirect www, sertifikat HTTPS dan Enforce HTTPS terverifikasi aktif pada 3 November 2026.

## Menjalankan

```sh
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

Build menghasilkan `out/`; tidak membutuhkan server Node saat produksi. Font dibundel lokal. Gunakan `npm ci` untuk instalasi reproducible. Domain root dikonfigurasi tanpa basePath.

`npm test` menjalankan browser Edge lokal atau Chromium pada CI terhadap static export (jalankan build lebih dahulu). `npm run preview` menyajikan `out/` di localhost:3000. Suite V2 harus dijalankan terhadap build V2, bukan produksi V1. Screenshot QA disimpan di `.local/v2/` dan disertakan dalam artifact CI untuk review.

## Pengalaman

- Boot sekali per browser, tombol skip, dan restart.
- Enam bab: Awakening, Divinity, Breach, Archive, Terminal, Final Transmission.
- Komposisi PNG 2.5D, timeline scroll reversible, progress aktual, navigasi dialog.
- Lima hotspot anatomi dan empat dossier arsip dengan fokus keyboard/Escape.
- Terminal simulasi lokal dengan history, help, about, entity, archive, status, music, contact, clear, exit, breach. Tidak mengeksekusi shell/server.
- Pemutar MP3 persisten: gesture untuk play, pause, seek, mute, volume, durasi, visualizer frekuensi Web Audio, serta status kegagalan.
- FX/performance tersimpan, reduced motion, layout mobile, jam lokal, halaman 404.

## Aset dan model

`public/assets/goddess.png` adalah gambar 2D asli. Tidak diklaim sebagai model 3D. `public/audio/demons-shot.mp3` adalah audio yang disediakan pengguna. Distribusi publik lagu komersial mungkin memerlukan izin pemegang hak; pengguna perlu memastikan izin publikasi.

Untuk mode 3D masa depan, tambahkan model valid `public/models/goddess.glb`, lalu buka OPTIONAL 3D VIEWER pada bagian anatomi. Komponen menerima `url` dan `progress` (0–1) untuk rotasi Y nyata. Viewer dimuat lazy; model tidak disertakan saat ini.

## Deployment GitHub Pages

Workflow `.github/workflows/deploy.yml` menginstal dengan npm ci, memeriksa types/lint, membangun static export, mengunggah `out/`, lalu menjalankan deploy-pages. Source Pages harus `GitHub Actions`.

Custom domain diatur melalui Settings → Pages / REST API, bukan mengandalkan CNAME dalam artifact Actions. Target `https://art2fcl.my.id`.

Jika DNS belum dikonfigurasi, tambahkan ke zone `art2fcl.my.id`:

| Jenis | Host | Nilai |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME opsional | www | Jani999.github.io |

Periksa konflik A/AAAA/ALIAS sebelum mengubahnya; jangan mengubah MX/TXT email. Jangan membuat wildcard. Aktifkan Enforce HTTPS setelah sertifikat tersedia. Verifikasi domain pada GitHub account Settings → Pages menggunakan TXT yang diberikan GitHub (nilai unik tidak dapat ditebak).

Lihat `THIRD_PARTY.md` untuk audit library dan `VALIDATION.md` untuk hasil pemeriksaan aktual.
