import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AssetIcon from '../components/AssetIcon';
import AppShell from '../components/AppShell';
import { getCardThumbSource, getThumbSource, Panel } from '../components/Cards';
import { thumbnails } from '../data/assets';
import { colors } from '../theme/tokens';

const prefColors = {
  teal: colors.teal,
  gold: colors.gold,
  blue: colors.blue,
};

function getMemoryThumbSource(item) {
  return getCardThumbSource(item);
}

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
          <Image source={getMemoryThumbSource(savedItem)} resizeMode="cover" style={styles.savedThumb} />

          <View style={styles.savedCopy}>
            <View style={styles.savedLabelRow}>
              <Text allowFontScaling={false} style={styles.youtube} numberOfLines={1}>{savedItem.label || 'YOUTUBE'}</Text>
              <Pressable style={styles.activeBookmark} onPress={() => {}}>
                <AssetIcon name="bookmark" size={25} color={colors.teal} />
              </Pressable>
            </View>

            <Text allowFontScaling={false} style={styles.savedTitle} numberOfLines={3}>{savedItem.title}</Text>
            <Text allowFontScaling={false} style={styles.savedDesc} numberOfLines={2}>Useful for today’s skill sprint.</Text>
          </View>
        </View>

        <View style={styles.savedMetaRow}>
          <View style={styles.metaPair}><AssetIcon name="clock" size={17} color={colors.muted} /><Text allowFontScaling={false} style={styles.metaText}>{savedItem.duration || '12 min'}</Text></View>
          <View style={styles.metaPair}><AssetIcon name="tag" size={17} color={colors.muted} /><Text allowFontScaling={false} style={styles.metaText}>{savedItem.category || 'Productivity'}</Text></View>
          <Text allowFontScaling={false} style={styles.savedStatus}>Saved ✓</Text>
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
          <View style={styles.noteIcon}><AssetIcon name={note?.icon || 'note'} size={27} color={colors.blue} /></View>
          <View style={styles.noteText}>
            <Text allowFontScaling={false} style={styles.noteTitle} numberOfLines={2}>{note?.title || 'Why this matters'}</Text>
            <Text allowFontScaling={false} style={styles.noteDesc} numberOfLines={3}>{note?.copy || ''}</Text>
          </View>
          <Text allowFontScaling={false} style={styles.noteMore}>•••</Text>
        </View>
        <View style={styles.noteDivider} />
        <View style={styles.noteFooterRow}>
          <View style={styles.metaPair}><AssetIcon name="calendar" size={17} color={colors.muted} /><Text allowFontScaling={false} style={styles.noteFooter}>{note?.date || 'Saved today'}</Text></View>
          <View style={styles.metaPair}><AssetIcon name="tag" size={17} color={colors.muted} /><Text allowFontScaling={false} style={styles.noteFooter}>{note?.tag || 'Context'}</Text></View>
        </View>
      </Panel>
    </AppShell>
  );
}

function SectionHeader({ title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <Text allowFontScaling={false} style={styles.sectionTitle} numberOfLines={1}>{title}</Text>
      <Text allowFontScaling={false} style={styles.sectionAction}>{action}</Text>
    </View>
  );
}

function PrefCard({ icon, text, color }) {
  return (
    <Panel style={styles.prefCard}>
      <View style={styles.prefContent}>
        <View style={[styles.prefIcon, { borderColor: color }]}>
          <AssetIcon name={icon} size={20} color={color} />
        </View>
        <Text allowFontScaling={false} style={styles.prefText} numberOfLines={4}>
          {text}
        </Text>
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 6, gap: 12 },
  sectionTitle: { color: colors.text, fontSize: 23, lineHeight: 29, fontWeight: '900', flex: 1 },
  sectionAction: { color: colors.blue, fontSize: 16.5, lineHeight: 22, fontWeight: '800' },

  savedCard: { padding: 16 },
  savedTopRow: { flexDirection: 'row', gap: 16, alignItems: 'center', minHeight: 130 },
  savedThumb: { width: '50%', aspectRatio: 16 / 9, borderRadius: 19, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: '#07111D' },
  savedCopy: { flex: 1, minWidth: 0, justifyContent: 'center' },
  youtube: { color: colors.coral, fontSize: 12.5, lineHeight: 16, fontWeight: '900', letterSpacing: .5, flex: 1, minWidth: 0 },
  savedTitle: { color: colors.text, fontSize: 18.8, lineHeight: 23.5, fontWeight: '900', marginTop: 8 },
  savedDesc: { color: colors.muted, fontSize: 14.2, lineHeight: 20, marginTop: 8 },
  savedLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  activeBookmark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.teal,
    backgroundColor: 'rgba(7, 17, 29, .9)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  savedMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line },
  metaPair: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  metaText: { color: colors.muted, fontSize: 14.5, lineHeight: 18, fontWeight: '800' },
  savedStatus: { color: colors.teal, fontSize: 15, lineHeight: 19, fontWeight: '900', marginLeft: 'auto' },

  prefGrid: { gap: 10, paddingRight: 20, marginBottom: 14 },
  prefCard: { width: 132, minHeight: 112, padding: 12 },
  prefContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  prefIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 30, 48, .72)',
    flexShrink: 0,
  },
  prefText: {
    color: colors.muted,
    fontSize: 12.8,
    lineHeight: 18,
    fontWeight: '700',
    flex: 1,
    minWidth: 0,
    includeFontPadding: false,
  },

  noteCard: { padding: 16 },
  noteTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  noteIcon: { width: 54, height: 54, borderRadius: 16, backgroundColor: 'rgba(30, 75, 130, .5)', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  noteText: { flex: 1, minWidth: 0 },
  noteTitle: { color: colors.text, fontSize: 20, lineHeight: 25, fontWeight: '900' },
  noteDesc: { color: colors.muted, fontSize: 14.5, lineHeight: 20, marginTop: 7 },
  noteMore: { color: colors.muted, fontSize: 19, fontWeight: '900', letterSpacing: 2, marginTop: 4 },
  noteDivider: { height: 1, backgroundColor: colors.line, marginVertical: 14 },
  noteFooterRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  noteFooter: { color: colors.muted, fontSize: 13.5, fontWeight: '700' },
});
