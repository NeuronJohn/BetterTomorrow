import React, { useState } from 'react';
import { View } from 'react-native';
import { useDailyPack } from './hooks/useDailyPack';
import BriefScreen from './screens/BriefScreen';
import MemoryScreen from './screens/MemoryScreen';
import PlanScreen from './screens/PlanScreen';
import UpdatesScreen from './screens/UpdatesScreen';

export default function DailyCompanionApp() {
  const [screen, setScreen] = useState('Updates');
  const { pack, status, importFromJson, resetPack } = useDailyPack();

  const props = {
    activeTab: screen,
    onNavigate: setScreen,
    pack,
    importFromJson,
    importStatus: status,
    resetPack,
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
