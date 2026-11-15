import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, userDataKey } from '../context/AuthContext';
import { summarizeUser } from '../utils/summary';
import StatCard from '../components/StatCard';
import UserCard from '../components/UserCard';
import SectionTitle from '../components/SectionTitle';
import { COLORS, formatDateTime, formatLong } from '../utils/constants';

export default function AdminDashboardScreen({ navigation }) {
  const { users, content, deleteUser } = useAuth();
  const [rows, setRows] = useState([]);

  // Muat ringkasan tiap pengguna setiap layar ini dibuka
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const list = users.filter((u) => u.role === 'user');
        let pairs = [];
        try {
          pairs = await AsyncStorage.multiGet(list.map((u) => userDataKey(u.id)));
        } catch (e) {
          pairs = [];
        }
        const out = list.map((u, i) => {
          let data = null;
          try {
            data = pairs[i] && pairs[i][1] ? JSON.parse(pairs[i][1]) : null;
          } catch (e) {
            data = null;
          }
          return { user: u, ...summarizeUser(data, content.startDate) };
        });
        if (active) setRows(out);
      })();
      return () => {
        active = false;
      };
    }, [users, content.startDate])
  );

  const totalFast = rows.reduce((sum, r) => sum + r.fastDays, 0);
  const totalPages = rows.reduce((sum, r) => sum + r.pages, 0);

  const confirmDelete = (u) =>
    Alert.alert('Hapus pengguna', `Hapus akun "${u.name}" beserta seluruh datanya?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => deleteUser(u.id) },
    ]);

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={s.info}>Tanggal 1 Ramadhan: {formatLong(content.startDate)}</Text>

      <View style={s.row}>
        <StatCard value={`${rows.length}`} label="Pengguna" />
        <StatCard value={`${totalFast}`} label="Total hari puasa" />
        <StatCard value={`${totalPages}`} label="Total halaman" />
      </View>

      <SectionTitle>Daftar pengguna</SectionTitle>
      {rows.length === 0 && <Text style={s.empty}>Belum ada pengguna terdaftar.</Text>}
      {rows.map((r) => (
        <UserCard
          key={r.user.id}
          name={r.user.name}
          email={r.user.email}
          lastActive={formatDateTime(r.lastActive)}
          onPress={() => navigation.navigate('UserDetail', { userId: r.user.id })}
          fastDays={r.fastDays}
          tarawih={r.tarawih}
          pages={r.pages}
          onDelete={() => confirmDelete(r.user)}
        />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  info: { color: COLORS.muted, fontSize: 13, marginBottom: 12 },
  row: { flexDirection: 'row', marginHorizontal: -4 },
  empty: { color: COLORS.muted, fontSize: 14 },
});
