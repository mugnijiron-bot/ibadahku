import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, GROUPS } from '../utils/constants';

// Komponen: ringkasan baca-saja ibadah satu hari (props: title, entry, habits)
export default function DaySummary({ title, entry, habits }) {
  const done = (entry && entry.done) || {};
  const pages = (entry && entry.pages) || 0;
  const rows = [
    ...GROUPS.flatMap((g) => g.items.map((i) => ({ id: i.id, label: i.label }))),
    { id: 'qadha', label: 'Tidak berpuasa (qadha)' },
    ...habits.map((h) => ({ id: h.id, label: h.label })),
  ];
  const hasData = !!entry;

  return (
    <View style={s.card}>
      <Text style={s.title}>{title}</Text>
      {!hasData && <Text style={s.empty}>Belum ada catatan pada hari ini.</Text>}
      {hasData &&
        rows.map((r) => (
          <View key={r.id} style={s.row}>
            <Text style={[s.mark, done[r.id] ? s.ok : s.no]}>{done[r.id] ? '✓' : '○'}</Text>
            <Text style={[s.label, !done[r.id] && { color: COLORS.muted }]}>{r.label}</Text>
          </View>
        ))}
      {hasData && <Text style={s.pages}>Tilawah: {pages} halaman</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORS.line,
  },
  title: { fontSize: 15, fontWeight: '800', color: COLORS.night, marginBottom: 8 },
  empty: { color: COLORS.muted, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3 },
  mark: { width: 24, fontSize: 15, fontWeight: '800' },
  ok: { color: COLORS.green },
  no: { color: COLORS.muted },
  label: { fontSize: 14, color: COLORS.ink },
  pages: { marginTop: 8, fontSize: 13, fontWeight: '700', color: COLORS.night },
});
