import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, View } from 'react-native';
import { useDailyPack } from './hooks/useDailyPack';
import BriefScreen from './screens/BriefScreen';
import MemoryScreen from './screens/MemoryScreen';
import PlanScreen from './screens/PlanScreen';
import UpdatesScreen from './screens/UpdatesScreen';

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
      savedAt: 'Saved',
      duration: item.duration || '10 min',
      category: item.category || 'Productivity',
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
  return (entry?.id && entry.id === id) || (entry?.title && entry.title === item?.title);
}

export default function DailyCompanionApp() {
  const [screen, setScreen] = useState('Updates');
  const { pack, status, importFromJson, resetPack } = useDailyPack();
  const [hiddenIds, setHiddenIds] = useState([]);
  const [savedItems, setSavedItems] = useState(pack.memory?.savedItems || []);

  useEffect(() => {
    setHiddenIds([]);
    setSavedItems(pack.memory?.savedItems || []);
  }, [pack.date, pack.version, pack.featured?.id]);

  const savedIds = useMemo(() => savedItems.map((entry) => {
    if (entry?.ref === 'featured') return pack.featured?.id || 'featured';
    return entry?.id || entry?.title || entry?.ref;
  }).filter(Boolean), [savedItems, pack.featured?.id]);

  async function openUrlFor(item, action = 'open') {
    const url = resolveOpenUrl(item, action);
    if (!url) {
      Alert.alert('No link yet', 'This card does not include a URL in the daily pack.');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert('Cannot open link', url);
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Could not open link', url);
    }
  }

  function handleCardAction(action, item) {
    const id = getCardId(item);

    if (action === 'save') {
      setSavedItems((current) => {
        if (current.some((entry) => sameSavedItem(entry, item, pack))) return current;
        return [resolveSavedEntry(item, pack), ...current];
      });
      return;
    }

    if (action === 'unsave') {
      setSavedItems((current) => current.filter((entry) => !sameSavedItem(entry, item, pack)));
      return;
    }

    if (action === 'hide') {
      setHiddenIds((current) => current.includes(id) ? current : [...current, id]);
      return;
    }

    if (action === 'open' || action === 'progress' || action === 'details') {
      openUrlFor(item, action);
    }
  }

  const effectivePack = useMemo(() => ({
    ...pack,
    featured: {
      ...(pack.featured || {}),
      saved: savedIds.includes(pack.featured?.id || 'featured'),
    },
    memory: {
      ...(pack.memory || {}),
      savedItems,
    },
  }), [pack, savedItems, savedIds]);

  const props = {
    activeTab: screen,
    onNavigate: setScreen,
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
    </View>
  );
}
