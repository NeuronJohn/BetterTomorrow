import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import * as Notifications from 'expo-notifications';

import { palette } from './styles/palette';
import { localDateKey, prettyDate } from './services/date';
import {
  ACTION_DONE,
  ACTION_NOT_TODAY,
  cancelAllCompanionNotifications,
  requestNotificationPermission,
  scheduleCompanionLoop,
  scheduleTestNotification
} from './services/notifications';
import { loadStoredState, saveStoredState } from './services/storage';
import {
  addLog,
  defaultSettings,
  emptyState,
  generateDay,
  makeId
} from './services/planner';

export default function DailyCompanionApp() {
  const [appState, setAppState] = useState(emptyState);
  const [loaded, setLoaded] = useState(false);
  const [ignoreModal, setIgnoreModal] = useState({ visible: false, item: null });
  const [ignoreReason, setIgnoreReason] = useState('');
  const scheduleTimer = useRef(null);

  const dateKey = localDateKey();
  const today = appState.days?.[dateKey];

  useEffect(() => {
    loadState();

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationResponse(response);
    });

    return () => {
      responseSub.remove();
      if (scheduleTimer.current) clearTimeout(scheduleTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveStoredState(appState).catch(() => {});
  }, [appState, loaded]);

  useEffect(() => {
    if (!loaded || !today || !appState.settings.notificationLoopEnabled) return;
    if (scheduleTimer.current) clearTimeout(scheduleTimer.current);
    scheduleTimer.current = setTimeout(() => {
      scheduleCompanionLoop(appState.settings, today).catch(() => {});
    }, 900);
  }, [
    loaded,
    today?.notes,
    today?.reflection,
    today?.tasks,
    appState.settings.notificationLoopEnabled,
    appState.settings.morningEnabled,
    appState.settings.eveningEnabled
  ]);

  async function loadState() {
    try {
      const saved = await loadStoredState(emptyState);
      const merged = {
        ...emptyState,
        ...saved,
        settings: { ...defaultSettings, ...(saved.settings || {}) },
        preferences: { notInterested: [], ...(saved.preferences || {}) },
        days: saved.days || {},
        notificationLog: saved.notificationLog || []
      };

      if (!merged.days[dateKey]) {
        merged.days[dateKey] = generateDay(merged, dateKey);
      }

      setAppState(merged);
      setLoaded(true);
    } catch {
      const fresh = { ...emptyState, days: { [dateKey]: generateDay(emptyState, dateKey) } };
      setAppState(fresh);
      setLoaded(true);
    }
  }

  function updateToday(patch) {
    setAppState((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [dateKey]: {
          ...prev.days[dateKey],
          ...patch
        }
      }
    }));
  }

  function toggleTask(taskId) {
    updateToday({
      tasks: today.tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    });
  }

  function handleNotificationResponse(response) {
    const action = response.actionIdentifier;
    const data = response.notification?.request?.content?.data || {};
    const targetDate = data.dateKey || localDateKey();

    setAppState((prev) => {
      const day = prev.days[targetDate] || generateDay(prev, targetDate);
      let nextDay = day;
      let logTitle = 'Notification opened';
      let logBody = response.notification?.request?.content?.body || '';

      if (action === ACTION_NOT_TODAY) {
        nextDay = { ...day, skipped: true };
        logTitle = 'Marked not today';
        logBody = 'Plan skipped from notification.';
      }

      if (action === ACTION_DONE) {
        const nextTasks = (day.tasks || []).map((task, index) =>
          index === 0 ? { ...task, done: true } : task
        );
        nextDay = { ...day, tasks: nextTasks };
        logTitle = 'Marked first task done';
        logBody = 'First task checked from notification.';
      }

      return {
        ...prev,
        notificationLog: addLog(prev, logTitle, logBody),
        days: {
          ...prev.days,
          [targetDate]: nextDay
        }
      };
    });
  }

  async function startNotificationLoop() {
    const granted = await requestNotificationPermission();

    if (!granted) {
      Alert.alert('Notification permission needed', 'Android has to allow notifications before this can contact you automatically.');
      return;
    }

    const nextState = {
      ...appState,
      settings: {
        ...appState.settings,
        notificationLoopEnabled: true,
        morningEnabled: true
      },
      notificationLog: addLog(appState, 'Notification loop started', 'Morning brief and evening reflection are scheduled.')
    };

    setAppState(nextState);
    const ok = await scheduleCompanionLoop(nextState.settings, today);

    Alert.alert(
      ok ? 'Notification loop is on' : 'Could not schedule',
      ok ? 'I will send a small morning plan and a gentle evening note prompt.' : 'Check notification permission/settings.'
    );
  }

  async function stopNotificationLoop() {
    await cancelAllCompanionNotifications();
    setAppState((prev) => ({
      ...prev,
      settings: { ...prev.settings, notificationLoopEnabled: false },
      notificationLog: addLog(prev, 'Notification loop paused', 'No daily companion notifications are scheduled.')
    }));
  }

  async function sendTest() {
    const ok = await scheduleTestNotification(today);
    Alert.alert(ok ? 'Test scheduled' : 'Permission needed', ok ? 'You should get a notification in about 3 seconds.' : 'Allow notifications first.');
  }

  function refreshPlan() {
    Alert.alert('Refresh today?', 'This rebuilds today from your last notes/preferences.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Refresh',
        onPress: () =>
          setAppState((prev) => ({
            ...prev,
            days: { ...prev.days, [dateKey]: generateDay(prev, dateKey) }
          }))
      }
    ]);
  }

  function saveIgnore() {
    const task = ignoreModal.item;
    if (!task) return;

    setAppState((prev) => {
      const currentDay = prev.days[dateKey];
      const note = {
        id: makeId('ignore'),
        topic: task.topic,
        title: task.title,
        reason: ignoreReason.trim(),
        createdAt: new Date().toISOString()
      };

      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          notInterested: [note, ...(prev.preferences.notInterested || [])].slice(0, 40)
        },
        days: {
          ...prev.days,
          [dateKey]: {
            ...currentDay,
            tasks: currentDay.tasks.filter((item) => item.id !== task.id)
          }
        },
        notificationLog: addLog(prev, 'Preference remembered', `${task.title}${note.reason ? ` — ${note.reason}` : ''}`)
      };
    });

    setIgnoreModal({ visible: false, item: null });
  }

  const completeCount = today?.tasks?.filter((task) => task.done).length || 0;
  const totalCount = today?.tasks?.length || 0;
  const percent = totalCount ? Math.round((completeCount / totalCount) * 100) : 0;

  const groupedTasks = useMemo(() => {
    const groups = {};
    for (const task of today?.tasks || []) {
      groups[task.section] ||= [];
      groups[task.section].push(task);
    }
    return groups;
  }, [today?.tasks]);

  if (!loaded || !today) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading Daily Companion...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Notification-first companion</Text>
            <Text style={styles.title}>Today</Text>
            <Text style={styles.date}>{prettyDate(dateKey)}</Text>
          </View>
          <View style={styles.progressPill}>
            <Text style={styles.progressText}>{percent}%</Text>
            <Text style={styles.progressSub}>{completeCount}/{totalCount}</Text>
          </View>
        </View>

        <View style={styles.loopCard}>
          <View style={styles.loopText}>
            <Text style={styles.loopTitle}>
              {appState.settings.notificationLoopEnabled ? 'Notification loop is on' : 'Notification loop is off'}
            </Text>
            <Text style={styles.loopBody}>
              {appState.settings.notificationLoopEnabled
                ? 'Morning plan + gentle evening note prompt. It updates from your notes when you use the app.'
                : 'Turn this on once so the app contacts you automatically instead of you remembering it.'}
            </Text>
          </View>
          <Pressable
            style={[styles.primaryButton, appState.settings.notificationLoopEnabled && styles.pauseButton]}
            onPress={appState.settings.notificationLoopEnabled ? stopNotificationLoop : startNotificationLoop}
          >
            <Text style={styles.primaryButtonText}>
              {appState.settings.notificationLoopEnabled ? 'Pause' : 'Start'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.cardHero}>
          <Text style={styles.heroTitle}>{today.greeting}</Text>
          <Text style={styles.heroBody}>{today.brief}</Text>
        </View>

        <View style={styles.controlsRow}>
          <Pressable style={styles.smallButton} onPress={sendTest}>
            <Text style={styles.smallButtonText}>Test notification</Text>
          </Pressable>
          <Pressable style={styles.smallButton} onPress={refreshPlan}>
            <Text style={styles.smallButtonText}>Refresh plan</Text>
          </Pressable>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingsText}>
            <Text style={styles.sectionTitle}>Morning + evening only</Text>
            <Text style={styles.helper}>No spam. Morning gives the plan. Evening asks for one sentence so tomorrow is better.</Text>
          </View>
          <View style={styles.switchColumn}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>AM</Text>
              <Switch
                value={appState.settings.morningEnabled}
                onValueChange={(morningEnabled) =>
                  setAppState((prev) => ({ ...prev, settings: { ...prev.settings, morningEnabled } }))
                }
                trackColor={{ false: '#253244', true: '#2b9ea0' }}
                thumbColor={appState.settings.morningEnabled ? '#67d4c2' : '#9aa7b7'}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>PM</Text>
              <Switch
                value={appState.settings.eveningEnabled}
                onValueChange={(eveningEnabled) =>
                  setAppState((prev) => ({ ...prev, settings: { ...prev.settings, eveningEnabled } }))
                }
                trackColor={{ false: '#253244', true: '#2b9ea0' }}
                thumbColor={appState.settings.eveningEnabled ? '#67d4c2' : '#9aa7b7'}
              />
            </View>
          </View>
        </View>

        {Object.entries(groupedTasks).map(([section, tasks]) => (
          <View style={styles.sectionCard} key={section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>{section}</Text>
              <Text style={styles.sectionCount}>{tasks.filter((task) => task.done).length}/{tasks.length}</Text>
            </View>

            {tasks.map((task) => (
              <View style={styles.taskCard} key={task.id}>
                <Pressable style={styles.taskMain} onPress={() => toggleTask(task.id)}>
                  <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
                    {task.done ? <Text style={styles.checkMark}>✓</Text> : null}
                  </View>
                  <View style={styles.taskText}>
                    <Text style={[styles.taskTitle, task.done && styles.taskDone]}>{task.title}</Text>
                    <Text style={styles.taskDetail}>{task.detail}</Text>
                    {task.finishLine ? <Text style={styles.finishLine}>Finish line: {task.finishLine}</Text> : null}
                    <Text style={styles.why}>Why: {task.reason}</Text>
                  </View>
                </Pressable>

                <Pressable style={styles.notInterested} onPress={() => setIgnoreModal({ visible: true, item: task })}>
                  <Text style={styles.notInterestedText}>Not for me</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.noteCard}>
          <Text style={styles.sectionTitle}>Notes for tomorrow</Text>
          <Text style={styles.helper}>This is the fuel. One sentence is enough.</Text>
          <TextInput
            multiline
            value={today.notes}
            onChangeText={(notes) => updateToday({ notes })}
            placeholder="Example: UI tasks are good. Outreach felt annoying. Tomorrow give me a tiny GitHub/data task."
            placeholderTextColor="#6f7f95"
            style={styles.input}
          />
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.sectionTitle}>End-of-day reflection</Text>
          <TextInput
            multiline
            value={today.reflection}
            onChangeText={(reflection) => updateToday({ reflection })}
            placeholder="What made tomorrow easier?"
            placeholderTextColor="#6f7f95"
            style={styles.inputSmall}
          />
        </View>

        <View style={styles.logCard}>
          <Text style={styles.sectionTitle}>Notification log</Text>
          {appState.notificationLog.slice(0, 5).map((item) => (
            <Text style={styles.logItem} key={item.id}>{item.title}: {item.body}</Text>
          ))}
          {!appState.notificationLog.length ? (
            <Text style={styles.helper}>No notifications handled yet. Start the loop and send a test.</Text>
          ) : null}
        </View>
      </ScrollView>

      <Modal visible={ignoreModal.visible} transparent animationType="fade">
        <View style={styles.modalShade}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Not interested?</Text>
            <Text style={styles.modalBody}>I will remove this and remember the reason so future plans are less annoying.</Text>
            <Text style={styles.modalTopic}>{ignoreModal.item?.title}</Text>

            <View style={styles.reasonRow}>
              {['Too much', 'Not useful', 'Wrong direction', 'Already done'].map((reason) => (
                <Pressable key={reason} style={styles.reasonChip} onPress={() => setIgnoreReason(reason)}>
                  <Text style={styles.reasonText}>{reason}</Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              value={ignoreReason}
              onChangeText={setIgnoreReason}
              placeholder="Optional reason"
              placeholderTextColor="#6f7f95"
              style={styles.reasonInput}
            />

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setIgnoreModal({ visible: false, item: null })}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={saveIgnore}>
                <Text style={styles.saveText}>Remember</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: palette.muted, fontSize: 16 },
  page: { padding: 18, paddingBottom: 34 },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 16 },
  headerText: { flex: 1 },
  eyebrow: { color: palette.blue, textTransform: 'uppercase', fontWeight: '800', letterSpacing: 2, fontSize: 11, marginBottom: 6 },
  title: { color: palette.text, fontSize: 42, fontWeight: '900', letterSpacing: -2 },
  date: { color: palette.muted, fontSize: 16, marginTop: 4 },
  progressPill: { minWidth: 80, borderRadius: 22, borderWidth: 1, borderColor: palette.line, backgroundColor: '#101826', paddingVertical: 12, paddingHorizontal: 14, alignItems: 'center' },
  progressText: { color: palette.accent, fontSize: 24, fontWeight: '900' },
  progressSub: { color: palette.dim, fontSize: 12, fontWeight: '800' },
  loopCard: { borderWidth: 1, borderColor: '#28445b', backgroundColor: '#102033', borderRadius: 26, padding: 16, marginBottom: 12, flexDirection: 'row', gap: 12, alignItems: 'center' },
  loopText: { flex: 1 },
  loopTitle: { color: palette.text, fontSize: 18, fontWeight: '900', letterSpacing: -0.4 },
  loopBody: { color: palette.muted, lineHeight: 20, marginTop: 6 },
  primaryButton: { minWidth: 82, minHeight: 48, borderRadius: 16, backgroundColor: palette.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  pauseButton: { backgroundColor: '#26364b' },
  primaryButtonText: { color: '#061017', fontWeight: '900' },
  cardHero: { borderWidth: 1, borderColor: palette.line, backgroundColor: palette.card, borderRadius: 26, padding: 20, marginBottom: 12 },
  heroTitle: { color: palette.text, fontSize: 25, fontWeight: '900', letterSpacing: -0.7, lineHeight: 31 },
  heroBody: { color: palette.muted, lineHeight: 21, marginTop: 10, fontSize: 15 },
  controlsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  smallButton: { flex: 1, borderWidth: 1, borderColor: palette.line, backgroundColor: '#101826', borderRadius: 16, minHeight: 46, alignItems: 'center', justifyContent: 'center' },
  smallButtonText: { color: palette.text, fontWeight: '850' },
  settingsCard: { borderWidth: 1, borderColor: palette.line, backgroundColor: palette.card, borderRadius: 24, padding: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingsText: { flex: 1 },
  switchColumn: { gap: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  switchLabel: { color: palette.muted, fontWeight: '900', width: 24 },
  sectionCard: { borderWidth: 1, borderColor: palette.line, backgroundColor: palette.card, borderRadius: 24, padding: 16, marginBottom: 14 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: palette.text, fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  sectionCount: { color: palette.muted, fontWeight: '900', borderWidth: 1, borderColor: palette.line, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  taskCard: { borderWidth: 1, borderColor: '#202d40', backgroundColor: palette.card2, borderRadius: 20, padding: 14, marginBottom: 10 },
  taskMain: { flexDirection: 'row', gap: 12 },
  checkbox: { width: 25, height: 25, borderRadius: 8, borderWidth: 2, borderColor: '#5c718d', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxDone: { backgroundColor: palette.accent, borderColor: palette.accent },
  checkMark: { color: '#061017', fontWeight: '900', fontSize: 17 },
  taskText: { flex: 1 },
  taskTitle: { color: palette.text, fontSize: 16, fontWeight: '900', lineHeight: 21 },
  taskDone: { opacity: 0.6, textDecorationLine: 'line-through' },
  taskDetail: { color: palette.muted, marginTop: 5, lineHeight: 20 },
  finishLine: { color: palette.blue, marginTop: 8, lineHeight: 20, fontSize: 13, fontWeight: '700' },
  why: { color: palette.dim, marginTop: 8, lineHeight: 18, fontSize: 13 },
  notInterested: { alignSelf: 'flex-start', marginTop: 12, borderWidth: 1, borderColor: '#2a3a51', borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7 },
  notInterestedText: { color: palette.dim, fontSize: 12, fontWeight: '850' },
  noteCard: { borderWidth: 1, borderColor: palette.line, backgroundColor: palette.card, borderRadius: 24, padding: 16, marginBottom: 14 },
  helper: { color: palette.muted, lineHeight: 20, marginTop: 7 },
  input: { marginTop: 12, minHeight: 120, borderWidth: 1, borderColor: '#223148', backgroundColor: '#0f1722', borderRadius: 18, padding: 14, color: palette.text, textAlignVertical: 'top', lineHeight: 20 },
  inputSmall: { marginTop: 12, minHeight: 84, borderWidth: 1, borderColor: '#223148', backgroundColor: '#0f1722', borderRadius: 18, padding: 14, color: palette.text, textAlignVertical: 'top', lineHeight: 20 },
  logCard: { borderWidth: 1, borderColor: palette.line, backgroundColor: '#101826', borderRadius: 24, padding: 16, marginBottom: 14 },
  logItem: { color: palette.muted, lineHeight: 20, marginTop: 8 },
  modalShade: { flex: 1, backgroundColor: 'rgba(0,0,0,.68)', alignItems: 'center', justifyContent: 'center', padding: 18 },
  modalCard: { width: '100%', borderRadius: 28, backgroundColor: '#121b28', borderWidth: 1, borderColor: palette.line, padding: 18 },
  modalTitle: { color: palette.text, fontSize: 24, fontWeight: '900', letterSpacing: -0.6 },
  modalBody: { color: palette.muted, marginTop: 8, lineHeight: 20 },
  modalTopic: { color: palette.blue, marginTop: 12, fontWeight: '850' },
  reasonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  reasonChip: { borderWidth: 1, borderColor: '#2a3a51', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#101826' },
  reasonText: { color: palette.muted, fontWeight: '800', fontSize: 12 },
  reasonInput: { marginTop: 14, minHeight: 50, borderWidth: 1, borderColor: '#223148', backgroundColor: '#0f1722', borderRadius: 16, padding: 12, color: palette.text },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cancelButton: { flex: 1, borderWidth: 1, borderColor: palette.line, borderRadius: 16, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: palette.muted, fontWeight: '850' },
  saveButton: { flex: 1, borderRadius: 16, minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.accent },
  saveText: { color: '#061017', fontWeight: '900' }
});
