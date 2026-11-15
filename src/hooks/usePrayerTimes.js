import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const clean = (t) => String(t).slice(0, 5); // "04:23 (WIB)" -> "04:23"

// Custom hook: jadwal imsak/subuh/maghrib dari API Aladhan (metode 20 = Kemenag RI).
// Hasil terakhir disimpan di AsyncStorage sehingga tetap tampil saat offline.
export default function usePrayerTimes(city = 'Sukabumi') {
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let active = true;
    const cacheKey = 'prayer-cache-v1-' + city;
    setLoading(true);
    setTimes(null);
    setOffline(false);

    (async () => {
      let cached = null;
      try {
        const raw = await AsyncStorage.getItem(cacheKey);
        if (raw) {
          cached = JSON.parse(raw);
          if (active) setTimes(cached);
        }
      } catch (e) {
        cached = null;
      }

      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Indonesia&method=20`
        );
        const json = await res.json();
        const t = json.data.timings;
        const fresh = { Imsak: clean(t.Imsak), Fajr: clean(t.Fajr), Maghrib: clean(t.Maghrib) };
        if (!active) return;
        setTimes(fresh);
        setError(null);
        setOffline(false);
        AsyncStorage.setItem(cacheKey, JSON.stringify(fresh)).catch(() => {});
      } catch (e) {
        if (!active) return;
        if (cached) {
          setOffline(true);
          setError(null);
        } else {
          setError('Jadwal tidak dapat dimuat. Periksa koneksi internet.');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [city]);

  return { times, loading, error, offline };
}
