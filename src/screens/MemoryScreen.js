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
        <View style={styles.savedTopRow}>
          <Image source={getThumbSource(savedItem)} resizeMode="contain" style={styles.savedThumb} />
          <View style={styles.savedCopy}>
            <Text style={styles.youtube} numberOfLines={1}>{savedItem.label || 'YOUTUBE'}</Text>
            <Text style={styles.savedTitle} numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.82}>{savedItem.title}</Text>
            <Text style={styles.savedDesc} numberOfLines={2}>Useful for today’s skill sprint.</Text>
          </View>
          <Pressable style={styles.activeBookmark} onPress={() => {}}>
            <AssetIcon name="bookmark" size={30} color={colors.teal} />
          </Pressable>
        </View>

        <View style={styles.savedMetaRow}>
          <View style={styles.metaPair}><AssetIcon name="clock" size={19} color={colors.muted} /><Text style={styles.metaText}>{savedItem.duration || '12 min'}</Text></View>
          <View style={styles.metaPair}><AssetIcon name="tag" size={19} color={colors.muted} /><Text style={styles.metaText}>{savedItem.category || 'Productivity'}</Text></View>
          <Text style={styles.savedStatus}>Saved ✓</Text>
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
        <View style={styles.noteTopRow}>
          <View style={styles.noteIcon}><AssetIcon name={note?.icon || 'note'} size={30} color={colors.blue} /></View>
          <View style={styles.noteText}>
            <Text style={styles.noteTitle} numberOfLines={2}>{note?.title || 'Why this matters'}</Text>
            <Text style={styles.noteDesc}>{note?.copy || ''}</Text>
          </View>
          <Text style={styles.noteMore}>•••</Text>
        </View>
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
      <Text style={styles.sectionTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78}>{title}</Text>
      <Text style={styles.sectionAction}>{action}</Text>
    </View>
  );
}

function PrefCard({ icon, text, color }) {
  return (
    <Panel style={styles.prefCard}>
      <View style={styles.prefContent}>
        <View style={[styles.prefIcon, { borderColor: color }]}>
          <AssetIcon name={icon} size={23} color={color} />
        </View>
        <Text style={styles.prefText} numberOfLines={3}>
          {text}
        </Text>
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 12, marginTop: 8 },
  sectionTitle: { color: colors.text, fontSize: 24, fontWeight: '900', flex: 1, minWidth: 0 },
  sectionAction: { color: colors.blue, fontSize: 17, fontWeight: '800' },

  savedCard: { padding: 16 },
  savedTopRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  savedThumb: { width: '43%', aspectRatio: 16 / 9, borderRadius: 18, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: '#07111D' },
  savedCopy: { flex: 1, minWidth: 0, paddingRight: 48 },
  youtube: { color: colors.coral, fontSize: 13, lineHeight: 17, fontWeight: '900', letterSpacing: .5 },
  savedTitle: { color: colors.text, fontSize: 20, lineHeight: 26, fontWeight: '900', marginTop: 8 },
  savedDesc: { color: colors.muted, fontSize: 15, lineHeight: 21, marginTop: 8 },
  activeBookmark: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.teal,
    backgroundColor: 'rgba(7, 17, 29, .9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.line },
  metaPair: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  metaText: { color: colors.muted, fontSize: 14, fontWeight: '800' },
  savedStatus: { color: colors.teal, fontSize: 15, fontWeight: '900', marginLeft: 'auto' },

  prefGrid: { gap: 12, paddingRight: 20, paddingBottom: 18 },
  prefCard: { width: 210, minHeight: 112, padding: 14 },
  prefContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  prefIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
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
    fontWeight: '800',
    flex: 1,
    minWidth: 0,
    includeFontPadding: false,
  },

  noteCard: { padding: 18 },
  noteTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  noteIcon: { width: 58, height: 58, borderRadius: 16, backgroundColor: 'rgba(30, 75, 130, .5)', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  noteText: { flex: 1, minWidth: 0 },
  noteTitle: { color: colors.text, fontSize: 21, lineHeight: 26, fontWeight: '900' },
  noteDesc: { color: colors.muted, fontSize: 15.5, lineHeight: 22, marginTop: 8 },
  noteMore: { color: colors.muted, fontSize: 20, fontWeight: '900', letterSpacing: 2, marginTop: 6 },
  noteDivider: { height: 1, backgroundColor: colors.line, marginVertical: 16 },
  noteFooterRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  noteFooter: { color: colors.muted, fontSize: 13.5, fontWeight: '700' },
});
