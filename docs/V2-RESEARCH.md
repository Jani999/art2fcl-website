# Riset animasi V2 — 3 November 2026

Semua repository diperiksa melalui README, source/API GitHub, manifest dependency (jika ada), lisensi, status archived, dan tanggal commit. Tidak mengkloning/membundel demo. Seluruh kode efek V2 ditulis khusus untuk proyek ini; tidak menyalin shader/noise, aset, atau potongan implementasi upstream.

| Referensi | Bukti lisensi & maintenance | Evaluasi / keputusan |
| --- | --- | --- |
| [JosephASG/codrops-cinematic-scroll-animations](https://github.com/JosephASG/codrops-cinematic-scroll-animations) | Tidak ada file lisensi pada root / API license null; aktif 16 Maret 2026 | React19/Fiber9/Drei10 kompatibel secara konsep, tetapi Vite, HashRouter, OGL, transitions-kit dan postprocessing tidak diperlukan. Tidak mengadopsi kode karena izin tidak jelas. Referensi susunan narasi saja. |
| [Faboolea/shaders-on-scroll](https://github.com/Faboolea/shaders-on-scroll) | LICENSE MIT, package.json menyatakan ISC; terakhir 8 Oktober 2022 | Demo Parcel/Three0.129/GSAP3.7, shader menyertakan noise Stefan Gustavson MIT. Tidak mengadopsi pipeline/noise lama. Teknik uniform berbasis scroll dipilih; implementasi GLSL tekstur RGBA baru tanpa dependency tambahan. |
| [codrops/Staggered3DGridAnimations](https://github.com/codrops/Staggered3DGridAnimations) | MIT, tidak archived; 27 Oktober 2024 | Vanilla script, GSAP/ScrollTrigger/SplitText/Lenis lokal. Perspektif grid dipilih; tidak mengambil global script atau SplitText. React button tetap semantik, transform sederhana tanpa filter blur mahal. |
| [houmahani/codrops-depth-gallery](https://github.com/houmahani/codrops-depth-gallery) | MIT; 9 Maret 2026 | Vite, Three0.183, tweakpane; custom wheel/touch preventDefault dan RAF sendiri berpotensi konflik Lenis. Hanya ide velocity teredam/pausing dipakai dalam clock GSAP tunggal. Tidak memakai particles/trails/debug runtime. |
| [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) | **MIT + Commons Clause**, LICENSE.md; 31 Oktober 2026 | Bukan MIT murni. Pembatasan redistribusi komponen/tools mandiri. Banyak dependency opsional (OGL, physics, postprocessing). Tidak menambah/mengadopsi komponennya karena stack saat ini sudah cukup. |
| [codrops/3DCarousel](https://github.com/codrops/3DCarousel) | MIT; 13 Oktober 2026 | GSAP ScrollSmoother dan SplitText, grid WebGL transition, velocity springs. Tidak memasang ScrollSmoother bersama Lenis. Prinsip perspective panels dan keyboard exit dipertahankan dalam implementasi orisinal. |
| [Codrops](https://github.com/codrops) | Organisasi, lisensi dinilai per repository | Referensi creative coding, bukan blanket license semua karya. Tidak memakai aset demo. |

## Tiga teknik terpilih

1. **Rekonstruksi strip / image-plane separation**: satu cutout yang sama, clip-path deterministik, 6 strip untuk awal/akhir, 3 bidang konservatif untuk anatomi. Tidak mengklaim segmentasi anatomi 3D. Gerak pendek, kembali tepat saat scroll dibalik.
2. **Displacement GLSL**: satu plane transparan, satu tekstur, spatial slicing 36 baris, UV offset, RGB separation terbatas. Intensitas berbentuk kurva terhadap progress, tanpa random time flicker. Native fallback tetap tersedia bila WebGL gagal.
3. **Perspective archive traversal**: panel DOM transformZ/rotateY berselang, grid garis kedalaman. Tombol asli dan dialog tetap accessible; focus-within meratakan panel agar keyboard tidak mengejar transform.

## Kompatibilitas dan biaya

- React19/Fiber9/Drei10/Three0.187 yang sudah terpasang dipakai kembali. Tidak menambah library animasi.
- GSAP Standard No-Charge License; Lenis, Three, Fiber, Drei, Motion MIT; Lucide ISC. Noto Sans JP: SIL OFL, font lokal.
- Canvas hanya pada bab Breach. `frameloop="never"`; render melalui clock GSAP, hanya saat visible dan uniforms berubah. DPR maksimum 1.35; mobile maksimum 30 render/detik. Tidak ada render ketika tab hidden, progress/velocity diam, atau mode FX/performance rendah.
- Geometry/material dikelola R3F; texture milik komponen di-dispose saat unmount. Observer dan subscriber dibersihkan. Tidak ada alokasi texture/material per frame.
- PNG/WebP fallback selalu ada. Static export tidak memakai server API, middleware, atau runtime secrets. Tidak ada bundler shader loader khusus.
- Kode lama V1 masih tersedia melalui commit main; produksi tidak diubah selama review V2.
