import React, { useState } from 'react';
import { View } from 'react-native';
import AppShell from '../components/AppShell';
import { BuildStatusCard, ProjectOptionsSheet, TuneSheet, UpdatesFeatureCard } from '../components/Cards';

function itemId(item) { return item?.id || item?.ref || item?.title || item?.label || 'card'; }
function withSaved(item, savedIds) { const id = itemId(item); return { ...item, saved: item.saved || savedIds.includes(id) }; }
function resolveUpdate(entry, pack, savedIds = []) {
  if (!entry) return null;
  if (entry.ref === 'featured') return withSaved({ ...pack.featured, ...entry }, savedIds);
  if (entry.ref === 'buildStatus') return withSaved({ ...pack.buildStatus, ...entry, cardType: 'buildStatus' }, savedIds);
  return withSaved(entry, savedIds);
}

export default function UpdatesScreen({ activeTab = 'Updates', onNavigate, pack, hiddenIds = [], savedIds = [], onCardAction }) {
  const [tuneItem, setTuneItem] = useState(null);
  const [optionsItem, setOptionsItem] = useState(null);
  const updateItems = (pack.updates || [{ ref: 'featured' }, { ref: 'buildStatus' }])
    .map((entry) => resolveUpdate(entry, pack, savedIds))
    .filter(Boolean)
    .filter((item) => !hiddenIds.includes(itemId(item)));

  return (
    <View style={{ flex: 1 }}>
      <AppShell activeTab={activeTab} onNavigate={onNavigate} title="Updates" subtitle="Only useful stuff: videos, build notes, and saved interests that fit your goals.">
        {updateItems.map((item, index) => (
          item.cardType === 'buildStatus'
            ? <BuildStatusCard key={item.id || item.ref || index} item={item} onAction={onCardAction} onTune={setTuneItem} onOptions={setOptionsItem} />
            : <UpdatesFeatureCard key={item.id || item.ref || index} item={item} onTune={setTuneItem} onAction={onCardAction} />
        ))}
      </AppShell>
      <TuneSheet item={tuneItem} visible={!!tuneItem} onClose={() => setTuneItem(null)} onAction={onCardAction} />
      <ProjectOptionsSheet
        item={optionsItem}
        visible={!!optionsItem}
        onClose={() => setOptionsItem(null)}
        onAction={onCardAction}
        onTune={setTuneItem}
      />
    </View>
  );
}
