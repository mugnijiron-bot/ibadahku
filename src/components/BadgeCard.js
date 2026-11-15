import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: lencana pencapaian (props: title, desc, earned)
export default function BadgeCard({ title, desc, earned }) {
  return (
    <View style={[s.card, earned && s.earned]}>
      <Text style={s.icon}>{earned ? '🏅' : '🔒'}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[s.title, !earned && { color: COLORS.muted }]}>{title}</Text>
        <Text style={s.desc}>{desc}</Text>
      </View>
      {earned && <Text style={s.ok}>Tercapai</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 12,
    borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.line,
  },
  earned: { backgroundColor: '#FBF3DD', borderColor: COLORS.gold },
  icon: { fontSize: 24, marginRight: 12 },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.ink },
  desc: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  ok: { fontSize: 12, fontWeight: '700', color: COLORS.green },
});
