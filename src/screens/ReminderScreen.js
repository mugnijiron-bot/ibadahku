import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRamadhanData } from '../context/RamadhanContext';
import usePrayerTimes from '../hooks/usePrayerTimes';
import ReminderItem from '../components/ReminderItem';
import SectionTitle from '../components/SectionTitle';
import { syncReminders } from '../utils/notify';
import { COLORS, effectiveTime, shiftTime } from '../utils/constants';

const anchorName = { imsak: 'imsak', maghrib: 'Maghrib' };

export default function ReminderScreen() {
  const { state, dispatch } = useRamadhanData();
  const { times } = usePrayerTimes(state.city);
  const [busy, setBusy] = useState(false);

  const noteFor = (r) => {
    if (r.anchor === 'fixed') return 'Jam tetap';
    const sign = r.offset >= 0 ? '+' : '';
    const src = times ? '' : ' (jadwal belum termuat, memakai jam cadangan)';
    return `Mengikuti ${anchorName[r.anchor]} ${state.city}: ${sign}${r.offset} menit${src}`;
  };

  const shift = (r, minutes) => {
    const patch =
      r.anchor !== 'fixed' && times
        ? { offset: r.offset + minutes }
        : { time: shiftTime(r.time, minutes) };
    dispatch({ type: 'UPDATE_REMINDER', id: r.id, patch });
  };

  const apply = async () => {
    setBusy(true);
    const list = state.reminders.map((r) => ({ ...r, time: effectiveTime(r, times) }));
    const res = await syncReminders(list);
    setBusy(false);
    if (res.ok) Alert.alert('Berhasil', `${res.count} pengingat harian sudah dijadwalkan.`);
    else Alert.alert('Belum berhasil', res.reason);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <SectionTitle>Pengingat harian</SectionTitle>
      <Text style={s.hint}>
        Pengingat sahur, imsak, berbuka, dan tarawih otomatis mengikuti jadwal kota {state.city}.
        Atur selisih menitnya, aktifkan yang kamu perlukan, lalu tekan tombol di bawah.
        Tekan lagi setelah berganti kota atau mengubah pengaturan.
      </Text>

      {state.reminders.map((r) => (
        <ReminderItem
          key={r.id}
          label={r.label}
          message={r.message}
          time={effectiveTime(r, times)}
          note={noteFor(r)}
          enabled={r.enabled}
          onToggle={(v) => dispatch({ type: 'UPDATE_REMINDER', id: r.id, patch: { enabled: v } })}
          onShift={(m) => shift(r, m)}
        />
      ))}

      <TouchableOpacity style={s.apply} onPress={apply} disabled={busy}>
        {busy ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={s.applyText}>Terapkan pengingat</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hint: { color: COLORS.muted, fontSize: 13, marginBottom: 12, lineHeight: 19 },
  apply: {
    backgroundColor: COLORS.night, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', marginTop: 6,
  },
  applyText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});
