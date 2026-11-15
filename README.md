# RamadhanKu – Pengingat & Manajemen Ibadah Kebiasaan Ramadhan (React Native / Expo)

UTS Mobile Programming Native, Universitas Muhammadiyah Sukabumi.

## Fitur
- Beranda: hari Ramadhan ke-N, pilihan kota, hitung mundur imsak/berbuka (jadwal Kemenag via API Aladhan, tersimpan offline), doa harian, motivasi
- Ibadah: checklist puasa, sholat, tarawih, dzikir, sedekah, tilawah, kebiasaan tambahan
- Pengingat: notifikasi harian yang mengikuti jadwal imsak/Maghrib kota terpilih
- Rekap: kalender 30 hari (ketuk untuk edit hari lain), streak, utang puasa (qadha), pencapaian, progres khatam

## Akun & peran
- **User:** daftar dan masuk memakai **email** + password. Data ibadah, kota, dan pengingat tersimpan terpisah per akun.
- **Admin:** akun awal `admin@ramadhanku.com` / `admin123` (segera ganti di tab Akun). Admin melihat dasbor pengguna, membuka detail aktivitas tiap pengguna (kalender puasa, ibadah per hari, kebiasaan, pengingat, aktif terakhir), menghapus pengguna, mengatur tanggal 1 Ramadhan, pengumuman, kalimat semangat, dan doa untuk semua pengguna.
- Password disimpan sebagai hash SHA-256 + salt (expo-crypto). Semua data tersimpan lokal di perangkat (AsyncStorage), bukan di server.

## Pemenuhan soal UTS
| Ketentuan | Implementasi |
|---|---|
| Minimal 4 komponen | CountdownCard, ProgressCard, CheckItem, StatCard, Stepper, ReminderItem, DayGrid, DayForm, CityPicker, BadgeCard, DoaCard, SectionTitle |
| State & props | State di Context/screen, dikirim ke komponen lewat props |
| Navigasi | Stack root (Login / Area User / Area Admin) + Bottom Tab per peran + Stack di tab Rekap (Rekap -> Detail hari, kirim data lewat route.params) |
| Hooks | useState, useEffect, useReducer, useContext, useMemo, useCallback, custom hook usePrayerTimes, useCountdown, useRamadhan |
| Kreativitas | Countdown real-time, notifikasi mengikuti jadwal, cache offline, qadha, lencana |

## Menjalankan
```bash
npm install
npx expo install --fix
npx expo start -c
```
