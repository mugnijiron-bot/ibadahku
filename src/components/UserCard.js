import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: kartu pengguna di dasbor admin.
// Props: name, email, fastDays, tarawih, pages, lastActive, onPress, onDelete
export default function UserCard({
  name, email, fastDays, tarawih, pages, lastActive, onPress, onDelete,
}) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.8}>
      <View style={s.top}>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{name}</Text>
          <Text style={s.user}>{email}</Text>
        </View>
        {onDelete && (
          <TouchableOpacity style={s.del} onPress={onDelete}>
            <Text style={s.delText}>Hapus</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={s.stats}>
        <Text style={s.stat}>Puasa {fastDays}/30</Text>
        <Text style={s.stat}>Tarawih {tarawih}</Text>
        <Text style={s.stat}>{pages} hlm</Text>
      </View>
      <Text style={s.active}>Aktif terakhir: {lastActive}</Text>
      <Text style={s.more}>Ketuk untuk melihat detail ›</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.line,
  },
  top: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.ink },
  user: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  del: { backgroundColor: '#F4D6D6', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12 },
  delText: { color: '#9B2C2C', fontWeight: '700', fontSize: 13 },
  stats: { flexDirection: 'row', marginTop: 10 },
  stat: {
    fontSize: 12, color: COLORS.night, backgroundColor: COLORS.soft, borderRadius: 8,
    paddingVertical: 4, paddingHorizontal: 8, marginRight: 8, fontWeight: '600',
  },
  active: { fontSize: 12, color: COLORS.muted, marginTop: 10 },
  more: { fontSize: 12, color: COLORS.night, fontWeight: '700', marginTop: 4 },
});
