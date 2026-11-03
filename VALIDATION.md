# Hasil validasi

Tanggal: 3 November 2026 (Asia/Jakarta).

- Instalasi selesai; lockfile tersedia.
- TypeScript: lulus.
- ESLint: lulus tanpa warning aplikasi.
- `npm run build`: lulus Next.js 16.4.4; semua route statis.
- `out/index.html`, `out/assets/goddess.png`, dan `out/audio/demons-shot.mp3` terverifikasi.
- Browser: Microsoft Edge headless / Playwright terhadap server static export.
- Viewport 1440×900, 1024×768, 390×844, 360×800: tidak ada overflow horizontal/error JavaScript. Screenshot desktop dan mobile diperiksa; dock mobile diperbaiki agar tidak menutupi scroll cue.
- Navigasi, Escape/focus restore, lima hotspot, empat arsip, terminal/history/semua command, restart/skip boot, FX/performance persisten dan reduced motion diuji.
- Timeline pinned diuji maju/mundur; preferensi rendah melepaskan pin.
- Audio: playback benar-benar berjalan, currentTime bertambah, seek dengan pointer bekerja, volume/mute, pause, dan kesinambungan saat dialog terverifikasi. Metadata awal yang terlewat saat hidrasi diperbaiki. Audio gagal memuat menampilkan status unavailable.
- Model GLB tidak tersedia: jalur future viewer disiapkan, bukan klaim telah menguji model yang belum ada.
- Audit npm produksi: **0 kerentanan**. Audit seluruh tree: **16 moderat** pada tooling lint (rantai minimatch <11.0.1, GHSA-g3hv-75wg-m249). Tidak ikut runtime static export. Tidak melakukan force upgrade lint ke kombinasi inkompatibel; perlu pembaruan upstream tooling. npm menandai ESLint 9 sebagai deprecated; dipertahankan mengikuti dependensi kompatibel eslint-config-next.
- Warning NO_COLOR/FORCE_COLOR berasal dari lingkungan test runner, bukan aplikasi.

## Domain

SERVFAIL awal terdiagnosis sebagai authoritative nameserver menolak query. Setelah pengguna menyimpan DNS DomaiNesia, resolver Google mengembalikan NS `nsx1.domainesia.com` / `nsx2.domainesia.com`, empat A GitHub Pages dan CNAME www yang benar. Query DS memberi jawaban kosong tervalidasi pada parent (tidak ada DS); tidak ada perubahan DNSSEC oleh agen.

Status deployment dan HTTPS diperbarui setelah workflow remote selesai.
