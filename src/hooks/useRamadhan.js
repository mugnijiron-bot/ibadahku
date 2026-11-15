import { useMemo } from 'react';
import {
  ALL_ITEMS, KHATAM_PAGES, MOTIVASI, addDays, dateKey, diffDays,
} from '../utils/constants';

// Custom hook: status Ramadhan, progres harian, rekap 30 hari, streak, qadha, badge
export default function useRamadhan(state) {
  return useMemo(() => {
    const today = dateKey();
    const offset = diffDays(today, state.startDate); // 0 = hari pertama
    const status = offset < 0 ? 'before' : offset > 29 ? 'after' : 'during';
    const dayNumber = offset + 1;

    const day = state.log[today] || { done: {}, pages: 0 };
    const doneCount =
      ALL_ITEMS.filter((i) => day.done[i.id]).length +
      state.habits.filter((h) => day.done[h.id]).length;
    const total = ALL_ITEMS.length + state.habits.length;
    const percent = total ? Math.round((doneCount / total) * 100) : 0;

    const grid = [];
    for (let n = 0; n < 30; n++) {
      const key = addDays(state.startDate, n);
      const entry = state.log[key];
      grid.push({
        n: n + 1,
        key,
        fasted: !!(entry && entry.done.puasa),
        missed: !!(entry && entry.done.qadha),
        isToday: key === today,
        isFuture: key > today,
      });
    }

    const fastDays = grid.filter((g) => g.fasted).length;
    const qadhaCount = grid.filter((g) => g.missed).length;
    const qadhaOwed = Math.max(0, qadhaCount - (state.qadhaPaid || 0));
    const tarawihDays = grid.filter((g) => state.log[g.key] && state.log[g.key].done.tarawih).length;
    const totalPages = Object.values(state.log).reduce((sum, d) => sum + (d.pages || 0), 0);
    const khatamPercent = Math.min(100, Math.round((totalPages / KHATAM_PAGES) * 100));

    // streak puasa berturut-turut sampai hari ini (hari ini boleh belum dicatat)
    let streak = 0;
    let i = Math.min(offset, 29);
    if (i >= 0) {
      if (!grid[i].fasted) i--;
      while (i >= 0 && grid[i].fasted) {
        streak++;
        i--;
      }
    }

    const badges = [
      { id: 'b1', title: 'Pemula', desc: 'Puasa 7 hari', earned: fastDays >= 7 },
      { id: 'b2', title: 'Pertengahan', desc: 'Puasa 15 hari', earned: fastDays >= 15 },
      { id: 'b3', title: 'Puasa penuh', desc: 'Puasa 30 hari', earned: fastDays >= 30 },
      { id: 'b4', title: 'Istiqomah', desc: 'Streak puasa 7 hari', earned: streak >= 7 },
      { id: 'b5', title: 'Ahli tarawih', desc: 'Tarawih 10 malam', earned: tarawihDays >= 10 },
      { id: 'b6', title: 'Khatam', desc: `Baca ${KHATAM_PAGES} halaman`, earned: khatamPercent >= 100 },
    ];

    const list = state.motivasi && state.motivasi.length ? state.motivasi : MOTIVASI;
    const motivation = list[new Date().getDate() % list.length];

    return {
      today, day, status, dayNumber, daysUntil: -offset,
      doneCount, total, percent, grid, fastDays, qadhaCount, qadhaOwed,
      tarawihDays, totalPages, khatamPercent, streak, badges, motivation,
    };
  }, [state]);
}
