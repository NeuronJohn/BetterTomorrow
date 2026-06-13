import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AssetIcon from '../components/AssetIcon';
import AppShell from '../components/AppShell';
import { BriefFeatureCard, BuildStatusCard, Panel, ProjectOptionsSheet, TuneSheet } from '../components/Cards';
import ImportDailyPackModal from '../components/ImportDailyPackModal';
import { PillButton } from '../components/Buttons';
import { colors } from '../theme/tokens';

export default function BriefScreen({ activeTab = 'Brief', onNavigate, pack, importFromJson, importStatus, hiddenIds = [], savedIds = [], onCardAction }) {
  const [tuneItem, setTuneItem] = useState(null);
  const [optionsItem, setOptionsItem] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const featuredHidden = hiddenIds.includes(pack.featured?.id || pack.featured?.title);
  const buildHidden = hiddenIds.includes(pack.buildStatus?.id || pack.buildStatus?.title);
  const featuredForCard = { ...pack.featured, saved: pack.featured?.saved || savedIds.includes(pack.featured?.id || 'featured') };

  return (
    <View style={{ flex: 1 }}>
      <AppShell
        activeTab={activeTab}
        onNavigate={onNavigate}
        title={pack.brief.title || 'Brief'}
        subtitle={pack.brief.subtitle || 'Your morning snapshot. Focus on what moves the needle today.'}
        headerRight={
          <PillButton
            label="Import pack"
            icon="import"
            onPress={() => setImportOpen(true)}
            style={styles.importButton}
          />
        }
      >
        <Panel style={styles.morningCard}>
          <View style={styles.morningTop}>
            <View style={styles.sunIcon}><AssetIcon name="sun" size={31} color={colors.teal} /></View>
            <View style={styles.morningCopy}>
              <Text allowFontScaling={false} style={styles.greeting} numberOfLines={1}>Good morning, {pack.brief.greetingName || 'Alex'}</Text>
              <Text allowFontScaling={false} style={styles.date}>{pack.brief.dateLabel || ''}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text allowFontScaling={false} style={styles.direction}>Today’s direction</Text>

          {(pack.brief.direction || []).map((item) => (
            <DirectionRow key={item.title} icon={item.icon} title={item.title} copy={item.copy} />
          ))}
        </Panel>

        {!featuredHidden ? <BriefFeatureCard item={featuredForCard} onTune={setTuneItem} onAction={onCardAction} /> : null}
        {!buildHidden ? <BuildStatusCard item={pack.buildStatus} mode="brief" onAction={onCardAction} onTune={setTuneItem} onOptions={setOptionsItem} /> : null}
      </AppShell>

      <TuneSheet item={tuneItem} visible={!!tuneItem} onClose={() => setTuneItem(null)} onAction={onCardAction} />
      <ProjectOptionsSheet
        item={optionsItem}
        visible={!!optionsItem}
        onClose={() => setOptionsItem(null)}
        onAction={onCardAction}
        onTune={setTuneItem}
      />
      <ImportDailyPackModal
        visible={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={importFromJson}
        status={importStatus}
      />
    </View>
  );
}

function DirectionRow({ icon, title, copy }) {
  return (
    <View style={styles.directionRow}>
      <View style={styles.directionIcon}><AssetIcon name={icon || 'target'} size={24} color={colors.teal} /></View>
      <View style={styles.directionText}>
        <Text allowFontScaling={false} style={styles.directionTitle} numberOfLines={2}>{title}</Text>
        <Text allowFontScaling={false} style={styles.directionCopy} numberOfLines={2}>{copy}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  importButton: {
    minWidth: 216,
    minHeight: 54,
    paddingHorizontal: 22,
    borderRadius: 22,
  },
  morningCard: {
    padding: 18,
  },
  morningTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  morningCopy: {
    flex: 1,
    minWidth: 0,
  },
  sunIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(0, 91, 76, .22)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  greeting: { color: colors.text, fontSize: 21, lineHeight: 26, fontWeight: '900' },
  date: { color: colors.muted, fontSize: 15.5, lineHeight: 20, marginTop: 5 },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 18 },
  direction: { color: colors.teal, fontSize: 17.5, lineHeight: 22, fontWeight: '900', marginBottom: 15 },
  directionRow: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 14 },
  directionText: { flex: 1, minWidth: 0 },
  directionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 30, 48, .9)',
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  directionTitle: { color: colors.text, fontSize: 16.5, lineHeight: 22, fontWeight: '900' },
  directionCopy: { color: colors.muted, fontSize: 14.5, lineHeight: 20, marginTop: 3 },
});
