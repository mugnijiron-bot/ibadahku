import React, { useEffect } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useRamadhanData } from '../context/RamadhanContext';
import DayForm from '../components/DayForm';
import { COLORS, diffDays, formatLong } from '../utils/constants';

// Layar detail (Stack): data tanggal dikirim lewat route.params
export default function DayDetailScreen({ route, navigation }) {
  const { date } = route.params;
  const { state, dispatch } = useRamadhanData();
  const n = diffDays(date, state.startDate) + 1;

  useEffect(() => {
    navigation.setOptions({ title: `Ramadhan hari ke-${n}` });
  }, [navigation, n]);

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={s.date}>{formatLong(date)}</Text>
      <DayForm date={date} state={state} dispatch={dispatch} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  date: { color: COLORS.muted, fontSize: 14 },
});
