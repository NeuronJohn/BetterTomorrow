import React, { useState } from 'react';
import { View } from 'react-native';
import AppShell from '../components/AppShell';
import { BuildStatusCard, TuneSheet, UpdatesFeatureCard } from '../components/Cards';

function resolveUpdate(entry, pack) {
  if (!entry) return null;
  if (entry.ref === 'featured') return { ...pack.featured, ...entry };
  if (entry.ref === 'buildStatus') return { ...pack.buildStatus, ...entry, cardType: 'buildStatus' };
  return entry;
}

export default function UpdatesScreen({ activeTab = 'Updates', onNavigate, pack }) {
  const [tuneItem, setTuneItem] = useState(null);
  const updateItems = (pack.updates || [{ ref: 'featured' }, { ref: 'buildStatus' }])
    .map((entry) => resolveUpdate(entry, pack))
    .filter(Boolean);

  return (
    <View style={{ flex: 1 }}>
      <AppShell
        activeTab={activeTab}
        onNavigate={onNavigate}
        title="Updates"
        subtitle="Only useful stuff: videos, build notes, and saved interests that fit your goals."
      >
        {updateItems.map((item, index) => (
          item.cardType === 'buildStatus'
            ? <BuildStatusCard key={item.id || item.ref || index} item={item} />
            : <UpdatesFeatureCard key={item.id || item.ref || index} item={item} onTune={setTuneItem} />
        ))}
      </AppShell>
      <TuneSheet item={tuneItem} visible={!!tuneItem} onClose={() => setTuneItem(null)} />
    </View>
  );
}
