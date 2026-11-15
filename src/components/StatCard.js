import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: kartu angka ringkas (props: value, label)
export default function StatCard({ value, label }) {
  return (
    <View style={s.card}>
      <Text style={s.value}>{value}</Text>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORS.line, marginHorizontal: 4,
  },
  value: { fontSize: 24, fontWeight: '800', color: COLORS.night },
  label: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
});
