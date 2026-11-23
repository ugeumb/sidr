# Panduan Pemasangan SIDR UGE
Student Internship Daily Report by UGE. Alamat akhir: https://ugeumb.github.io/sidr/

Waktu pasang sekitar 15 menit. Lakukan berurutan, dari akun Google yang akan menjadi pemilik data (disarankan akun UMB Andi).

## A. Pasang backend (Google Apps Script)
1. Buka https://script.google.com lalu klik **Proyek baru**. Beri nama `SIDR UGE`.
2. Hapus isi `Code.gs`, tempel seluruh isi file `server/Code.gs`.
3. Klik ikon roda gigi (Setelan proyek), centang **Tampilkan file manifes "appsscript.json"**. Buka file itu di editor, ganti isinya dengan isi `server/appsscript.json`.
4. Pilih fungsi `setup` di menu atas, klik **Jalankan**. Setujui izin (Lanjutan, lalu Buka SIDR UGE, lalu Izinkan). Fungsi ini membuat spreadsheet "SIDR UGE - Database", folder Drive "SIDR UGE - Berkas", dan 4 akun awal.
5. Klik **Terapkan, lalu Deployment baru**. Jenis: **Aplikasi web**. Jalankan sebagai: **Saya**. Yang memiliki akses: **Siapa saja**. Klik Terapkan.
6. Salin **URL aplikasi web** yang berakhiran `/exec`.

## B. Pasang tampilan (GitHub Pages)
1. Buka `config.js`, ganti `GANTI_DENGAN_URL_EXEC_APPS_SCRIPT` dengan URL `/exec` tadi. Hanya ini yang perlu diubah.
2. Di akun GitHub `ugeumb`, buat repositori publik bernama `sidr`.
3. Unggah semua isi folder (kecuali `server/` dan `tests/`, boleh ikut tapi tidak dipakai) ke cabang `main`.
4. Settings, Pages, Source: **Deploy from a branch**, branch `main`, folder `/ (root)`. Tunggu 1 sampai 2 menit.

## C. Langkah pertama setelah hidup
1. **Andi login lebih dulu** (andiazhar@umb.ac.id, password 12345) dan ganti password. Jangan bagikan URL sebelum ini, karena semua akun awal memakai 12345.
2. Di Apps Script, jalankan fungsi `ujiPdf` sekali dan buka PDF yang dibuat di Drive. Pastikan logo dan tabel tampil rapi. Ini satu-satunya bagian yang tidak bisa saya uji di luar Google.
3. Reva login (exa.reva@umb.ac.id, 12345), ganti password, buka **Kelola, Peserta**, isi asal sekolah dan email guru tiap peserta.
4. Kirim URL ke Zakia dan Filzah. Mereka login dengan email masing-masing, password 12345, lalu wajib menggantinya.
5. Instal di HP. Android Chrome: menu, Instal aplikasi. iPhone Safari: Bagikan, Tambah ke Layar Utama.

## C2. Jika versi sebelumnya sudah terpasang (pembaruan)
1. Tempel ulang `server/Code.gs` ke Apps Script (ganti seluruh isi), simpan.
2. Jalankan fungsi `ujiPdf` sekali. Google akan meminta izin baru (Google Docs). Setujui. Buka PDF hasilnya di Drive dan pastikan logo UMB tampil.
3. Terapkan, Kelola deployment, ikon pensil, Versi baru, Terapkan.
4. Di GitHub, unggah ulang semua berkas (berkas baru: `quotes.js`). Selesai. HP yang sudah memasang aplikasi akan memperbarui diri saat dibuka atau saat kembali ke aplikasi.

## C3. Menambah supervisor atau peserta baru
Andi login, buka **Kelola, Pengguna, Tambah**. Isi email, nama, dan peran (supervisor, peserta, atau superadmin). Untuk peserta, pilih supervisornya. Password awal 12345 dan wajib diganti saat login pertama. Setiap supervisor hanya melihat peserta yang ditugaskan kepadanya.

## D. Aturan yang berlaku
- Absen pagi dibuka 06:00. Masuk sampai 08:00 dihitung Tepat Waktu, lewat itu tercatat Terlambat.
- Absen sore dibuka 14:00, ditutup 21:00. Laporan KPI hanya bisa dikirim setelah absen sore.
- Titik absen: Gedung AD, radius 100 m, akurasi GPS maksimal 120 m. Semua bisa diubah Andi di **Kelola, Pengaturan**.
- Hari kerja Senin sampai Jumat. Libur bersama dan izin diatur Reva di **Kelola, Libur & Izin**.
- Persetujuan mingguan baru aktif pada hari kerja terakhir pekan itu. Laporan bulanan hanya memuat minggu yang sudah disetujui.

- Login bertahan sampai 1 tahun selama perangkat yang sama dipakai. Ganti password atau reset oleh admin otomatis mengeluarkan semua perangkat.
- Kata motivasi dan ayat Al-Quran berganti tiap hari dan ada di `quotes.js`. Sebaiknya teks Arab dan terjemahannya dicocokkan sekali dengan mushaf oleh ustaz atau ustazah di UMB.

## E. Jika kode diubah
Setiap kali `Code.gs` diedit, buat versi baru: **Terapkan, Kelola deployment, ikon pensil, Versi: Versi baru, Terapkan**. URL tetap sama. Tanpa langkah ini, perubahan tidak berlaku.

## F. Batasan yang perlu diketahui
- GPS di HP dapat dipalsukan dengan aplikasi tertentu. Sistem membatasi lewat radius dan akurasi, tetapi tidak bisa mencegah sepenuhnya. Reva dapat menjadikan koreksi manual sebagai jaring pengaman.
- Kuota Google: pengiriman email maksimal sekitar 100 per hari untuk akun gratis, jauh di atas kebutuhan aplikasi ini.
- Data ada di spreadsheet "SIDR UGE - Database". Jangan ubah kolom atau urutannya secara manual.
- Lupa password: Andi buka **Kelola, Pengguna, Reset password**. Passwordnya kembali 12345 dan wajib diganti.
