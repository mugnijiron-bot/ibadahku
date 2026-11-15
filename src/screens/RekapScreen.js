import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRamadhanData } from '../context/RamadhanContext';
import useRamadhan from '../hooks/useRamadhan';
import DayGrid from '../components/DayGrid';
import StatCard from '../components/StatCard';
import BadgeCard from '../components/BadgeCard';
import SectionTitle from '../components/SectionTitle';
import { COLORS, KHATAM_PAGES, formatLong } from '../utils/constants';

export default function RekapScreen({ navigation }) {
  const { state, dispatch } = useRamadhanData();
  const r = useRamadhan(state);

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <SectionTitle>Kalender 30 hari</SectionTitle>
      <DayGrid days={r.grid} onPressDay={(d) => navigation.navigate('DayDetail', { date: d.key })} />
      <Text style={s.legend}>
        Ketuk tanggal untuk melihat atau mengubah catatan. Hijau: puasa. Merah muda: qadha. Lingkaran emas: hari ini.
      </Text>

      <View style={s.row}>
        <StatCard value={`${r.fastDays}`} label="Hari puasa" />
        <StatCard value={`${r.streak}`} label="Streak puasa" />
        <StatCard value={`${r.tarawihDays}`} label="Malam tarawih" />
      </View>
      <View style={[s.row, { marginTop: 8 }]}>
        <StatCard value={`${r.totalPages}`} label={`Halaman (dari ${KHATAM_PAGES})`} />
        <StatCard value={`${r.khatamPercent}%`} label="Progres khatam" />
      </View>

      <SectionTitle>Utang puasa (qadha)</SectionTitle>
      <View style={s.card}>
        <Text style={s.big}>{r.qadhaOwed} hari belum diganti</Text>
        <Text style={s.hint}>
          Tidak berpuasa: {r.qadhaCount} hari. Sudah diganti: {state.qadhaPaid} hari.
        </Text>
        <View style={s.btnRow}>
          <TouchableOpacity style={s.btn} onPress={() => dispatch({ type: 'ADJUST_QADHA', delta: -1 })}>
            <Text style={s.btnText}>- 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, { marginRight: 0 }]}
            onPress={() => dispatch({ type: 'ADJUST_QADHA', delta: 1 })}
          >
            <Text style={s.btnText}>Sudah ganti +1</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SectionTitle>Pencapaian</SectionTitle>
      {r.badges.map((b) => (
        <BadgeCard key={b.id} title={b.title} desc={b.desc} earned={b.earned} />
      ))}

      <SectionTitle>Tanggal 1 Ramadhan</SectionTitle>
      <View style={s.card}>
        <Text style={s.big}>{formatLong(state.startDate)}</Text>
        <Text style={s.hint}>Ditetapkan oleh admin sesuai keputusan pemerintah.</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  legend: { color: COLORS.muted, fontSize: 12, marginVertical: 10, lineHeight: 18 },
  row: { flexDirection: 'row', marginHorizontal: -4 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: COLORS.line,
  },
  big: { fontSize: 18, fontWeight: '800', color: COLORS.night },
  hint: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  btnRow: { flexDirection: 'row', marginTop: 12 },
  btn: {
    flex: 1, backgroundColor: COLORS.soft, borderRadius: 10, paddingVertical: 10,
    alignItems: 'center', marginRight: 8,
  },
  btnText: { color: COLORS.night, fontWeight: '700' },
});
