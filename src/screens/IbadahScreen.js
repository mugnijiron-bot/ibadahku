import React, { useState } from 'react';
import {
  ScrollView, Text, TextInput, TouchableOpacity, Alert, View, StyleSheet,
} from 'react-native';
import { useRamadhanData } from '../context/RamadhanContext';
import useRamadhan from '../hooks/useRamadhan';
import DayForm from '../components/DayForm';
import SectionTitle from '../components/SectionTitle';
import { COLORS, formatLong } from '../utils/constants';

export default function IbadahScreen() {
  const { state, dispatch } = useRamadhanData();
  const r = useRamadhan(state);
  const [text, setText] = useState('');

  const addHabit = () => {
    const label = text.trim();
    if (!label) return;
    dispatch({ type: 'ADD_HABIT', label });
    setText('');
  };

  const confirmRemove = (h) =>
    Alert.alert('Hapus kebiasaan', `Hapus "${h.label}" dari daftar?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => dispatch({ type: 'REMOVE_HABIT', id: h.id }) },
    ]);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.date}>{formatLong(r.today)}</Text>

      <DayForm date={r.today} state={state} dispatch={dispatch} onRemoveHabit={confirmRemove} />

      <SectionTitle>Tambah kebiasaan</SectionTitle>
      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          placeholder="Contoh: Sholat tahajud"
          value={text}
          onChangeText={setText}
          onSubmitEditing={addHabit}
        />
        <TouchableOpacity style={s.btn} onPress={addHabit}>
          <Text style={s.btnText}>Tambah</Text>
        </TouchableOpacity>
      </View>
      {state.habits.length > 0 && <Text style={s.hint}>Tekan lama pada kebiasaan untuk menghapus</Text>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  date: { color: COLORS.muted, fontSize: 14 },
  inputRow: { flexDirection: 'row', marginBottom: 8 },
  input: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: COLORS.line, marginRight: 8,
  },
  btn: { backgroundColor: COLORS.night, borderRadius: 12, paddingHorizontal: 18, justifyContent: 'center' },
  btnText: { color: COLORS.white, fontWeight: '700' },
  hint: { color: COLORS.muted, fontSize: 12, marginBottom: 8 },
});
