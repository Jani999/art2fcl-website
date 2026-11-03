# PROMPT UNTUK CODEX — Portofolio ART2FCL (Azriel)

## 0. Tugas
Kamu menerima project statis berisi:
- `index.html` — implementasi referensi (single file, sumber kebenaran visual dan perilaku)
- `assets/audio/demons-shot.mp3` — lagu latar (Aiobahn +81 feat. DEMONDICE — DEMON'S SHOT)

Tugas: rapikan menjadi project production-ready TANPA mengubah tampilan, copywriting, urutan section, maupun perilaku animasi. Jangan mendesain ulang. Jika ragu, ikuti `index.html`.

## 1. Struktur target
```
/
├─ index.html
├─ assets/
│  ├─ css/style.css        (CSS dipindah dari <style>)
│  ├─ js/main.js           (JS dipindah dari <script> inline terakhir)
│  └─ audio/demons-shot.mp3
├─ README.md               (cara jalankan lokal + deploy ke Railway/Vercel/Netlify)
└─ package.json            (opsional: "serve" untuk preview lokal)
```
- Tetap static site tanpa bundler. Library dimuat lewat CDN dengan versi dipin persis (jangan pakai `latest`).
- Tambahkan favicon, Open Graph (title, description, image placeholder), `lang="id"`, dan `<noscript>` fallback singkat.

## 2. Identitas dan copy (JANGAN diubah)
- Nama brand/website: **ART2FCL** (judul hero raksasa dan logo nav).
- Di bawah judul hero: "Saya **Azriel**. Saya membangun aplikasi web dan mobile dengan Laravel, Flutter, dan Supabase, lalu membungkusnya dengan interaksi dan motion yang berkesan."
- Selain judul hero dan logo, semua penyebutan nama orang memakai **Azriel**.
- Proyek (hanya 3): **D’Mals Signature** (Flutter, Supabase; pemesanan toko roti dengan loyalti dan gacha), **BSI Campus Hub** (Laravel, Blade; platform komunitas kampus), **Sonara** (Kotlin, Compose; app music streaming bebas iklan, dikembangkan dari BitChord).
- Statistik About: 3 proyek, 3 stack utama, 2 bahasa.

## 3. Kontak (section terakhir, `#contact`)
- Tombol besar **CONTACT ME ↗** → `https://wa.me/6289652447077` (`target="_blank" rel="noopener"`).
- Di bawahnya tiga tombol: **GITHUB** → `https://github.com/jani999`, **INSTAGRAM** → dibiarkan kosong (href `#`, tidak navigasi; beri atribut `data-todo` agar mudah diisi nanti), **EMAIL** → `mailto:celesfrieg@gmail.com`.

## 4. Desain (token wajib)
- Tema: cyber brutalism, neon, dark abyss, cyber robot, japanese street, hologram, motion.
- Warna: `--bg #020309`, `--ink #e9f3ff`, `--c #00e5ff`, `--m #ff2bd6`, `--y #f4ff3d`, `--v #7a3cff`, `--paper #f0f0e8`.
- Font (Google Fonts): Zen Dots (display), Chakra Petch (body), Noto Sans JP 900 (kanji).
- Brutalism: border 3-4px, hard shadow offset tanpa blur, panel putih `--paper` untuk kontras, marquee kuning miring, scanline + vignette overlay, kursor lingkaran custom (disembunyikan di perangkat touch).

## 5. Section dan perilaku
1. **Preloader**: counter 000→100 (anime.js), lalu 8 bar horizontal menyapu keluar bergantian.
2. **Hero** (`#home`): judul ART2FCL dengan huruf masuk per karakter + glitch RGB-split, lead, role typing (Typed.js: Web Developer, Mobile Developer, Laravel Builder, Motion UI Enthusiast), badge neon "営業中 // ONLINE" berkedip acak, dua tombol magnetic.
3. **Marquee kuning miring**: kecepatan naik saat scroll cepat (GSAP timeScale mengikuti velocity).
4. **About** (`#about`): panel putih, judul scramble, garis SVG yang menggambar diri, counter statistik, tabel spesifikasi.
5. **Work** (`#work`): 3 kartu proyek, vanilla-tilt + sheen hologram, nomor outline, kanji dekoratif.
6. **Stack** (`#stack`): chip per kategori, muncul stagger (anime.js), magnetic hover.
7. **Contact** (`#contact`): lihat bagian 3.
8. **HUD tetap**: nomor distrik + nama (渋谷/秋�Ah原/新宿/池袋/六本木, scramble saat berpindah section), velocity km/h dari kecepatan scroll, jam lokal, rail progress vertikal, logo hex yang morph (anime.js).
9. **Latar 3D (Three.js r128)**: kota Tokyo malam neon (InstancedMesh gedung gelap + garis tepi neon satu LineSegments, papan neon vertikal, grid lantai, 7 gerbang hexagon, 5 billboard kanji hologram dari canvas texture, FogExp2). Kamera terbang sepanjang jalan sesuai progress scroll (GSAP ScrollTrigger scrub 1.2), FOV melebar saat scroll cepat, parallax kursor.
10. **tsParticles**: hujan data neon persegi tipis di atas kanvas 3D.

## 6. Mini music player (fitur baru, wajib)
- Komponen fixed bawah-tengah, awalnya berupa pill "♪ MUSIC" dengan disc berputar-gradien; klik untuk membuka panel.
- Panel: judul **DEMON’S SHOT**, artis **Aiobahn +81 feat. DEMONDICE**, equalizer 8 bar (canvas), tombol play/pause, slider seek, tombol mute.
- `<audio src="assets/audio/demons-shot.mp3" loop preload="metadata">`, volume awal 0.6.
- **Dilarang autoplay.** Musik hanya mulai setelah klik tombol play (kebijakan browser). Setelah preloader, disc berdenyut beberapa kali sebagai petunjuk.
- Web Audio API: `createMediaElementSource` → `AnalyserNode (fftSize 64)` → destination. Buat AudioContext saat klik pertama dan `resume()` bila suspended. Level audio (`lvl`) mendorong equalizer, denyut skala gerbang hexagon, dan sedikit FOV kamera 3D. Bungkus try/catch; jika analyser gagal, equalizer jalan dengan nilai acak.
- Label berubah "PLAYING" saat memutar. Di layar ≤700px, sembunyikan subtitle artis, equalizer, dan HUD kiri/kanan bawah.

## 7. Library (CDN, versi dipin)
GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13, Three.js r128, @tsparticles/slim 3.5.0, vanilla-tilt 1.8.1, anime.js 3.2.1, Typed.js 2.1.0.
Lenis disinkronkan ke `gsap.ticker`. Anchor `#id` memakai `lenis.scrollTo`.

## 8. Aksesibilitas dan performa
- Hormati `prefers-reduced-motion` (matikan loop, preloader, scramble, glitch; konten tetap tampil).
- Fallback bila WebGL gagal (halaman tetap terbaca di atas latar gelap).
- Kontras teks tetap terbaca; semua tombol punya `aria-label` bila hanya ikon.
- Mobile: jumlah gedung dan partikel dikurangi, rail disembunyikan. Target Lighthouse Performance ≥ 80 di mobile (abaikan bobot audio karena `preload="metadata"`).

## 9. Kriteria selesai (cek satu per satu)
- [ ] Tampilan dan animasi identik dengan `index.html` referensi.
- [ ] Tidak ada tulisan "Biba"; hanya "ART2FCL" (brand) dan "Azriel" (nama).
- [ ] Hanya 3 proyek; tombol kontak sesuai bagian 3.
- [ ] Musik tidak autoplay, play/pause/seek/mute berfungsi, equalizer bergerak.
- [ ] Tidak ada error di console; semua CDN dipin versi.
- [ ] README menjelaskan cara jalan lokal dan deploy.

## 10. Catatan
Lagu adalah karya berhak cipta. Untuk situs publik, pastikan punya izin/lisensi atau ganti dengan musik bebas royalti (cukup ganti file di `assets/audio/` dan teks judul/artis di player).
