import { Platform } from 'react-native';

// Dimuat dengan aman: jika modul tidak ada, aplikasi tetap berjalan.
let Notifications = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  Notifications = null;
}

// Jadwalkan ulang semua pengingat yang aktif (berulang setiap hari)
export async function syncReminders(reminders) {
  if (!Notifications) return { ok: false, reason: 'Modul notifikasi belum terpasang.' };
  try {
    const perm = await Notifications.requestPermissionsAsync();
    if (perm.status !== 'granted') {
      return { ok: false, reason: 'Izin notifikasi ditolak. Aktifkan lewat Pengaturan HP.' };
    }

    // Channel dibuat terpisah: jika gagal (misalnya di Expo Go), pakai channel bawaan Android
    let channelOk = false;
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('ramadhan', {
          name: 'Pengingat Ramadhan',
          importance: Notifications.AndroidImportance.HIGH,
        });
        channelOk = true;
      } catch (e) {
        channelOk = false;
      }
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
    const active = reminders.filter((r) => r.enabled);
    for (const r of active) {
      const [hour, minute] = r.time.split(':').map(Number);
      const trigger = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      };
      if (channelOk) trigger.channelId = 'ramadhan';
      await Notifications.scheduleNotificationAsync({
        content: { title: r.label, body: r.message, sound: true },
        trigger,
      });
    }
    return { ok: true, count: active.length };
  } catch (e) {
    return {
      ok: false,
      reason:
        'Notifikasi tidak dapat dijadwalkan di Expo Go pada perangkat ini. ' +
        'Fitur ini berjalan penuh pada development build / APK. Detail: ' +
        String(e.message || e),
    };
  }
}

// Batalkan semua pengingat (dipakai saat logout agar tidak bocor ke akun lain)
export async function cancelReminders() {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {}
}
