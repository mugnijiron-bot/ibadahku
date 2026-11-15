import React, { useState } from 'react';
import {
  ScrollView, Text, TouchableOpacity, ActivityIndicator, View, StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import { COLORS } from '../utils/constants';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isLogin = mode === 'login';

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      const res = isLogin
        ? await login(email, password)
        : await register({ name, email, password });
      if (!res.ok) {
        setError(res.error);
        setBusy(false);
      }
    } catch (e) {
      setError('Terjadi kesalahan. Coba lagi.');
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.moon}>🌙</Text>
      <Text style={s.title}>RamadhanKu</Text>
      <Text style={s.sub}>Pengingat & manajemen ibadah kebiasaan Ramadhan</Text>

      <View style={s.card}>
        <View style={s.tabs}>
          <TouchableOpacity
            style={[s.tab, isLogin && s.tabActive]}
            onPress={() => { setMode('login'); setError(''); }}
          >
            <Text style={[s.tabText, isLogin && { color: COLORS.white }]}>Masuk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, !isLogin && s.tabActive]}
            onPress={() => { setMode('register'); setError(''); }}
          >
            <Text style={[s.tabText, !isLogin && { color: COLORS.white }]}>Daftar</Text>
          </TouchableOpacity>
        </View>

        {!isLogin && (
          <FormField label="Nama lengkap" value={name} onChangeText={setName} autoCapitalize="words" />
        )}
        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="nama@email.com"
        />
        <FormField label="Password" value={password} onChangeText={setPassword} secure />

        {error ? <Text style={s.error}>{error}</Text> : null}

        <TouchableOpacity style={s.btn} onPress={submit} disabled={busy}>
          {busy ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={s.btnText}>{isLogin ? 'Masuk' : 'Buat akun'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.night },
  content: { padding: 24, paddingTop: 70 },
  moon: { fontSize: 54, textAlign: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.white, textAlign: 'center' },
  sub: { color: '#C9CFEA', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  card: { backgroundColor: COLORS.bg, borderRadius: 20, padding: 18 },
  tabs: { flexDirection: 'row', marginBottom: 16, backgroundColor: COLORS.soft, borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.night },
  tabText: { fontWeight: '700', color: COLORS.night },
  error: { color: '#B3261E', marginBottom: 10, fontSize: 13 },
  btn: { backgroundColor: COLORS.gold, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: COLORS.nightDark, fontWeight: '800', fontSize: 16 },
});
