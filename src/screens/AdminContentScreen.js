import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, Alert, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import RemovableRow from '../components/RemovableRow';
import SectionTitle from '../components/SectionTitle';
import { COLORS, addDays, formatLong } from '../utils/constants';

export default function AdminContentScreen() {
  const { content, updateContent } = useAuth();
  const [announce, setAnnounce] = useState(content.announcement);
  const [motivasiText, setMotivasiText] = useState('');
  const [dTitle, setDTitle] = useState('');
  const [dArab, setDArab] = useState('');
  const [dArti, setDArti] = useState('');

  const saveAnnounce = () => {
    updateContent({ announcement: announce.trim() });
    Alert.alert('Tersimpan', 'Pengumuman akan tampil di Beranda semua pengguna.');
  };

  const addMotivasi = () => {
    const t = motivasiText.trim();
    if (!t) return;
    updateContent({ motivasi: [...content.motivasi, t] });
    setMotivasiText('');
  };

  const removeMotivasi = (idx) => {
    if (content.motivasi.length <= 1) {
      Alert.alert('Tidak bisa dihapus', 'Minimal harus ada satu kalimat semangat.');
      return;
    }
    updateContent({ motivasi: content.motivasi.filter((_, i) => i !== idx) });
  };

  const addDoa = () => {
    if (!dTitle.trim() || !dArab.trim() || !dArti.trim()) {
      Alert.alert('Belum lengkap', 'Judul, teks Arab, dan arti harus diisi.');
      return;
    }
    updateContent({
      doa: [...content.doa, { key: 'd' + Date.now(), title: dTitle.trim(), arab: dArab.trim(), arti: dArti.trim() }],
    });
    setDTitle('');
    setDArab('');
    setDArti('');
  };

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <SectionTitle>Tanggal 1 Ramadhan (berlaku untuk semua pengguna)</SectionTitle>
      <View style={s.card}>
        <Text style={s.big}>{formatLong(content.startDate)}</Text>
        <Text style={s.hint}>Sesuaikan dengan keputusan pemerintah (sidang isbat).</Text>
        <View style={s.btnRow}>
          <TouchableOpacity
            style={s.btn}
            onPress={() => updateContent({ startDate: addDays(content.startDate, -1) })}
          >
            <Text style={s.btnText}>- 1 hari</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, { marginRight: 0 }]}
            onPress={() => updateContent({ startDate: addDays(content.startDate, 1) })}
          >
            <Text style={s.btnText}>+ 1 hari</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SectionTitle>Pengumuman</SectionTitle>
      <FormField
        value={announce}
        onChangeText={setAnnounce}
        placeholder="Tulis pengumuman untuk semua pengguna"
        multiline
        autoCapitalize="sentences"
      />
      <View style={s.btnRow}>
        <TouchableOpacity style={[s.btn, s.dark]} onPress={saveAnnounce}>
          <Text style={[s.btnText, { color: COLORS.white }]}>Simpan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.btn, { marginRight: 0 }]}
          onPress={() => {
            setAnnounce('');
            updateContent({ announcement: '' });
          }}
        >
          <Text style={s.btnText}>Hapus</Text>
        </TouchableOpacity>
      </View>

      <SectionTitle>Kalimat semangat ({content.motivasi.length})</SectionTitle>
      {content.motivasi.map((m, idx) => (
        <RemovableRow key={idx + m} text={m} onRemove={() => removeMotivasi(idx)} />
      ))}
      <FormField
        value={motivasiText}
        onChangeText={setMotivasiText}
        placeholder="Tambah kalimat semangat baru"
        autoCapitalize="sentences"
      />
      <TouchableOpacity style={[s.btn, s.dark, { marginRight: 0 }]} onPress={addMotivasi}>
        <Text style={[s.btnText, { color: COLORS.white }]}>Tambah kalimat</Text>
      </TouchableOpacity>

      <SectionTitle>Doa harian ({content.doa.length})</SectionTitle>
      {content.doa.map((d) => (
        <RemovableRow
          key={d.key}
          text={d.title}
          onRemove={() => updateContent({ doa: content.doa.filter((x) => x.key !== d.key) })}
        />
      ))}
      <FormField label="Judul doa" value={dTitle} onChangeText={setDTitle} autoCapitalize="sentences" />
      <FormField label="Teks Arab" value={dArab} onChangeText={setDArab} multiline align="right" />
      <FormField label="Arti" value={dArti} onChangeText={setDArti} multiline autoCapitalize="sentences" />
      <TouchableOpacity style={[s.btn, s.dark, { marginRight: 0 }]} onPress={addDoa}>
        <Text style={[s.btnText, { color: COLORS.white }]}>Tambah doa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  card: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: COLORS.line,
  },
  big: { fontSize: 18, fontWeight: '800', color: COLORS.night },
  hint: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  btnRow: { flexDirection: 'row', marginTop: 8 },
  btn: {
    flex: 1, backgroundColor: COLORS.soft, borderRadius: 10, paddingVertical: 11,
    alignItems: 'center', marginRight: 8,
  },
  dark: { backgroundColor: COLORS.night },
  btnText: { color: COLORS.night, fontWeight: '700' },
});
