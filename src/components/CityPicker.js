import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: pilihan kota (props: cities, value, onChange)
export default function CityPicker({ cities, value, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.wrap}>
      {cities.map((c) => (
        <TouchableOpacity
          key={c}
          onPress={() => onChange(c)}
          style={[s.chip, value === c && s.chipActive]}
        >
          <Text style={[s.text, value === c && { color: COLORS.white }]}>{c}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 14, flexGrow: 0 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, marginRight: 8,
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line,
  },
  chipActive: { backgroundColor: COLORS.night, borderColor: COLORS.night },
  text: { color: COLORS.ink, fontWeight: '600', fontSize: 13 },
});
