# ART2FCL // SYSTEM BREACH

Pengalaman seni digital sinematik tentang JUSTICE.exe, dibangun di `D:\ART2FCL`. Next.js App Router, TypeScript, Tailwind CSS, GSAP/ScrollTrigger, Lenis, Motion, serta Three.js / React Three Fiber / Drei untuk model masa depan.

**Live:** https://art2fcl.my.id — **Source:** https://github.com/Jani999/art2fcl-website

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

`npm test` menjalankan browser Edge yang terpasang terhadap static export (jalankan build lebih dahulu). Untuk menguji situs publik dari PowerShell: `$env:TEST_BASE_URL='https://art2fcl.my.id'; npm test`. Screenshot hasil QA disimpan lokal di `.local/` dan tidak dipublikasikan.

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
