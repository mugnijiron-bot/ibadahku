import { addDays } from './constants';

// Ringkasan data satu pengguna untuk dasbor admin
export function summarizeUser(data, startDate) {
  if (!data || !data.log) return { fastDays: 0, tarawih: 0, pages: 0, lastActive: null };
  let fastDays = 0;
  let tarawih = 0;
  for (let n = 0; n < 30; n++) {
    const e = data.log[addDays(startDate, n)];
    if (e && e.done) {
      if (e.done.puasa) fastDays++;
      if (e.done.tarawih) tarawih++;
    }
  }
  const pages = Object.values(data.log).reduce((sum, d) => sum + (d.pages || 0), 0);
  return { fastDays, tarawih, pages, lastActive: data.lastActive || null };
}
