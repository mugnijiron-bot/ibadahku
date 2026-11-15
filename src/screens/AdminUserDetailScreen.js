import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, userDataKey } from '../context/AuthContext';
import useRamadhan from '../hooks/useRamadhan';
import DayGrid from '../components/DayGrid';
import DaySummary from '../components/DaySummary';
import StatCard from '../components/StatCard';
import SectionTitle from '../components/SectionTitle';
import {
  COLORS, DEFAULT_REMINDERS, effectiveTime, formatDateTime, formatLong,
} from '../utils/constants';

const BASE = { city: 'Sukabumi', habits: [], reminders: DEFAULT_REMINDERS, qadhaPaid: 0, log: {} };

// Layar admin: memantau ibadah & penggunaan aplikasi satu pengguna (baca-saja)
export default function AdminUserDetailScreen({ route, navigation }) {
  const { userId } = route.params;
  const { users, content } = useAuth();
  const user = users.find((u) => u.id === userId);
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(userDataKey(userId));
        if (active && raw) setData(JSON.parse(raw));
      } catch (e) {
        // data tidak terbaca: tampilkan data kosong
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    navigation.setOptions({ title: user ? user.name : 'Detail pengguna' });
  }, [navigation, user]);

  const state = useMemo(
    () => ({ ...BASE, ...(data || {}), startDate: content.startDate, motivasi: content.motivasi }),
    [data, content.startDate, content.motivasi]
  );
  const r = useRamadhan(state);

  if (!user) {
    return (
      <View style={s.container}>
        <Text style={{ padding: 20, color: COLORS.muted }}>Pengguna tidak ditemukan.</Text>
      </View>
    );
  }

  const dayKey = selected || r.today;
  const activeReminders = state.reminders.filter((x) => x.enabled);
  const earned = r.badges.filter((b) => b.earned).length;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <View style={s.card}>
        <Text style={s.name}>{user.name}</Text>
        <Text style={s.sub}>{user.email}</Text>
        <Text style={s.sub}>Kota jadwal: {state.city}</Text>
        <Text style={s.sub}>Aktif terakhir: {formatDateTime(state.lastActive)}</Text>
      </View>

      <View style={[s.row, { marginTop: 12 }]}>
        <StatCard value={`${r.fastDays}/30`} label="Hari puasa" />
        <StatCard value={`${r.streak}`} label="Streak" />
        <StatCard value={`${r.tarawihDays}`} label="Tarawih" />
      </View>
      <View style={[s.row, { marginTop: 8 }]}>
        <StatCard value={`${r.totalPages}`} label="Halaman" />
        <StatCard value={`${r.khatamPercent}%`} label="Khatam" />
        <StatCard value={`${r.qadhaOwed}`} label="Utang qadha" />
      </View>

      <SectionTitle>Kalender puasa</SectionTitle>
      <DayGrid days={r.grid} onPressDay={(d) => setSelected(d.key)} />
      <Text style={s.hint}>Ketuk tanggal untuk melihat ibadah pada hari itu.</Text>

      <DaySummary
        title={formatLong(dayKey)}
        entry={state.log[dayKey]}
        habits={state.habits}
      />

      <SectionTitle>Kebiasaan tambahan</SectionTitle>
      <View style={s.card}>
        {state.habits.length === 0 ? (
          <Text style={s.sub}>Belum menambah kebiasaan.</Text>
        ) : (
          state.habits.map((h) => (
            <Text key={h.id} style={s.item}>• {h.label}</Text>
          ))
        )}
      </View>

      <SectionTitle>Pengingat aktif</SectionTitle>
      <View style={s.card}>
        {activeReminders.length === 0 ? (
          <Text style={s.sub}>Tidak ada pengingat aktif.</Text>
        ) : (
          activeReminders.map((x) => (
            <Text key={x.id} style={s.item}>
              • {x.label} ({x.anchor === 'fixed' ? effectiveTime(x, null) : `${x.anchor} ${x.offset >= 0 ? '+' : ''}${x.offset} mnt`})
            </Text>
          ))
        )}
      </View>

      <SectionTitle>Pencapaian</SectionTitle>
      <View style={s.card}>
        <Text style={s.item}>{earned} dari {r.badges.length} lencana tercapai</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  card: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORS.line,
  },
  name: { fontSize: 18, fontWeight: '800', color: COLORS.night },
  sub: { color: COLORS.muted, fontSize: 13, marginTop: 3 },
  item: { color: COLORS.ink, fontSize: 14, marginVertical: 2 },
  row: { flexDirection: 'row', marginHorizontal: -4 },
  hint: { color: COLORS.muted, fontSize: 12, marginVertical: 8 },
});
