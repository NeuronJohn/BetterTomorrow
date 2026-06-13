import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AssetIcon from '../components/AssetIcon';
import AppShell from '../components/AppShell';
import { getThumbSource, Panel } from '../components/Cards';
import { colors } from '../theme/tokens';

const prefColors = {
  teal: colors.teal,
  gold: colors.gold,
  blue: colors.blue,
};

export default function MemoryScreen({ activeTab = 'Memory', onNavigate, pack }) {
  const saved = pack.memory?.savedItems?.[0];
  const savedItem = saved?.ref === 'featured' ? { ...pack.featured, ...saved } : pack.featured;
  const note = pack.memory?.notes?.[0];

  return (
    <AppShell
      activeTab={activeTab}
      onNavigate={onNavigate}
      title="Memory"
      subtitle="Your saved items, preferences, and useful direction I’ll remember for you."
    >
      <SectionHeader title="Saved items" action="See all" />
      <Panel style={styles.savedCard}>
        <Image source={getThumbSource(savedItem)} resizeMode="cover" style={styles.savedThumb} />
        <View style={styles.savedCopy}>
          <Text style={styles.youtube}>{savedItem.label || 'YOUTUBE'}</Text>
          <Text style={styles.savedTitle}>{savedItem.title}</Text>
          <Text style={styles.savedDesc}>Useful for today’s skill sprint.</Text>
        </View>
        <Pressable style={styles.activeBookmark} onPress={() => {}}><AssetIcon name="bookmark" size={34} color={colors.teal} /></Pressable>
        <View style={styles.savedMetaRow}>
          <View style={styles.metaPair}><AssetIcon name="clock" size={19} color={colors.muted} /><Text style={styles.metaText}>{savedItem.duration || '12 min'}</Text></View>
          <View style={styles.metaPair}><AssetIcon name="tag" size={19} color={colors.muted} /><Text style={styles.metaText}>{savedItem.category || 'Productivity'}</Text></View>
          <Text style={styles.savedStatus}>Saved  ✓</Text>
        </View>
      </Panel>

      <SectionHeader title="Remembered preferences" action="Manage" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.prefGrid}>
        {(pack.memory?.preferences || []).map((pref) => (
          <PrefCard key={pref.text} icon={pref.icon} text={pref.text} color={prefColors[pref.color] || colors.teal} />
        ))}
      </ScrollView>

      <SectionHeader title="Remembered notes" action="See all" />
      <Panel style={styles.noteCard}>
        <View style={styles.noteIcon}><AssetIcon name={note?.icon || 'note'} size={30} color={colors.blue} /></View>
        <View style={styles.noteText}>
          <Text style={styles.noteTitle}>{note?.title || 'Why this matters'}</Text>
          <Text style={styles.noteDesc}>{note?.copy || ''}</Text>
        </View>
        <Text style={styles.noteMore}>•••</Text>
        <View style={styles.noteDivider} />
        <View style={styles.noteFooterRow}>
          <View style={styles.metaPair}><AssetIcon name="calendar" size={18} color={colors.muted} /><Text style={styles.noteFooter}>{note?.date || 'Saved today'}</Text></View>
          <View style={styles.metaPair}><AssetIcon name="tag" size={18} color={colors.muted} /><Text style={styles.noteFooter}>{note?.tag || 'Context'}</Text></View>
        </View>
      </Panel>
    </AppShell>
  );
}

function SectionHeader({ title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionAction}>{action}</Text>
    </View>
  );
}

function PrefCard({ icon, text, color }) {
  return (
    <Panel style={styles.prefCard}>
      <View style={styles.prefContent}>
        <View style={[styles.prefIcon, { borderColor: color }]}>
          <AssetIcon name={icon} size={22} color={color} />
        </View>
        <Text style={styles.prefText} numberOfLines={4} adjustsFontSizeToFit minimumFontScale={0.8}>
          {text}
        </Text>
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  sectionTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  sectionAction: { color: colors.blue, fontSize: 17, fontWeight: '800' },

  savedCard: { padding: 14, minHeight: 260, position: 'relative' },
  savedThumb: { width: '48%', aspectRatio: 16 / 9, borderRadius: 18, borderWidth: 1, borderColor: colors.lineStrong },
  savedCopy: { position: 'absolute', left: '56%', right: 26, top: 42 },
  youtube: { color: colors.coral, fontSize: 13, fontWeight: '900', letterSpacing: .5 },
  savedTitle: { color: colors.text, fontSize: 21.5, lineHeight: 28, fontWeight: '900', marginTop: 12 },
  savedDesc: { color: colors.muted, fontSize: 15.5, lineHeight: 22, marginTop: 12 },
  activeBookmark: {
    position: 'absolute',
    right: 24,
    top: 24,
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.teal,
    backgroundColor: 'rgba(7, 17, 29, .9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedMetaRow: { position: 'absolute', left: 24, right: 24, bottom: 24, flexDirection: 'row', alignItems: 'center', gap: 20 },
  metaPair: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  metaText: { color: colors.muted, fontSize: 15, fontWeight: '800' },
  savedStatus: { color: colors.teal, fontSize: 16, fontWeight: '900', marginLeft: 'auto' },

  prefGrid: { gap: 12, paddingRight: 20, marginBottom: 18 },
  prefCard: { width: 215, minHeight: 124, padding: 14, marginRight: 0 },
  prefContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  prefIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 30, 48, .72)',
    flexShrink: 0,
  },
  prefText: {
    color: colors.muted,
    fontSize: 14.5,
    lineHeight: 20,
    fontWeight: '700',
    flex: 1,
    minWidth: 0,
    includeFontPadding: false,
  },

  noteCard: { padding: 18, minHeight: 230, position: 'relative' },
  noteIcon: { width: 58, height: 58, borderRadius: 16, backgroundColor: 'rgba(30, 75, 130, .5)', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  noteText: { position: 'absolute', left: 92, top: 28, right: 50 },
  noteTitle: { color: colors.text, fontSize: 21, fontWeight: '900' },
  noteDesc: { color: colors.muted, fontSize: 15.5, lineHeight: 22, marginTop: 8 },
  noteMore: { position: 'absolute', right: 28, top: 42, color: colors.muted, fontSize: 20, fontWeight: '900' },
  noteDivider: { position: 'absolute', left: 28, right: 28, bottom: 62, height: 1, backgroundColor: colors.line },
  noteFooterRow: { position: 'absolute', left: 28, right: 28, bottom: 28, flexDirection: 'row', justifyContent: 'space-between' },
  noteFooter: { color: colors.muted, fontSize: 14, fontWeight: '700' },
});
