import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: baris teks dengan tombol hapus (props: text, onRemove)
export default function RemovableRow({ text, onRemove }) {
  return (
    <View style={s.row}>
      <Text style={s.text} numberOfLines={3}>{text}</Text>
      <TouchableOpacity onPress={onRemove} style={s.btn}>
        <Text style={s.x}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 12,
    borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.line,
  },
  text: { flex: 1, color: COLORS.ink, fontSize: 14, lineHeight: 20 },
  btn: { paddingHorizontal: 10, paddingVertical: 4 },
  x: { color: '#9B2C2C', fontSize: 16, fontWeight: '800' },
});
