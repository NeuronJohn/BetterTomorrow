import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = 'daily_companion_devbuild_state_v1';

export async function loadStoredState(fallbackState) {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : fallbackState;
}

export async function saveStoredState(state) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
