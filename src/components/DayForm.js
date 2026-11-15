import React from 'react';
import { View } from 'react-native';
import CheckItem from './CheckItem';
import Stepper from './Stepper';
import SectionTitle from './SectionTitle';
import { GROUPS, DAILY_TARGET } from '../utils/constants';

// Komponen: formulir ibadah satu hari. Dipakai untuk hari ini (tab Ibadah)
// maupun hari lain (layar Detail). Semua data masuk lewat props.
export default function DayForm({ date, state, dispatch, onRemoveHabit }) {
  const day = state.log[date] || { done: {}, pages: 0 };
  const toggle = (id) => dispatch({ type: 'TOGGLE', date, id });

  return (
    <View>
      {GROUPS.map((g) => (
        <View key={g.title}>
          <SectionTitle>{g.title}</SectionTitle>
          {g.items.map((i) => (
            <CheckItem
              key={i.id}
              label={i.label}
              detail={i.detail}
              checked={!!day.done[i.id]}
              onToggle={() => toggle(i.id)}
            />
          ))}
          {g.title === 'Puasa' && (
            <CheckItem
              label="Tidak berpuasa (qadha)"
              detail="Dicatat sebagai utang puasa yang harus diganti"
              checked={!!day.done.qadha}
              onToggle={() => toggle('qadha')}
            />
          )}
        </View>
      ))}

      <SectionTitle>Al-Qur'an</SectionTitle>
      <Stepper
        value={day.pages}
        target={DAILY_TARGET}
        onChange={(v) => dispatch({ type: 'SET_PAGES', date, pages: v })}
      />

      {state.habits.length > 0 && <SectionTitle>Kebiasaan tambahan</SectionTitle>}
      {state.habits.map((h) => (
        <CheckItem
          key={h.id}
          label={h.label}
          checked={!!day.done[h.id]}
          onToggle={() => toggle(h.id)}
          onLongPress={onRemoveHabit ? () => onRemoveHabit(h) : undefined}
        />
      ))}
    </View>
  );
}
