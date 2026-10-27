# Edge Journal v3.2.0

Jurnal trading pribadi (PWA) — React 19, tanpa build tool, jalan langsung di GitHub Pages.
Data tersimpan lokal (localStorage) dan bisa disinkronkan online lewat Firebase (Auth + Firestore).

## Struktur folder

```
index.html            kerangka halaman: memuat CSS dan JS sesuai urutan
manifest.webmanifest  PWA (nama, ikon)
sw.js                 service worker (mode offline) — naikkan angka cache `C` setiap rilis
assets/               ikon dan gambar login
css/                  gaya, dimuat berurutan 01 → 10 (aturan belakangan menimpa yang depan)
js/
  splash.js           layar pembuka
  vendor/             React + ReactDOM 19 (satu berkas lokal, tanpa CDN)
  lib/                helper: format, perhitungan trading, penyimpanan, ikon, notifikasi, pembaca screenshot MT5 (mt5-parse, ocr)
  components/         komponen bersama: form, grafik, popup tambah/edit trade, Account management, kalender
  stats/              Advanced Statistics, Drill-down, Performa per bulan / Trader DNA
  pages/              Performance, My Journal, Tools, Profil
  firebase/           firebase-config.js, cloud-sync.js, cloud-ui.js (login dan kartu Sinkron online)
  app.js              komponen App (state, menu bawah, popup)
  boot.js             memasang aplikasi ke halaman
  watchdog.js, pwa.js pesan gagal-muat dan pendaftaran service worker
docs/                 panduan Firebase dan catatan perubahan (TODO.md)
```

Urutan pemuatan skrip ada di `index.html` dan penting: berkas `lib/` dulu, lalu `components/`, `stats/`, `pages/`, `firebase/cloud-ui.js`, `app.js`, terakhir `boot.js`. Semua skrip biasa (bukan modul) sehingga fungsi dan konstanta saling terlihat.

## Memperbarui lewat HP (tanpa komputer)

1. Satu kali: pastikan ada `.github/workflows/unzip.yml` (pembuka zip otomatis).
2. Unggah satu berkas `release.zip` ke root repositori (**Add file → Upload files**) lalu **Commit changes**.
3. Tunggu centang hijau di tab **Actions**; folder dan file otomatis ter-update. Berkas yang perlu dihapus ditulis di `HAPUS.txt` di dalam zip.

## Mengaktifkan GitHub Pages

**Settings → Pages → Build and deployment → Deploy from a branch → Branch: `main`, folder `/ (root)` → Save.**
Alamat aplikasi: `https://<username>.github.io/edge-journal-v3.0.0/`

## Sinkron online (Firebase)

Lihat `docs/PANDUAN_FIREBASE.md`. Isi konfigurasi ada di `js/firebase/firebase-config.js`.
