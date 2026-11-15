import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Komponen: kartu doa (props: items = [{key, title, arab, arti}]).
// Sampai 3 doa: tab sama lebar. Lebih dari 3: tab bisa digeser.
export default function DoaCard({ items }) {
  const [activeKey, setActiveKey] = useState(items.length ? items[0].key : null);
  if (!items.length) return null;
  const doa = items.find((i) => i.key === activeKey) || items[0];
  const equal = items.length <= 3;

  const tab = (i, idx) => (
    <TouchableOpacity
      key={i.key}
      style={[
        s.tab,
        equal ? s.tabEqual : s.tabFixed,
        equal && idx < items.length - 1 && s.gap,
        doa.key === i.key && s.tabActive,
      ]}
      onPress={() => setActiveKey(i.key)}
    >
      <Text
        style={[s.tabText, doa.key === i.key && { color: COLORS.white }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {i.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={s.card}>
      {equal ? (
        <View style={s.tabs}>{items.map(tab)}</View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabs}>
          {items.map(tab)}
        </ScrollView>
      )}
      <Text style={s.arab}>{doa.arab}</Text>
      <Text style={s.arti}>{doa.arti}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.line, borderLeftWidth: 4, borderLeftColor: COLORS.gold,
  },
  tabs: { flexDirection: 'row', marginBottom: 14, flexGrow: 0 },
  tab: {
    paddingVertical: 8, paddingHorizontal: 4, borderRadius: 16, backgroundColor: COLORS.soft,
    alignItems: 'center', justifyContent: 'center',
  },
  tabEqual: { flex: 1 },
  tabFixed: { paddingHorizontal: 14, marginRight: 8 },
  gap: { marginRight: 6 },
  tabActive: { backgroundColor: COLORS.night },
  tabText: { fontSize: 11, fontWeight: '700', color: COLORS.night, textAlign: 'center' },
  arab: { fontSize: 24, lineHeight: 42, textAlign: 'right', color: COLORS.ink },
  arti: { fontSize: 13, color: COLORS.muted, marginTop: 10, lineHeight: 20 },
});
