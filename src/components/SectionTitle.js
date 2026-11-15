import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: judul bagian (props: children)
export default function SectionTitle({ children }) {
  return <Text style={s.t}>{children}</Text>;
}

const s = StyleSheet.create({
  t: { fontSize: 17, fontWeight: '700', color: COLORS.ink, marginTop: 10, marginBottom: 10 },
});
