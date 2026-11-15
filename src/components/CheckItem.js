import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: baris centang (props: label, detail, checked, onToggle, onLongPress)
export default function CheckItem({ label, detail, checked, onToggle, onLongPress }) {
  return (
    <TouchableOpacity
      style={[s.row, checked && s.rowDone]}
      onPress={onToggle}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={[s.box, checked && s.boxDone]}>{checked && <Text style={s.tick}>✓</Text>}</View>
      <View style={{ flex: 1 }}>
        <Text style={[s.label, checked && s.labelDone]}>{label}</Text>
        {detail ? <Text style={s.detail}>{detail}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    padding: 14, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.line,
  },
  rowDone: { backgroundColor: COLORS.done },
  box: {
    width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: COLORS.night,
    marginRight: 14, alignItems: 'center', justifyContent: 'center',
  },
  boxDone: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  tick: { color: COLORS.white, fontWeight: '800' },
  label: { fontSize: 16, color: COLORS.ink, fontWeight: '600' },
  labelDone: { color: COLORS.muted },
  detail: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
});
