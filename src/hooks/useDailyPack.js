import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { defaultDailyPack } from '../data/defaultDailyPack';
import { scheduleDailyPackNotifications } from '../services/notifications';

const STORAGE_KEY = 'dailyCompanion.currentDailyPack.v1';

function mergePack(input) {
  return {
    ...defaultDailyPack,
    ...input,
    notifications: {
      ...defaultDailyPack.notifications,
      ...(input.notifications || {}),
    },
    brief: {
      ...defaultDailyPack.brief,
      ...(input.brief || {}),
    },
    featured: {
      ...defaultDailyPack.featured,
      ...(input.featured || {}),
    },
    buildStatus: {
      ...defaultDailyPack.buildStatus,
      ...(input.buildStatus || {}),
    },
    plan: {
      ...defaultDailyPack.plan,
      ...(input.plan || {}),
    },
    memory: {
      ...defaultDailyPack.memory,
      ...(input.memory || {}),
    },
  };
}

export function useDailyPack() {
  const [pack, setPack] = useState(defaultDailyPack);
  const [status, setStatus] = useState('Ready');

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted || !raw) return;
        const parsed = JSON.parse(raw);
        setPack(mergePack(parsed));
      })
      .catch(() => setStatus('Using default daily pack'));
    return () => { mounted = false; };
  }, []);

  const actions = useMemo(() => ({
    async importFromJson(raw) {
      try {
        const parsed = JSON.parse(raw);
        const merged = mergePack(parsed);

        if (!merged.featured?.title || !merged.brief?.direction?.length) {
          throw new Error('Missing featured.title or brief.direction');
        }

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        setPack(merged);
        const notificationResult = await scheduleDailyPackNotifications(merged);
        setStatus(notificationResult.ok ? `Imported pack for ${merged.date || 'today'} · notifications scheduled` : `Imported pack for ${merged.date || 'today'} · notifications not scheduled`);
        return { ok: true, notifications: notificationResult };
      } catch (error) {
        const message = error?.message || 'Invalid JSON';
        setStatus(`Import failed: ${message}`);
        return { ok: false, error: message };
      }
    },

    async resetPack() {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setPack(defaultDailyPack);
      setStatus('Reset to default pack');
    },
  }), []);

  return { pack, status, ...actions };
}
