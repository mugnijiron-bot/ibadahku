import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: progres ibadah (props: percent, title, subtitle)
export default function ProgressCard({ percent, title, subtitle }) {
  return (
    <View style={s.card}>
      <View style={s.head}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.percent}>{percent}%</Text>
      </View>
      <View style={s.track}>
        <View style={[s.fill, { width: `${percent}%` }]} />
      </View>
      <Text style={s.sub}>{subtitle}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.line,
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.ink },
  percent: { fontSize: 22, fontWeight: '800', color: COLORS.night },
  track: { height: 8, borderRadius: 4, backgroundColor: COLORS.soft, marginVertical: 10, overflow: 'hidden' },
  fill: { height: 8, backgroundColor: COLORS.gold, borderRadius: 4 },
  sub: { color: COLORS.muted, fontSize: 13 },
});
