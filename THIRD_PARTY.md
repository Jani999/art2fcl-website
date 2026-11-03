# Dependensi dan eksperimen visual

## Pembaruan V2

Audit tujuh referensi dan tiga teknik pilihan tersedia di [V2-RESEARCH.md](docs/V2-RESEARCH.md). V2 menggunakan Fiber/Three untuk satu shader transparan orisinal di bab Breach, selain viewer GLB opsional. Noto Sans JP (SIL OFL) ditambahkan sebagai font lokal. Tidak ada library animasi tambahan atau kode demo upstream yang disalin. Detail di bawah adalah catatan implementasi V1.

Pemeriksaan: 3 November 2026. Versi persis dikunci dalam package-lock.json.

| Proyek | Lisensi / kompatibilitas | Keputusan |
| --- | --- | --- |
| [Lenis](https://github.com/darkroomengineering/lenis) | MIT; tidak diarsipkan; push 29 Oktober 2026 | Digunakan untuk smooth scroll, satu ticker GSAP; dimatikan pada reduced motion dan performance low. |
| [React Three Fiber](https://github.com/pmndrs/react-three-fiber) | MIT; tidak diarsipkan; push 21 Oktober 2026; v9 untuk React 19 | Viewer GLB opsional, dimuat dinamis. Tidak ada canvas WebGL aktif pada pengalaman PNG. |
| [Drei](https://github.com/pmndrs/drei) | MIT; tidak diarsipkan; push 21 Oktober 2026; v10 untuk Fiber 9 | Bounds, useGLTF, OrbitControls pada viewer opsional. DPR dibatasi 1.5. |
| [Codrops ScrollBasedLayoutAnimations](https://github.com/codrops/ScrollBasedLayoutAnimations) | MIT; tidak diarsipkan; push 31 Oktober 2026 | Referensi konsep transformasi komposisi saat scroll. Tidak menyalin kode, gambar, atau dependency demo. Timeline editorial dibuat khusus dengan GSAP. |
| [Codrops ScrollTextMotion](https://github.com/codrops/ScrollTextMotion) | MIT; tidak diarsipkan; push 19 Desember 2025 | Dikaji sebagai referensi kinetic typography. Filter SVG terus-menerus tidak diadopsi; scale, skew, tracking dan clipping terbatas pada bab Breach dipilih untuk biaya rendering lebih rendah. |
| [GSAP](https://github.com/greensock/GSAP) | Standard no-charge license, bukan MIT; penggunaan komersial diizinkan sesuai [ketentuan](https://gsap.com/standard-license/) | ScrollTrigger, scrubbing reversible, context cleanup; tidak memakai plugin berbayar/proprietary demo. |
| Motion, Three.js, Lucide | MIT, MIT, ISC | Motion hanya dialog; Three untuk viewer; Lucide untuk kontrol UI. |
| Archivo Black, IBM Plex Mono | SIL Open Font License | Font lokal melalui paket Fontsource; build tidak mengambil Google Fonts. |

Lisensi asli paket tersedia dalam node_modules setelah npm ci. Tidak ada kode Codrops yang disalin sehingga tidak ada potongan kode upstream yang perlu disertakan. Efek shader layar penuh ditolak untuk menjaga GPU mobile; robekan sinyal menggunakan transformasi CSS/GSAP terbatas pada satu bab. Performance low mematikan Lenis dan visualizer; FX low meniadakan timeline sinematik.

Gambar dan audio adalah aset yang disediakan pemilik proyek, bukan aset berlisensi dari dependensi. DEMON’S SHOT — Aiobahn +81 feat. DEMONDICE mungkin memerlukan izin pemegang hak untuk distribusi publik. Lisensi dependency tidak memberikan hak atas rekaman tersebut.
