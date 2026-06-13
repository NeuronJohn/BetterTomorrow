import React, { useState } from 'react';
import { View } from 'react-native';
import AppShell from '../components/AppShell';
import { BuildStatusCard, TuneSheet, UpdatesFeatureCard } from '../components/Cards';

export default function UpdatesScreen({ activeTab = 'Updates', onNavigate, pack }) {
  const [tuneItem, setTuneItem] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <AppShell
        activeTab={activeTab}
        onNavigate={onNavigate}
        title="Updates"
        subtitle="Only useful stuff: videos, build notes, and saved interests that fit your goals."
      >
        <UpdatesFeatureCard item={pack.featured} onTune={setTuneItem} />
        <BuildStatusCard item={pack.buildStatus} />
      </AppShell>
      <TuneSheet item={tuneItem} visible={!!tuneItem} onClose={() => setTuneItem(null)} />
    </View>
  );
}
