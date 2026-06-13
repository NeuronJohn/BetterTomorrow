import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AssetIcon from './components/AssetIcon';
import { useDailyPack } from './hooks/useDailyPack';
import BriefScreen from './screens/BriefScreen';
import MemoryScreen from './screens/MemoryScreen';
import PlanScreen from './screens/PlanScreen';
import UpdatesScreen from './screens/UpdatesScreen';
import ProgressScreen from './screens/ProgressScreen';
import { colors } from './theme/tokens';

const TUNE_NOTES_KEY = 'dailyCompanion.tuneNotes.v1';
const PROJECT_PROGRESS_KEY = 'dailyCompanion.projectProgress.v1';

function getCardId(item) {
  return item?.id || item?.ref || item?.title || item?.label || 'card';
}

function resolveOpenUrl(item, action) {
  if (action === 'progress') return item?.progressUrl || item?.detailsUrl || item?.url || item?.videoUrl || item?.youtubeUrl || item?.openUrl;
  if (action === 'details') return item?.detailsUrl || item?.progressUrl || item?.url || item?.videoUrl || item?.youtubeUrl || item?.openUrl;
  return item?.url || item?.videoUrl || item?.youtubeUrl || item?.openUrl || item?.detailsUrl || item?.progressUrl;
}

function resolveSavedEntry(item, pack) {
  if (item?.id === pack?.featured?.id) {
    return {
      ref: 'featured',
      id: item.id,
      savedAt: 'Saved',
      duration: item.duration || '10 min',
      category: item.category || 'Productivity',
    };
  }

  if (item?.id === pack?.buildStatus?.id) {
    return {
      ref: 'buildStatus',
      id: item.id,
      savedAt: 'Saved',
      duration: item.duration || 'Active',
      category: item.category || 'Active project',
    };
  }

  return {
    ...item,
    id: getCardId(item),
    savedAt: 'Saved',
    duration: item?.duration || '10 min',
    category: item?.category || 'Productivity',
  };
}

function sameSavedItem(entry, item, pack) {
  const id = getCardId(item);
  if (entry?.ref === 'featured' && item?.id === pack?.featured?.id) return true;
  if (entry?.ref === 'buildStatus' && item?.id === pack?.buildStatus?.id) return true;
  return (entry?.id && entry.id === id) || (entry?.title && entry.title === item?.title);
}

