import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: penghitung halaman tilawah (props: value, target, onChange)
export default function Stepper({ value, target, onChange }) {
  return (
    <View style={s.card}>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>Tilawah Al-Qur'an</Text>
        <Text style={s.sub}>
          {value} halaman hari ini (target {target} halaman untuk khatam)
        </Text>
      </View>
      <TouchableOpacity style={s.btn} onPress={() => onChange(value - 1)}>
        <Text style={s.btnText}>−</Text>
      </TouchableOpacity>
      <Text style={s.value}>{value}</Text>
      <TouchableOpacity style={s.btn} onPress={() => onChange(value + 1)}>
        <Text style={s.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 14,
    borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.line,
  },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.ink },
  sub: { fontSize: 12, color: COLORS.muted, marginTop: 2, paddingRight: 8 },
  btn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.night,
    alignItems: 'center', justifyContent: 'center',
  },
  btnText: { color: COLORS.white, fontSize: 20, fontWeight: '700', marginTop: -2 },
  value: { width: 38, textAlign: 'center', fontSize: 18, fontWeight: '800', color: COLORS.night },
});
