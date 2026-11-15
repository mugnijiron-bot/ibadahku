import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, Alert, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import SectionTitle from '../components/SectionTitle';
import { cancelReminders } from '../utils/notify';
import { COLORS } from '../utils/constants';

export default function AkunScreen() {
  const { user, changePassword, logout } = useAuth();
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [busy, setBusy] = useState(false);

  const savePw = async () => {
    setBusy(true);
    const res = await changePassword(oldPw, newPw);
    setBusy(false);
    if (res.ok) {
      setOldPw('');
      setNewPw('');
      Alert.alert('Berhasil', 'Password sudah diganti.');
    } else {
      Alert.alert('Gagal', res.error);
    }
  };

  const confirmLogout = () =>
    Alert.alert('Keluar', 'Yakin ingin keluar dari akun ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await cancelReminders();
          logout();
        },
      },
    ]);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.card}>
        <Text style={s.avatar}>{user.role === 'admin' ? '🛡️' : '👤'}</Text>
        <Text style={s.name}>{user.name}</Text>
        <Text style={s.user}>{user.email}</Text>
        <Text style={[s.role, user.role === 'admin' && s.roleAdmin]}>
          {user.role === 'admin' ? 'Admin' : 'Pengguna'}
        </Text>
      </View>

      <SectionTitle>Ganti password</SectionTitle>
      <FormField label="Password lama" value={oldPw} onChangeText={setOldPw} secure />
      <FormField label="Password baru (minimal 6 karakter)" value={newPw} onChangeText={setNewPw} secure />
      <TouchableOpacity style={s.btn} onPress={savePw} disabled={busy}>
        <Text style={s.btnText}>Simpan password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.logout} onPress={confirmLogout}>
        <Text style={s.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  card: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.line,
  },
  avatar: { fontSize: 44 },
  name: { fontSize: 20, fontWeight: '800', color: COLORS.night, marginTop: 6 },
  user: { color: COLORS.muted, marginTop: 2 },
  role: {
    marginTop: 8, backgroundColor: COLORS.soft, color: COLORS.night, fontWeight: '700',
    paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10, overflow: 'hidden',
  },
  roleAdmin: { backgroundColor: COLORS.gold, color: COLORS.nightDark },
  btn: { backgroundColor: COLORS.night, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  btnText: { color: COLORS.white, fontWeight: '700' },
  logout: {
    marginTop: 24, borderRadius: 12, paddingVertical: 12, alignItems: 'center',
    backgroundColor: '#F4D6D6',
  },
  logoutText: { color: '#9B2C2C', fontWeight: '800' },
});