function ConfirmUnsaveOverlay({ item, onCancel, onConfirm }) {
  return (
    <Modal visible={!!item} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.confirmLayer}>
        <Pressable style={styles.confirmScrim} onPress={onCancel} />
        <View style={styles.confirmCard}>
          <View style={styles.confirmIcon}>
            <AssetIcon name="bookmark" size={26} color={colors.teal} />
          </View>
          <Text allowFontScaling={false} style={styles.confirmTitle}>Remove from Memory?</Text>
          <Text allowFontScaling={false} style={styles.confirmCopy}>
            This only removes the saved copy from Memory and switches saved buttons back to Save. It will not hide or delete the card from today’s Brief or Updates.
          </Text>
          <Text allowFontScaling={false} style={styles.confirmItem} numberOfLines={2}>
            {item?.title || 'Saved item'}
          </Text>
          <View style={styles.confirmActions}>
            <Pressable style={styles.confirmCancel} onPress={onCancel}>
              <Text allowFontScaling={false} style={styles.confirmCancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.confirmDanger} onPress={onConfirm}>
              <Text allowFontScaling={false} style={styles.confirmDangerText}>Remove</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function DailyCompanionApp() {
  const [screen, setScreen] = useState('Updates');
  const { pack, status, importFromJson, resetPack } = useDailyPack();
  const [hiddenIds, setHiddenIds] = useState([]);
  const [savedItems, setSavedItems] = useState(pack.memory?.savedItems || []);
  const [tuneNotes, setTuneNotes] = useState(pack.memory?.tuneNotes || []);
  const [pendingUnsave, setPendingUnsave] = useState(null);
  const [progressProject, setProgressProject] = useState(null);
  const [projectProgress, setProjectProgress] = useState({});

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(TUNE_NOTES_KEY)
      .then((raw) => {
        if (!mounted || !raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTuneNotes(parsed);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(PROJECT_PROGRESS_KEY)
      .then((raw) => {
        if (!mounted || !raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') setProjectProgress(parsed);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setHiddenIds([]);
    setSavedItems(pack.memory?.savedItems || []);
    if (pack.memory?.tuneNotes?.length) setTuneNotes(pack.memory.tuneNotes);
    setPendingUnsave(null);
  }, [pack.date, pack.version, pack.featured?.id]);

  const savedIds = useMemo(() => savedItems.map((entry) => {
    if (entry?.ref === 'featured') return pack.featured?.id || 'featured';
    if (entry?.ref === 'buildStatus') return pack.buildStatus?.id || 'buildStatus';
    return entry?.id || entry?.title || entry?.ref;
  }).filter(Boolean), [savedItems, pack.featured?.id, pack.buildStatus?.id]);

  function isSaved(item) {
    return savedItems.some((entry) => sameSavedItem(entry, item, pack));
  }

  function persistTuneNotes(nextNotes) {
    AsyncStorage.setItem(TUNE_NOTES_KEY, JSON.stringify(nextNotes)).catch(() => {});
  }

  function persistProjectProgress(nextProgress) {
    AsyncStorage.setItem(PROJECT_PROGRESS_KEY, JSON.stringify(nextProgress)).catch(() => {});
  }

  function toggleProgressTask(projectId, taskId) {
    setProjectProgress((current) => {
      const currentProject = current[projectId] || { completedTaskIds: [], updates: [] };
      const hasTask = currentProject.completedTaskIds.includes(taskId);
      const nextProject = {
        ...currentProject,
        completedTaskIds: hasTask
          ? currentProject.completedTaskIds.filter((id) => id !== taskId)
          : [...currentProject.completedTaskIds, taskId],
      };
      const next = { ...current, [projectId]: nextProject };
      persistProjectProgress(next);
      return next;
    });
  }

  function addProgressUpdate(projectId, text) {
    const entry = {
      id: `progress-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      createdAtLabel: 'Saved just now',
    };

    setProjectProgress((current) => {
      const currentProject = current[projectId] || { completedTaskIds: [], updates: [] };
      const nextProject = {
        ...currentProject,
        updates: [entry, ...(currentProject.updates || [])].slice(0, 50),
      };
      const next = { ...current, [projectId]: nextProject };
      persistProjectProgress(next);
      return next;
    });
  }

  function addTuneNote(action, item, meta = {}) {
    const note = {
      id: `tune-${Date.now()}`,
      action,
      itemId: getCardId(item),
      title: item?.title || '',
      label: item?.label || '',
      reason: meta?.reason || '',
      createdAt: new Date().toISOString(),
      date: pack.date || '',
    };

    setTuneNotes((current) => {
      const next = [note, ...current].slice(0, 80);
      persistTuneNotes(next);
      return next;
    });
  }

  function normalizeUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  async function openUrlFor(item, action = 'open') {
    const url = normalizeUrl(resolveOpenUrl(item, action));
    if (!url) {
      Alert.alert('No link yet', 'This card does not include a URL in the daily pack.');
      return;
    }

    try {
      // Do not block web links behind canOpenURL. On Android, canOpenURL can fail
      // because of package visibility/query restrictions even when openURL would work.
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Could not open link', url);
    }
  }

  function confirmUnsave() {
    if (!pendingUnsave) return;
    setSavedItems((current) => current.filter((entry) => !sameSavedItem(entry, pendingUnsave, pack)));
    setPendingUnsave(null);
  }

  function saveItem(item) {
    setSavedItems((current) => {
      if (current.some((entry) => sameSavedItem(entry, item, pack))) return current;
      return [resolveSavedEntry(item, pack), ...current];
    });
  }

  function hideItem(item) {
    const id = getCardId(item);
    setHiddenIds((current) => current.includes(id) ? current : [...current, id]);
  }

  function handleCardAction(action, item, meta = {}) {
    if (action === 'save') {
      if (isSaved(item)) {
        setPendingUnsave(item);
        return;
      }
      saveItem(item);
      return;
    }

    if (action === 'unsave') {
      setPendingUnsave(item);
      return;
    }

    if (action === 'hide') {
      hideItem(item);
      return;
    }

    if (action === 'tune_save') {
      addTuneNote('save_this', item, meta);
      saveItem(item);
      return;
    }

    if (action === 'tune_use_today') {
      addTuneNote('use_today', item, meta);
      openUrlFor(item, 'open');
      return;
    }

    if (action === 'tune_too_much') {
      addTuneNote('too_much', item, meta);
      hideItem(item);
      return;
    }

    if (action === 'tune_not_useful') {
      addTuneNote('not_useful', item, meta);
      hideItem(item);
      return;
    }

    if (action === 'tune_remember') {
      addTuneNote('remember_note', item, meta);
      return;
    }

    if (action === 'clear_tune_notes') {
      setTuneNotes([]);
      persistTuneNotes([]);
      return;
    }

    if (action === 'progress') {
      setProgressProject(item);
      setScreen('Progress');
      return;
    }

    if (action === 'progress_link' || action === 'open' || action === 'details') {
      openUrlFor(item, action === 'progress_link' ? 'progress' : action);
    }
  }

  const effectivePack = useMemo(() => ({
    ...pack,
    featured: {
      ...(pack.featured || {}),
      saved: savedIds.includes(pack.featured?.id || 'featured'),
    },
    buildStatus: {
      ...(pack.buildStatus || {}),
      saved: savedIds.includes(pack.buildStatus?.id || 'buildStatus'),
    },
    memory: {
      ...(pack.memory || {}),
      savedItems,
      tuneNotes,
    },
  }), [pack, savedItems, savedIds, tuneNotes]);

  function handleNavigate(nextScreen) {
    if (nextScreen !== 'Progress') setProgressProject(null);
    setScreen(nextScreen);
  }

  const props = {
    activeTab: screen === 'Progress' ? 'Updates' : screen,
    onNavigate: handleNavigate,
    pack: effectivePack,
    importFromJson,
    importStatus: status,
    resetPack,
    hiddenIds,
    savedIds,
    onCardAction: handleCardAction,
  };

  return (
    <View style={{ flex: 1 }}>
      {screen === 'Brief' ? <BriefScreen {...props} /> : null}
      {screen === 'Plan' ? <PlanScreen {...props} /> : null}
      {screen === 'Updates' ? <UpdatesScreen {...props} /> : null}
      {screen === 'Memory' ? <MemoryScreen {...props} /> : null}
      {screen === 'Progress' ? (
        <ProgressScreen
          {...props}
          project={progressProject || effectivePack.buildStatus}
          progressState={projectProgress[(progressProject || effectivePack.buildStatus)?.id || 'project'] || { completedTaskIds: [], updates: [] }}
          onToggleTask={toggleProgressTask}
          onAddUpdate={addProgressUpdate}
        />
      ) : null}
      <ConfirmUnsaveOverlay
        item={pendingUnsave}
        onCancel={() => setPendingUnsave(null)}
        onConfirm={confirmUnsave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  confirmLayer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  confirmScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, .62)',
  },
  confirmCard: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: 'rgba(13, 23, 37, .98)',
    padding: 22,
  },
  confirmIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.teal,
    backgroundColor: 'rgba(7, 17, 29, .9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  confirmTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900',
  },
  confirmCopy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 10,
  },
  confirmItem: {
    color: colors.teal,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    marginTop: 14,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  confirmCancel: {
    flex: 1,
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(16, 30, 48, .88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmDanger: {
    flex: 1,
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.teal,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCancelText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
  },
  confirmDangerText: {
    color: '#061014',
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
  },
});
