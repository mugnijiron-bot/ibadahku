import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: hitung mundur (props: label, remaining, imsak, maghrib, message, note)
export default function CountdownCard({ label, remaining, imsak, maghrib, message, note }) {
  return (
    <View style={s.card}>
      <Text style={s.label}>{label || 'Hitung mundur'}</Text>
      {remaining ? (
        <>
          <Text style={s.time}>{remaining}</Text>
          <Text style={s.sub}>Imsak {imsak}   |   Berbuka {maghrib}</Text>
        </>
      ) : (
        <Text style={s.msg}>{message}</Text>
      )}
      {note ? <Text style={s.note}>{note}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: COLORS.night, borderRadius: 20, padding: 20, marginBottom: 16 },
  label: { color: COLORS.gold, fontSize: 14, fontWeight: '700' },
  time: { color: COLORS.white, fontSize: 46, fontWeight: '800', marginVertical: 6 },
  sub: { color: '#C9CFEA', fontSize: 13 },
  msg: { color: '#C9CFEA', marginTop: 8, fontSize: 14 },
  note: { color: COLORS.gold, marginTop: 8, fontSize: 12 },
});
