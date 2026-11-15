import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: satu pengingat (props: label, message, time, note, enabled, onToggle, onShift)
export default function ReminderItem({ label, message, time, note, enabled, onToggle, onShift }) {
  return (
    <View style={s.card}>
      <View style={s.top}>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>{label}</Text>
          <Text style={s.msg}>{message}</Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ true: COLORS.gold, false: COLORS.line }}
          thumbColor={COLORS.white}
        />
      </View>
      <View style={s.timeRow}>
        <TouchableOpacity style={s.btn} onPress={() => onShift(-5)}>
          <Text style={s.btnText}>-5 mnt</Text>
        </TouchableOpacity>
        <Text style={s.time}>{time}</Text>
        <TouchableOpacity style={s.btn} onPress={() => onShift(5)}>
          <Text style={s.btnText}>+5 mnt</Text>
        </TouchableOpacity>
      </View>
      <Text style={s.note}>{note}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.line,
  },
  top: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '700', color: COLORS.ink },
  msg: { fontSize: 12, color: COLORS.muted, marginTop: 2, paddingRight: 8 },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  time: { fontSize: 26, fontWeight: '800', color: COLORS.night, marginHorizontal: 20 },
  btn: { backgroundColor: COLORS.soft, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12 },
  btnText: { color: COLORS.night, fontWeight: '700', fontSize: 13 },
  note: { textAlign: 'center', fontSize: 12, color: COLORS.muted, marginTop: 6 },
});
