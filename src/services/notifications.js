import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const STORAGE_KEY = 'dailyCompanion.notificationIds.v1';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function parseTime(value, fallbackHour, fallbackMinute) {
  const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return { hour: fallbackHour, minute: fallbackMinute };
  const hour = Math.max(0, Math.min(23, Number(match[1])));
  const minute = Math.max(0, Math.min(59, Number(match[2])));
  return { hour, minute };
}

async function clearOldNotifications() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  } catch {
    // Keep UI safe even if notification cleanup fails.
  }
}

export async function scheduleDailyPackNotifications(pack) {
  try {
    const existing = await Notifications.getPermissionsAsync();
    const finalStatus = existing.status === 'granted'
      ? existing.status
      : (await Notifications.requestPermissionsAsync()).status;

    if (finalStatus !== 'granted') {
      return { ok: false, reason: 'Notification permission not granted' };
    }

    await clearOldNotifications();

    const ids = [];
    const morning = pack?.notifications?.morning;
    const evening = pack?.notifications?.evening;

    if (morning?.enabled !== false) {
      const { hour, minute } = parseTime(morning?.time, 8, 15);
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: morning?.title || 'Daily Companion',
          body: morning?.body || 'Your brief is ready.',
          data: { screen: 'Brief', kind: 'morning' },
        },
        trigger: { hour, minute, repeats: true },
      });
      ids.push(id);
    }

    if (evening?.enabled !== false) {
      const { hour, minute } = parseTime(evening?.time, 20, 45);
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: evening?.title || 'Quick check-in',
          body: evening?.body || 'Drop one sentence so tomorrow can adjust.',
          data: { screen: 'Brief', kind: 'evening' },
        },
        trigger: { hour, minute, repeats: true },
      });
      ids.push(id);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    return { ok: true, count: ids.length };
  } catch (error) {
    return { ok: false, reason: error?.message || 'Notification scheduling failed' };
  }
}
