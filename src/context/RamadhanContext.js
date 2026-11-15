import React, {
  createContext, useContext, useEffect, useMemo, useReducer, useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_REMINDERS } from '../utils/constants';
import { useAuth, userDataKey } from './AuthContext';

const Ctx = createContext(null);

const initialState = {
  city: 'Sukabumi',
  habits: [], // kebiasaan tambahan buatan pengguna
  reminders: DEFAULT_REMINDERS,
  qadhaPaid: 0, // jumlah puasa qadha yang sudah diganti
  log: {}, // log[tanggal] = { done: { id: true }, pages: 0 }
};

const emptyDay = { done: {}, pages: 0 };

function innerReducer(state, a) {
  switch (a.type) {
    case 'LOAD':
      return { ...initialState, ...a.payload };
    case 'TOGGLE': {
      const day = state.log[a.date] || emptyDay;
      const turningOn = !day.done[a.id];
      const done = { ...day.done, [a.id]: turningOn };
      // puasa dan qadha (tidak berpuasa) tidak boleh aktif bersamaan
      if (turningOn && a.id === 'puasa') done.qadha = false;
      if (turningOn && a.id === 'qadha') done.puasa = false;
      return { ...state, log: { ...state.log, [a.date]: { ...day, done } } };
    }
    case 'SET_PAGES': {
      const day = state.log[a.date] || emptyDay;
      return {
        ...state,
        log: { ...state.log, [a.date]: { ...day, pages: Math.max(0, a.pages) } },
      };
    }
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, { id: 'c' + Date.now(), label: a.label }] };
    case 'REMOVE_HABIT':
      return { ...state, habits: state.habits.filter((h) => h.id !== a.id) };
    case 'SET_CITY':
      return { ...state, city: a.city };
    case 'ADJUST_QADHA':
      return { ...state, qadhaPaid: Math.max(0, state.qadhaPaid + a.delta) };
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map((r) => (r.id === a.id ? { ...r, ...a.patch } : r)),
      };
    default:
      return state;
  }
}

// Data ibadah disimpan terpisah untuk setiap pengguna (kunci berdasarkan userId).
// Tanggal 1 Ramadhan dan daftar motivasi berasal dari konten yang diatur admin.
// Setiap aksi pengguna mencatat waktu aktivitas terakhir (dilihat admin)
function reducer(state, a) {
  const next = innerReducer(state, a);
  return a.type === 'LOAD' ? next : { ...next, lastActive: Date.now() };
}

export function RamadhanProvider({ userId, children }) {
  const { content } = useAuth();
  const [data, dispatch] = useReducer(reducer, initialState);
  const [ready, setReady] = useState(false);
  const key = userDataKey(userId);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(key);
        if (saved) dispatch({ type: 'LOAD', payload: JSON.parse(saved) });
      } catch (e) {
        console.warn('Data tersimpan tidak bisa dibaca, memakai data awal', e);
      } finally {
        setReady(true);
      }
    })();
  }, [key]);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(key, JSON.stringify(data)).catch(() => {});
  }, [data, ready, key]);

  const state = useMemo(
    () => ({ ...data, startDate: content.startDate, motivasi: content.motivasi }),
    [data, content.startDate, content.motivasi]
  );

  return <Ctx.Provider value={{ state, dispatch, ready }}>{children}</Ctx.Provider>;
}

export const useRamadhanData = () => useContext(Ctx);
