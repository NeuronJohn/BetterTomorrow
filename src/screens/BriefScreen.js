import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import AssetIcon from '../components/AssetIcon';
import AppShell from '../components/AppShell';
import { BriefFeatureCard, BuildStatusCard, Panel, TuneSheet } from '../components/Cards';
import ImportDailyPackModal from '../components/ImportDailyPackModal';
import { PillButton } from '../components/Buttons';
import { colors } from '../theme/tokens';

export default function BriefScreen({ activeTab = 'Brief', onNavigate, pack, importFromJson, importStatus }) {
  const [tuneItem, setTuneItem] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <AppShell
        activeTab={activeTab}
        onNavigate={onNavigate}
        title={pack.brief.title || 'Brief'}
        subtitle={pack.brief.subtitle || 'Your morning snapshot. Focus on what moves the needle today.'}
      >
        <Panel style={styles.morningCard}>
          <View style={styles.morningTop}>
            <View style={styles.sunIcon}><AssetIcon name="sun" size={35} color={colors.teal} /></View>
            <View>
              <Text style={styles.greeting}>Good morning, {pack.brief.greetingName || 'Alex'}</Text>
              <Text style={styles.date}>{pack.brief.dateLabel || ''}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.direction}>Today’s direction</Text>

          {(pack.brief.direction || []).map((item) => (
            <DirectionRow key={item.title} icon={item.icon} title={item.title} copy={item.copy} />
          ))}
        </Panel>

        <BriefFeatureCard item={pack.featured} onTune={setTuneItem} />
        <BuildStatusCard item={pack.buildStatus} mode="brief" />
      </AppShell>

      <View pointerEvents="box-none" style={styles.importOverlay}>
        <PillButton
          label="Import pack"
          icon="import"
          onPress={() => setImportOpen(true)}
          style={styles.importButton}
        />
      </View>

      <TuneSheet item={tuneItem} visible={!!tuneItem} onClose={() => setTuneItem(null)} />
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
      <View style={styles.directionIcon}><AssetIcon name={icon || 'target'} size={27} color={colors.teal} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.directionTitle}>{title}</Text>
        <Text style={styles.directionCopy}>{copy}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  importOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 36 : 64,
    right: 20,
    zIndex: 90,
    elevation: 90,
  },
  importButton: {
    minWidth: 216,
    minHeight: 54,
    paddingHorizontal: 22,
    borderRadius: 22,
  },
  morningCard: { padding: 20 },
  morningTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  sunIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(16, 45, 55, .8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: { color: colors.text, fontSize: 23, fontWeight: '900' },
  date: { color: colors.muted, fontSize: 16, marginTop: 6 },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 22 },
  direction: { color: colors.teal, fontSize: 18, fontWeight: '900', marginBottom: 18 },
  directionRow: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 18 },
  directionIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(16, 30, 48, .9)',
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionTitle: { color: colors.text, fontSize: 17.5, lineHeight: 24, fontWeight: '900' },
  directionCopy: { color: colors.muted, fontSize: 15.5, lineHeight: 22, marginTop: 4 },
});
