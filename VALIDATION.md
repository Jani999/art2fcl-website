# Hasil validasi

Tanggal: 3 November 2026 (Asia/Jakarta).

- Instalasi selesai; lockfile tersedia.
- TypeScript: lulus.
- ESLint: lulus tanpa warning aplikasi.
- `npm run build`: lulus Next.js 16.4.4; semua route statis.
- `out/index.html`, `out/assets/goddess.png`, dan `out/audio/demons-shot.mp3` terverifikasi.
- Browser: Microsoft Edge headless / Playwright terhadap server static export.
- Suite browser **7/7 lulus langsung di https://art2fcl.my.id** (2,7 menit), mencakup layout semua bab desktop/mobile, empat viewport hero, interaksi, audio nyata, fallback audio, timeline reverse dan preferensi. Suite lokal enam skenario utama juga lulus (24 detik), ditambah pemeriksaan visual bab (7,5 detik).
- Viewport 1440×900, 1024×768, 390×844, 360×800: tidak ada overflow horizontal/error JavaScript. Screenshot desktop dan mobile diperiksa; dock mobile diperbaiki agar tidak menutupi scroll cue.
- Navigasi, Escape/focus restore, lima hotspot, empat arsip, terminal/history/semua command, restart/skip boot, FX/performance persisten dan reduced motion diuji.
- Timeline pinned diuji maju/mundur; preferensi rendah melepaskan pin.
- Audio: playback benar-benar berjalan, currentTime bertambah, seek dengan pointer bekerja, volume/mute, pause, dan kesinambungan saat dialog terverifikasi. Metadata awal yang terlewat saat hidrasi diperbaiki. Audio gagal memuat menampilkan status unavailable.
- Model GLB tidak tersedia: jalur future viewer disiapkan, bukan klaim telah menguji model yang belum ada.
- Audit npm produksi: **0 kerentanan**. Audit seluruh tree: **16 moderat** pada tooling lint (rantai minimatch <11.0.1, GHSA-g3hv-75wg-m249). Tidak ikut runtime static export. Tidak melakukan force upgrade lint ke kombinasi inkompatibel; perlu pembaruan upstream tooling. npm menandai ESLint 9 sebagai deprecated; dipertahankan mengikuti dependensi kompatibel eslint-config-next.
- Warning NO_COLOR/FORCE_COLOR berasal dari lingkungan test runner, bukan aplikasi.

## Domain

SERVFAIL awal terdiagnosis sebagai authoritative nameserver menolak query. Setelah pengguna menyimpan DNS DomaiNesia, resolver Google mengembalikan NS `nsx1.domainesia.com` / `nsx2.domainesia.com`, empat A GitHub Pages dan CNAME www yang benar. Query DS memberi jawaban kosong tervalidasi pada parent (tidak ada DS); tidak ada perubahan DNSSEC oleh agen.

## Deployment terverifikasi

- Repository PUBLIC: https://github.com/Jani999/art2fcl-website ; branch `main`, remote `origin` benar.
- Workflow pertama: [41591972599](https://github.com/Jani999/art2fcl-website/actions/runs/41591972599), **success**, termasuk npm ci, typecheck, lint, static build, upload artifact dan deploy.
- Pages menggunakan `build_type: workflow`, `cname: art2fcl.my.id`.
- https://art2fcl.my.id memberi **HTTP 200** dengan judul ART2FCL // SYSTEM BREACH.
- Gambar dan audio pada domain produksi memberi HTTP 200.
- https://jani999.github.io/art2fcl-website/ dan https://www.art2fcl.my.id mengarah ke domain utama dan berakhir pada HTTP 200.
- Sertifikat untuk apex dan www disetujui; `https_enforced: true`. Koneksi HTTPS diverifikasi tanpa menonaktifkan pemeriksaan sertifikat.
- DNS lokal dan Google telah mengembalikan empat IPv4 GitHub yang benar. Tidak ada AAAA konflik. DS dan DNSKEY tidak ditemukan: zona tidak menggunakan DNSSEC saat diperiksa; tidak ada perubahan DNSSEC dilakukan.

Tidak ada tindakan DNS atau autentikasi tersisa untuk deployment ini. Izin distribusi musik komersial tetap menjadi tanggung jawab pemilik proyek. GLB asli belum tersedia, sehingga pengalaman aktif memakai PNG 2.5D.
