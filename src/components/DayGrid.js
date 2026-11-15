import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: kalender 30 hari (props: days, onPressDay). Ketuk hari untuk melihat/mengedit.
export default function DayGrid({ days, onPressDay }) {
  return (
    <View style={s.wrap}>
      {days.map((d) => (
        <TouchableOpacity
          key={d.n}
          style={s.cell}
          activeOpacity={0.7}
          onPress={() => onPressDay && onPressDay(d)}
        >
          <View
            style={[
              s.dot,
              d.isFuture && s.dotFuture,
              d.missed && s.dotMissed,
              d.fasted && s.dotDone,
              d.isToday && s.dotToday,
            ]}
          >
            <Text style={[s.num, d.fasted && { color: COLORS.white }]}>{d.n}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row', flexWrap: 'wrap', backgroundColor: COLORS.white, padding: 8,
    borderRadius: 16, borderWidth: 1, borderColor: COLORS.line,
  },
  cell: { width: '16.666%', alignItems: 'center', paddingVertical: 6 },
  dot: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.soft,
  },
  dotFuture: { backgroundColor: COLORS.bg },
  dotMissed: { backgroundColor: '#F4D6D6' },
  dotDone: { backgroundColor: COLORS.green },
  dotToday: { borderWidth: 2, borderColor: COLORS.gold },
  num: { fontSize: 14, fontWeight: '700', color: COLORS.night },
});
