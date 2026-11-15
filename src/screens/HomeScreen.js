import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useRamadhanData } from '../context/RamadhanContext';
import { useAuth } from '../context/AuthContext';
import useRamadhan from '../hooks/useRamadhan';
import usePrayerTimes from '../hooks/usePrayerTimes';
import useCountdown from '../hooks/useCountdown';
import CountdownCard from '../components/CountdownCard';
import ProgressCard from '../components/ProgressCard';
import StatCard from '../components/StatCard';
import SectionTitle from '../components/SectionTitle';
import DoaCard from '../components/DoaCard';
import CityPicker from '../components/CityPicker';
import { COLORS, CITIES, formatLong } from '../utils/constants';

export default function HomeScreen() {
  const { state, dispatch } = useRamadhanData();
  const { user, content } = useAuth();
  const r = useRamadhan(state);
  const { times, loading, error, offline } = usePrayerTimes(state.city);
  const cd = useCountdown(times);

  const headline =
    r.status === 'during'
      ? `Ramadhan hari ke-${r.dayNumber}`
      : r.status === 'before'
      ? `${r.daysUntil} hari menuju Ramadhan`
      : 'Ramadhan telah usai';

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={s.greet}>Marhaban ya Ramadhan, {user.name}</Text>
      <Text style={s.headline}>{headline}</Text>
      <Text style={s.date}>Awal Ramadhan: {formatLong(state.startDate)}</Text>

      {content.announcement ? (
        <View style={s.announce}>
          <Text style={s.announceTitle}>📢 Pengumuman</Text>
          <Text style={s.announceText}>{content.announcement}</Text>
        </View>
      ) : null}

      <CityPicker
        cities={CITIES}
        value={state.city}
        onChange={(c) => dispatch({ type: 'SET_CITY', city: c })}
      />

      <CountdownCard
        label={cd ? `${cd.label} (${state.city})` : `Jadwal ${state.city}`}
        remaining={cd ? cd.remaining : null}
        imsak={cd ? cd.imsak : ''}
        maghrib={cd ? cd.maghrib : ''}
        message={loading ? 'Memuat jadwal...' : error}
        note={offline ? 'Offline: memakai jadwal tersimpan terakhir' : ''}
      />

      <ProgressCard
        title="Ibadah hari ini"
        percent={r.percent}
        subtitle={`${r.doneCount} dari ${r.total} amalan selesai`}
      />

      <View style={s.row}>
        <StatCard value={`${r.fastDays}/30`} label="Hari puasa" />
        <StatCard value={`${r.streak}`} label="Streak puasa" />
        <StatCard value={`${r.khatamPercent}%`} label="Khatam" />
      </View>

      {content.doa.length > 0 && (
        <View>
          <SectionTitle>Doa harian</SectionTitle>
          <DoaCard items={content.doa} />
        </View>
      )}

      <SectionTitle>Semangat hari ini</SectionTitle>
      <View style={s.quote}>
        <Text style={s.quoteText}>{r.motivation}</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  greet: { fontSize: 14, color: COLORS.muted },
  headline: { fontSize: 26, fontWeight: '800', color: COLORS.night, marginTop: 2 },
  date: { fontSize: 13, color: COLORS.muted, marginBottom: 14 },
  announce: {
    backgroundColor: '#FBF3DD', borderRadius: 14, padding: 14, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.gold,
  },
  announceTitle: { fontWeight: '800', color: COLORS.night, marginBottom: 4 },
  announceText: { color: COLORS.ink, fontSize: 14, lineHeight: 20 },
  row: { flexDirection: 'row', marginHorizontal: -4, marginBottom: 8 },
  quote: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 16,
    borderLeftWidth: 4, borderLeftColor: COLORS.gold, marginBottom: 10,
  },
  quoteText: { fontSize: 15, color: COLORS.ink, lineHeight: 22 },
});
