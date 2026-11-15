import { useEffect, useMemo, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');
const at = (base, hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m, 0);
};

// Custom hook: hitung mundur ke imsak / waktu berbuka, diperbarui tiap detik
export default function useCountdown(times) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    if (!times) return null;
    const imsak = at(now, times.Imsak);
    const maghrib = at(now, times.Maghrib);
    let label, target;
    if (now < imsak) {
      label = 'Menuju imsak';
      target = imsak;
    } else if (now < maghrib) {
      label = 'Menuju waktu berbuka';
      target = maghrib;
    } else {
      label = 'Menuju imsak besok';
      target = new Date(imsak.getTime() + 86400000);
    }
    const s = Math.max(0, Math.floor((target - now) / 1000));
    return {
      label,
      remaining: `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`,
      imsak: times.Imsak,
      maghrib: times.Maghrib,
    };
  }, [now, times]);
}
