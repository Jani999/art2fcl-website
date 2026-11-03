# Inventaris sebelum V2

Baseline: c529d1d, produksi https://art2fcl.my.id. Branch kerja `feature/cinematic-v2`; tidak mengubah main, DNS, atau konfigurasi Pages.

| Komponen | Temuan | Perbaikan V2 |
| --- | --- | --- |
| Experience / hero | PNG lama berlatar, framing memangkas tubuh, dominan zoom | Cutout baru utuh, scanner dan perakitan strip; judul dua bidang kedalaman |
| useCinematics | Satu pin, zoom/parallax berulang, scene terpisah | Enam score/timeline scrub dengan progres bersama dan velocity terbatas |
| Anatomi | Bidang gambar datar dengan rotasi Y | Pemisahan bidang citra konservatif, overlay pengukuran, hotspot ikut bidang yang sesuai |
| Breach | Garis CSS; tidak ada distorsi GLSL | Satu transparent WebGL plane, displacement/slicing/aberration reversibel |
| Archive | Daftar editorial datar | Galeri perspektif dengan panel interaktif dan mode keyboard/fallback datar |
| Terminal | Interpreter sudah berfungsi | Autocomplete, diagnostik terstruktur, corrupt/restore/scan dengan respons UI nyata |
| Final | Zoom gambar ulang | Rekonstruksi strip dan mask judul |
| NowPlaying | Dock menutup sebagian area gambar pada viewport kecil | Rail bawah tersendiri, ruang aman di semua frame, expand tetap fungsional |
| Model3D | GLB opsional, tidak ada aset model | Pertahankan interface, PNG/2.5D tetap jujur |

Aset baru ditemukan dengan nama `Cybernetic Marble Lady Justice.png` (tanpa `(1)`). RGBA 1024×1536 dengan 618.175 pixel alpha nol; tidak ada GLB/GLTF. Original dipertahankan. Script tidak merekonstruksi bagian yang hilang dari sumber.
