import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { notificationBodyForDay } from './planner';

export const CHANNEL_ID = 'daily-companion';
export const CATEGORY_ID = 'dailycompanion';
export const ACTION_NOT_TODAY = 'not_today';
export const ACTION_DONE = 'mark_done';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export async function setupNotificationInfrastructure() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Daily Companion',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 120, 80, 120],
      lightColor: '#67D4C2',
      sound: null
    });
  }

  await Notifications.setNotificationCategoryAsync(CATEGORY_ID, [
    {
      identifier: ACTION_DONE,
      buttonTitle: 'Done',
      options: { opensAppToForeground: false }
    },
    {
      identifier: ACTION_NOT_TODAY,
      buttonTitle: 'Not today',
      options: { opensAppToForeground: false, isDestructive: false }
    }
  ]);
}

export async function requestNotificationPermission() {
  await setupNotificationInfrastructure();
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

export async function cancelAllCompanionNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleCompanionLoop(settings, day) {
  await setupNotificationInfrastructure();
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!settings.notificationLoopEnabled) return false;

  const permission = await Notifications.getPermissionsAsync();
  if (permission.status !== 'granted') return false;

  if (settings.morningEnabled) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: day.greeting || 'Good morning. Small plan, real direction.',
        body: notificationBodyForDay(day),
        data: { kind: 'morning', dateKey: day.date },
        categoryIdentifier: CATEGORY_ID
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: settings.morningHour,
        minute: settings.morningMinute,
        channelId: CHANNEL_ID
      }
    });
  }

  if (settings.eveningEnabled) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Leave one sentence for tomorrow',
        body: 'What worked, what sucked, or what should I avoid? One sentence is enough.',
        data: { kind: 'evening', dateKey: day.date },
        categoryIdentifier: CATEGORY_ID
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: settings.eveningHour,
        minute: settings.eveningMinute,
        channelId: CHANNEL_ID
      }
    });
  }

  return true;
}

export async function scheduleTestNotification(day) {
  const granted = await requestNotificationPermission();
  if (!granted) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily Companion test',
      body: notificationBodyForDay(day),
      data: { kind: 'test', dateKey: day.date },
      categoryIdentifier: CATEGORY_ID
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
      channelId: CHANNEL_ID
    }
  });

  return true;
}
