import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { DEFAULT_CONTENT } from '../utils/constants';

const KEY = 'ramadhanku-auth-v2';
export const userDataKey = (id) => `ramadhanku-user-${id}-v1`;
export const ADMIN_EMAIL = 'admin@ramadhanku.com';

// Password tidak disimpan polos: disimpan sebagai hash SHA-256 dengan salt (id pengguna)
const hashPw = (salt, pw) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pw}`);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const Ctx = createContext(null);
const fail = (error) => ({ ok: false, error });
const WRONG = 'Email atau password salah.';

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [ready, setReady] = useState(false);

  // Muat akun & konten; buat akun admin awal bila belum ada
  useEffect(() => {
    (async () => {
      try {
        let data = null;
        try {
          const raw = await AsyncStorage.getItem(KEY);
          if (raw) data = JSON.parse(raw);
        } catch (e) {
          data = null;
        }
        let list = (data && data.users) || [];
        if (!list.some((u) => u.role === 'admin')) {
          list = [
            ...list,
            {
              id: 'u_admin', name: 'Administrator', email: ADMIN_EMAIL, role: 'admin',
              passHash: await hashPw('u_admin', 'admin123'),
            },
          ];
        }
        setUsers(list);
        setSession(data && data.session ? data.session : null);
        setContent({ ...DEFAULT_CONTENT, ...((data && data.content) || {}) });
      } catch (e) {
        console.warn('Gagal menyiapkan akun', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify({ users, session, content })).catch(() => {});
  }, [users, session, content, ready]);

  const user = useMemo(() => users.find((u) => u.id === session) || null, [users, session]);

  const register = useCallback(
    async ({ name, email, password }) => {
      const n = name.trim();
      const e = email.trim().toLowerCase();
      if (n.length < 2) return fail('Nama minimal 2 karakter.');
      if (!EMAIL_RE.test(e)) return fail('Format email tidak valid. Contoh: nama@email.com');
      if (password.length < 6) return fail('Password minimal 6 karakter.');
      if (users.some((x) => x.email === e)) return fail('Email sudah terdaftar.');
      const id = 'u' + Date.now();
      const passHash = await hashPw(id, password);
      setUsers((prev) => [...prev, { id, name: n, email: e, role: 'user', passHash }]);
      setSession(id);
      return { ok: true };
    },
    [users]
  );

  const login = useCallback(
    async (email, password) => {
      const found = users.find((x) => x.email === email.trim().toLowerCase());
      if (!found) return fail(WRONG);
      const h = await hashPw(found.id, password);
      if (h !== found.passHash) return fail(WRONG);
      setSession(found.id);
      return { ok: true };
    },
    [users]
  );

  const logout = useCallback(() => setSession(null), []);

  const changePassword = useCallback(
    async (oldPw, newPw) => {
      if (!user) return fail('Belum masuk.');
      if (newPw.length < 6) return fail('Password baru minimal 6 karakter.');
      if ((await hashPw(user.id, oldPw)) !== user.passHash) return fail('Password lama salah.');
      const nh = await hashPw(user.id, newPw);
      setUsers((prev) => prev.map((x) => (x.id === user.id ? { ...x, passHash: nh } : x)));
      return { ok: true };
    },
    [user]
  );

  const deleteUser = useCallback(async (id) => {
    setUsers((prev) => prev.filter((x) => x.id !== id || x.role === 'admin'));
    try {
      await AsyncStorage.removeItem(userDataKey(id));
    } catch (e) {}
  }, []);

  const updateContent = useCallback((patch) => setContent((c) => ({ ...c, ...patch })), []);

  const value = useMemo(
    () => ({
      ready, user, users, content,
      register, login, logout, changePassword, deleteUser, updateContent,
    }),
    [ready, user, users, content, register, login, logout, changePassword, deleteUser, updateContent]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
