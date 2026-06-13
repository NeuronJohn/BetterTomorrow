import React, { useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AssetIcon from '../components/AssetIcon';
import AppShell from '../components/AppShell';
import { getCardThumbSource, Panel } from '../components/Cards';
import { PillButton } from '../components/Buttons';
import { colors } from '../theme/tokens';

const prefColors = {
  teal: colors.teal,
  gold: colors.gold,
  blue: colors.blue,
};

function getMemoryThumbSource(item) {
  return getCardThumbSource(item);
}

function resolveSaved(saved, pack) {
  if (!saved) return null;
  if (saved.ref === 'featured') return { ...pack.featured, ...saved };
  if (saved.ref === 'buildStatus') return { ...pack.buildStatus, ...saved };
  return saved;
}

export default function MemoryScreen({ activeTab = 'Memory', onNavigate, pack, onCardAction }) {
  const [sheet, setSheet] = useState(null);
  const savedItems = useMemo(() => (pack.memory?.savedItems || []).map((saved) => resolveSaved(saved, pack)).filter(Boolean), [pack]);
  const savedItem = savedItems[0];
  const notes = pack.memory?.notes || [];
  const note = notes[0];
  const preferences = pack.memory?.preferences || [];
  const tuneNotes = pack.memory?.tuneNotes || [];

  return (
    <View style={{ flex: 1 }}>
      <AppShell
        activeTab={activeTab}
        onNavigate={onNavigate}
        title="Memory"
        subtitle="Your saved items, preferences, and useful direction I’ll remember for you."
      >
        <SectionHeader title="Saved items" action="See all" onPress={() => setSheet('saved')} />
        {savedItem ? (
          <Panel style={styles.savedCard}>
            <View style={styles.savedTopRow}>
              <Image source={getMemoryThumbSource(savedItem)} resizeMode="cover" style={styles.savedThumb} />

              <View style={styles.savedCopy}>
                <View style={styles.savedLabelRow}>
                  <Text allowFontScaling={false} style={styles.youtube} numberOfLines={1}>{savedItem.label || 'SAVED'}</Text>
                  <Pressable style={styles.activeBookmark} onPress={() => onCardAction?.('unsave', savedItem)}>
                    <AssetIcon name="bookmark" size={22} color={colors.teal} />
                  </Pressable>
                </View>

                <Text allowFontScaling={false} style={styles.savedTitle} numberOfLines={3}>{savedItem.title}</Text>
                <Text allowFontScaling={false} style={styles.savedDesc} numberOfLines={2}>Useful for today’s skill sprint.</Text>
              </View>
            </View>

            <View style={styles.savedMetaRow}>
              <View style={styles.metaPair}><AssetIcon name="clock" size={16} color={colors.muted} /><Text allowFontScaling={false} style={styles.metaText}>{savedItem.duration || '12 min'}</Text></View>
              <View style={styles.metaPair}><AssetIcon name="tag" size={16} color={colors.muted} /><Text allowFontScaling={false} style={styles.metaText}>{savedItem.category || 'Productivity'}</Text></View>
              <Text allowFontScaling={false} style={styles.savedStatus}>Saved ✓</Text>
            </View>
          </Panel>
        ) : (
          <Panel style={styles.emptySavedCard}>
            <Text allowFontScaling={false} style={styles.emptySavedTitle}>No saved items yet</Text>
            <Text allowFontScaling={false} style={styles.emptySavedCopy}>Save a useful update and it will land here.</Text>
          </Panel>
        )}

        <SectionHeader title="Remembered preferences" action="Manage" onPress={() => setSheet('manage')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.prefGrid}>
          {preferences.map((pref) => (
            <PrefCard key={pref.text} icon={pref.icon} text={pref.text} color={prefColors[pref.color] || colors.teal} />
          ))}
        </ScrollView>

        <SectionHeader title="Remembered notes" action="See all" onPress={() => setSheet('notes')} />
        {note ? (
          <Panel style={styles.noteCard}>
            <View style={styles.noteTopRow}>
              <View style={styles.noteIcon}><AssetIcon name={note?.icon || 'note'} size={27} color={colors.blue} /></View>
              <View style={styles.noteText}>
                <Text allowFontScaling={false} style={styles.noteTitle} numberOfLines={2}>{note?.title || 'Why this matters'}</Text>
                <Text allowFontScaling={false} style={styles.noteDesc} numberOfLines={3}>{note?.copy || ''}</Text>
              </View>
              <Pressable onPress={() => setSheet('notes')} style={styles.noteMoreButton}>
                <Text allowFontScaling={false} style={styles.noteMore}>•••</Text>
              </Pressable>
            </View>
            <View style={styles.noteDivider} />
            <View style={styles.noteFooterRow}>
              <View style={styles.metaPair}><AssetIcon name="calendar" size={17} color={colors.muted} /><Text allowFontScaling={false} style={styles.noteFooter}>{note?.date || 'Saved today'}</Text></View>
              <View style={styles.metaPair}><AssetIcon name="tag" size={17} color={colors.muted} /><Text allowFontScaling={false} style={styles.noteFooter}>{note?.tag || 'Context'}</Text></View>
            </View>
          </Panel>
        ) : (
          <Panel style={styles.emptySavedCard}>
            <Text allowFontScaling={false} style={styles.emptySavedTitle}>No remembered notes yet</Text>
            <Text allowFontScaling={false} style={styles.emptySavedCopy}>Tune choices and daily packs can add notes here.</Text>
          </Panel>
        )}
      </AppShell>

      <MemorySheet
        type={sheet}
        onClose={() => setSheet(null)}
        savedItems={savedItems}
        notes={notes}
        preferences={preferences}
        tuneNotes={tuneNotes}
        onCardAction={onCardAction}
      />
    </View>
  );
}

function SectionHeader({ title, action, onPress }) {
  return (
    <View style={styles.sectionHeader}>
      <Text allowFontScaling={false} style={styles.sectionTitle} numberOfLines={1}>{title}</Text>
      <Pressable onPress={onPress} hitSlop={10}>
        <Text allowFontScaling={false} style={styles.sectionAction}>{action}</Text>
      </Pressable>
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

function MemorySheet({ type, onClose, savedItems, notes, preferences, tuneNotes, onCardAction }) {
  const visible = !!type;
  if (!visible) return null;

  const title = type === 'saved' ? 'All saved items' : type === 'manage' ? 'Manage memory' : 'Remembered notes';
  const subtitle =
    type === 'saved'
      ? 'Open or remove saved cards without changing today’s recommendations.'
      : type === 'manage'
        ? 'Preferences and tune choices shape future daily packs.'
        : 'Notes imported or remembered for context.';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetLayer}>
        <Pressable style={styles.sheetScrim} onPress={onClose} />
        <View style={styles.memorySheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View style={{ flex: 1 }}>
              <Text allowFontScaling={false} style={styles.sheetTitle}>{title}</Text>
              <Text allowFontScaling={false} style={styles.sheetSubtitle}>{subtitle}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <AssetIcon name="close" size={18} color={colors.muted} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
            {type === 'saved' ? (
              savedItems.length ? savedItems.map((item) => (
                <SavedRow key={item.id || item.ref || item.title} item={item} onCardAction={onCardAction} />
              )) : <EmptySheet title="Nothing saved yet" copy="Use Save on any useful card and it will appear here." />
            ) : null}

            {type === 'manage' ? (
              <>
                <Text allowFontScaling={false} style={styles.sheetSectionLabel}>Preferences</Text>
                {preferences.map((pref) => (
                  <PreferenceRow key={pref.text} pref={pref} />
                ))}
                <Text allowFontScaling={false} style={styles.sheetSectionLabel}>Tune memory</Text>
                <Panel style={styles.tuneSummaryCard}>
                  <Text allowFontScaling={false} style={styles.tuneSummaryTitle}>{tuneNotes.length} tune notes stored</Text>
                  <Text allowFontScaling={false} style={styles.tuneSummaryCopy}>
                    These stay in backend memory so future daily imports can adjust. They are not shown on the main Memory tab.
                  </Text>
                  <View style={styles.sheetActionRow}>
                    <PillButton label="Clear tune notes" icon="close" onPress={() => onCardAction?.('clear_tune_notes')} style={styles.sheetActionButton} />
                  </View>
                </Panel>
              </>
            ) : null}

            {type === 'notes' ? (
              notes.length ? notes.map((note) => (
                <NoteRow key={`${note.title}-${note.date || ''}`} note={note} />
              )) : <EmptySheet title="No notes yet" copy="Notes from packs or reminders will appear here." />
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function SavedRow({ item, onCardAction }) {
  return (
    <Panel style={styles.sheetSavedRow}>
      <Image source={getMemoryThumbSource(item)} resizeMode="cover" style={styles.sheetSavedThumb} />
      <View style={styles.sheetSavedCopy}>
        <Text allowFontScaling={false} style={styles.youtube} numberOfLines={1}>{item.label || 'SAVED'}</Text>
        <Text allowFontScaling={false} style={styles.sheetSavedTitle} numberOfLines={2}>{item.title}</Text>
        <Text allowFontScaling={false} style={styles.sheetSavedMeta} numberOfLines={1}>{item.duration || 'Saved'} · {item.category || 'Memory'}</Text>
        <View style={styles.sheetActionRow}>
          <PillButton label="Open" icon="play" primary onPress={() => onCardAction?.('open', item)} style={styles.sheetActionButton} />
          <PillButton label="Remove" icon="bookmark" accentText onPress={() => onCardAction?.('unsave', item)} style={styles.sheetActionButton} />
        </View>
      </View>
    </Panel>
  );
}

function PreferenceRow({ pref }) {
  const color = prefColors[pref.color] || colors.teal;
  return (
    <Panel style={styles.prefManageRow}>
      <View style={[styles.prefIcon, { borderColor: color }]}>
        <AssetIcon name={pref.icon} size={20} color={color} />
      </View>
      <Text allowFontScaling={false} style={styles.prefManageText}>{pref.text}</Text>
    </Panel>
  );
}

function NoteRow({ note }) {
  return (
    <Panel style={styles.noteListRow}>
      <View style={styles.noteIcon}><AssetIcon name={note?.icon || 'note'} size={24} color={colors.blue} /></View>
      <View style={styles.noteText}>
        <Text allowFontScaling={false} style={styles.noteTitle} numberOfLines={2}>{note.title}</Text>
        <Text allowFontScaling={false} style={styles.noteDesc} numberOfLines={4}>{note.copy}</Text>
        <Text allowFontScaling={false} style={styles.noteFooter}>{note.date || note.tag || 'Memory note'}</Text>
      </View>
    </Panel>
  );
}

function EmptySheet({ title, copy }) {
  return (
    <Panel style={styles.emptySavedCard}>
      <Text allowFontScaling={false} style={styles.emptySavedTitle}>{title}</Text>
      <Text allowFontScaling={false} style={styles.emptySavedCopy}>{copy}</Text>
    </Panel>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 6, gap: 12 },
  sectionTitle: { color: colors.text, fontSize: 23, lineHeight: 29, fontWeight: '900', flex: 1 },
  sectionAction: { color: colors.blue, fontSize: 16.5, lineHeight: 22, fontWeight: '800' },

  savedCard: { padding: 13 },
  savedTopRow: { flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 104 },
  savedThumb: { width: '54%', aspectRatio: 16 / 9, borderRadius: 18, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: '#07111D' },
  savedCopy: { flex: 1, minWidth: 0, justifyContent: 'center' },
  youtube: { color: colors.coral, fontSize: 12, lineHeight: 15, fontWeight: '900', letterSpacing: .45, flex: 1, minWidth: 0 },
  savedTitle: { color: colors.text, fontSize: 16.8, lineHeight: 21.5, fontWeight: '900', marginTop: 6 },
  savedDesc: { color: colors.muted, fontSize: 13.2, lineHeight: 18, marginTop: 6 },
  savedLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  activeBookmark: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.teal,
    backgroundColor: 'rgba(7, 17, 29, .9)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  savedMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: 11, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line },
  metaPair: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  metaText: { color: colors.muted, fontSize: 13.6, lineHeight: 17, fontWeight: '800' },
  savedStatus: { color: colors.teal, fontSize: 14, lineHeight: 17, fontWeight: '900', marginLeft: 'auto' },

  emptySavedCard: { padding: 18 },
  emptySavedTitle: { color: colors.text, fontSize: 18, lineHeight: 23, fontWeight: '900' },
  emptySavedCopy: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 6 },

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
  noteMoreButton: { width: 44, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: -8 },
  noteMore: { color: colors.muted, fontSize: 19, fontWeight: '900', letterSpacing: 2 },
  noteDivider: { height: 1, backgroundColor: colors.line, marginVertical: 14 },
  noteFooterRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  noteFooter: { color: colors.muted, fontSize: 13.5, lineHeight: 18, fontWeight: '700', marginTop: 8 },

  sheetLayer: { flex: 1, justifyContent: 'flex-end' },
  sheetScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.42)' },
  memorySheet: {
    maxHeight: '82%',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: 'rgba(13, 23, 37, .995)',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sheetHandle: { alignSelf: 'center', width: 82, height: 7, borderRadius: 99, backgroundColor: '#607189', marginBottom: 18 },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  sheetTitle: { color: colors.text, fontSize: 28, lineHeight: 34, fontWeight: '900' },
  sheetSubtitle: { color: colors.muted, fontSize: 14.5, lineHeight: 21, marginTop: 6 },
  closeButton: { width: 42, height: 42, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(16,30,48,.88)', alignItems: 'center', justifyContent: 'center' },
  sheetContent: { paddingBottom: 18 },
  sheetSavedRow: { padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center' },
  sheetSavedThumb: { width: 132, aspectRatio: 16 / 9, borderRadius: 16, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: '#07111D' },
  sheetSavedCopy: { flex: 1, minWidth: 0 },
  sheetSavedTitle: { color: colors.text, fontSize: 16.5, lineHeight: 21, fontWeight: '900', marginTop: 5 },
  sheetSavedMeta: { color: colors.muted, fontSize: 13, lineHeight: 17, marginTop: 5 },
  sheetActionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  sheetActionButton: { flex: 1, minHeight: 50, borderRadius: 18, minWidth: 0 },
  sheetSectionLabel: { color: colors.teal, fontSize: 15, lineHeight: 19, fontWeight: '900', marginBottom: 10, marginTop: 4 },
  prefManageRow: { padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 },
  prefManageText: { color: colors.text, fontSize: 15.5, lineHeight: 21, fontWeight: '800', flex: 1 },
  tuneSummaryCard: { padding: 16 },
  tuneSummaryTitle: { color: colors.text, fontSize: 17, lineHeight: 22, fontWeight: '900' },
  tuneSummaryCopy: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 6 },
  noteListRow: { padding: 14, flexDirection: 'row', gap: 13, alignItems: 'flex-start' },
});
