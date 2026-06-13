import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AssetIcon from './AssetIcon';
import { colors } from '../theme/tokens';

const tabs = [
  { key: 'Brief', icon: 'sun' },
  { key: 'Plan', icon: 'calendar' },
  { key: 'Updates', icon: 'updates' },
  { key: 'Memory', icon: 'brain' },
];

export default function BottomNav({ activeTab, onNavigate }) {
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.nav}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          const tint = active ? colors.teal : '#A9B4C8';
          return (
            <Pressable key={tab.key} onPress={() => onNavigate?.(tab.key)} style={[styles.item, active && styles.activeItem]}>
              <AssetIcon name={tab.icon} size={active ? 44 : 40} color={tint} />
              <Text style={[styles.label, active && styles.activeLabel]} numberOfLines={1}>{tab.key}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 14, right: 14, bottom: 18, zIndex: 50 },
  nav: {
    height: 102,
    borderRadius: 36,
    backgroundColor: 'rgba(7, 15, 25, 0.98)',
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  item: { flex: 1, height: 82, borderRadius: 27, alignItems: 'center', justifyContent: 'center', gap: 7 },
  activeItem: { backgroundColor: 'rgba(13, 57, 57, 0.86)', borderWidth: 1, borderColor: '#0F6F6E' },
  label: { color: '#A9B4C8', fontSize: 14, lineHeight: 17, fontWeight: '800' },
  activeLabel: { color: colors.teal },
});
