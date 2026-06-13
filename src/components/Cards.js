import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { thumbnails } from '../data/assets';
import { colors } from '../theme/tokens';
import AssetIcon from './AssetIcon';
import { MetaPill, PillButton } from './Buttons';

export function getThumbSource(item) {
  if (item?.thumbnailUrl) return { uri: item.thumbnailUrl };
  return thumbnails[item?.thumbnailKey] || thumbnails.ticketTracker;
}

function getCardThumbSource(item) {
  if (item?.thumbnailKey === 'ticketTracker') return thumbnails.ticketTrackerCard;
  return getThumbSource(item);
}
export function Panel({ children, style }) { return <View style={[styles.panel, style]}>{children}</View>; }

export function UpdatesFeatureCard({ item, onTune }) {
  return (
    <Panel style={styles.featurePanel}>
      <Pressable onLongPress={() => onTune?.(item)} delayLongPress={450}>
        <Image source={getCardThumbSource(item)} resizeMode="cover" style={styles.featureThumb} />
      </Pressable>
      <View style={styles.featureInfoRow}>
        <View style={styles.featureMetaCol}>
          <Text allowFontScaling={false} style={styles.youtubeLabel} numberOfLines={1}>{item.label || 'YOUTUBE'}</Text>
          <View style={styles.timeRow}><AssetIcon name="clock" size={24} color={colors.muted} /><MetaPill label={item.duration || '10 min'} style={styles.timePill} /></View>
        </View>
        <View style={styles.featureCopyCol}>
          <Text allowFontScaling={false} style={styles.featureTitle} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.82}>{item.title}</Text>
          <Text allowFontScaling={false} style={styles.featureDescription} numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.78}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.threeActions}>
        <PillButton label="Save" icon="bookmark" style={styles.secondaryAction} />
        <PillButton label="Hide" icon="hide" style={styles.secondaryAction} />
        <PillButton label="Open item" icon="play" primary style={styles.primaryAction} />
      </View>
    </Panel>
  );
}

export function BriefFeatureCard({ item, onTune }) {
  return (
    <Panel style={styles.briefFeaturePanel}>
      <View style={styles.briefFeatureBody}>
        <View style={styles.briefFeatureText}>
          <Text allowFontScaling={false} style={styles.youtubeLabel} numberOfLines={1}>{item.label || 'YOUTUBE'}</Text>
          <Text allowFontScaling={false} style={styles.briefFeatureTitle} numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.78}>{item.title}</Text>
          <Text allowFontScaling={false} style={styles.briefFeatureDescription} numberOfLines={4} adjustsFontSizeToFit minimumFontScale={0.74}>{item.description}</Text>
          <View style={styles.timeRow}><AssetIcon name="clock" size={24} color={colors.muted} /><MetaPill label={item.duration || '10 min'} style={styles.briefTimePill} /></View>
        </View>
        <Pressable onLongPress={() => onTune?.(item)} delayLongPress={450} style={styles.briefThumbWrap}>
          <Image source={getCardThumbSource(item)} resizeMode="cover" style={styles.briefThumb} />
        </Pressable>
      </View>
      <View style={styles.threeActions}>
        <PillButton label="Save" icon="bookmark" style={styles.secondaryAction} />
        <PillButton label="Hide" icon="hide" style={styles.secondaryAction} />
        <PillButton label="Open item" icon="play" primary style={styles.primaryAction} />
      </View>
    </Panel>
  );
}

export function BuildStatusCard({ item, mode = 'updates' }) {
  const brief = mode === 'brief';
  return (
    <Panel style={styles.buildPanel}>
      <View style={styles.buildBody}>
        <Image source={getThumbSource(item)} resizeMode="cover" style={styles.buildThumb} />
        <View style={styles.buildText}>
          <View style={styles.buildTopLine}><Text allowFontScaling={false} style={styles.buildLabel} numberOfLines={1}>{item.label || 'BUILD STATUS'}</Text><Text allowFontScaling={false} style={styles.more}>•••</Text></View>
          <Text allowFontScaling={false} style={styles.buildTitle} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.78}>{item.title}</Text>
          <Text allowFontScaling={false} style={styles.buildDescription} numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.74}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.twoActions}>
        <PillButton label={brief ? 'View progress' : 'Save'} icon={brief ? 'trend' : 'bookmark'} style={styles.fullAction} />
        <PillButton label={brief ? 'See details' : 'Hide'} icon={brief ? 'eye' : 'hide'} style={styles.fullAction} />
      </View>
    </Panel>
  );
}

export function TuneSheet({ item, visible, onClose }) {
  if (!visible || !item) return null;
  return (
    <View style={styles.sheetLayer} pointerEvents="box-none">
      <View style={styles.scrim} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Tune this</Text>
        <Text style={styles.sheetCopy}>Choose what should happen with this suggestion. Future mornings adjust from this.</Text>
        <View style={styles.previewRow}>
          <Image source={getThumbSource(item)} resizeMode="cover" style={styles.previewThumb} />
          <View style={styles.previewCopy}>
            <Text allowFontScaling={false} style={styles.youtubeLabel} numberOfLines={1}>{item.label || 'YOUTUBE'}</Text>
            <Text style={styles.previewTitle} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.78}>{item.title}</Text>
            <Text style={styles.previewDesc} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.74}>Useful for today’s skill sprint.</Text>
          </View>
        </View>
        <View style={styles.optionGrid}>
          <PillButton label="Save this" icon="bookmark" style={styles.optionButton} />
          <PillButton label="Use today" icon="bolt" style={styles.optionButtonAccent} />
          <PillButton label="Too much" icon="minus" style={styles.optionButton} />
          <PillButton label="Not useful" icon="close" style={styles.optionButton} />
        </View>
        <View style={styles.reason}><Text style={styles.reasonText}>Optional reason</Text></View>
        <View style={styles.twoActions}>
          <PillButton label="Cancel" onPress={onClose} style={styles.fullAction} />
          <PillButton label="Remember" primary onPress={onClose} style={styles.fullAction} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: 28, backgroundColor: 'rgba(13, 23, 37, .96)', borderWidth: 1, borderColor: colors.line, marginBottom: 18, overflow: 'hidden' },
  featurePanel: { padding: 22 },
  featureThumb: { width: '100%', aspectRatio: 16 / 9, borderRadius: 22, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: '#07111D' },
  featureInfoRow: { flexDirection: 'row', gap: 20, paddingTop: 22, alignItems: 'center', minHeight: 132 },
  featureMetaCol: { width: 145, gap: 14, paddingLeft: 2 },
  featureCopyCol: { flex: 1, minWidth: 0, justifyContent: 'center', paddingRight: 2 },
  youtubeLabel: { color: colors.coral, fontSize: 13, lineHeight: 17, fontWeight: '900', letterSpacing: .4, includeFontPadding: false },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timePill: { alignSelf: 'flex-start', paddingLeft: 8 },
  featureTitle: { color: colors.text, fontSize: 20.5, lineHeight: 27, fontWeight: '900', includeFontPadding: false },
  featureDescription: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 10, includeFontPadding: false },
  threeActions: { minHeight: 64, flexDirection: 'row', gap: 10, paddingTop: 16 },
  twoActions: { minHeight: 64, flexDirection: 'row', gap: 12, paddingTop: 18 },
  secondaryAction: { flex: 1.08, minWidth: 0 },
  primaryAction: { flex: 1.72, minWidth: 0 },
  fullAction: { flex: 1, minWidth: 0 },
  briefFeaturePanel: { padding: 22 },
  briefFeatureBody: { flexDirection: 'row', gap: 20, alignItems: 'center', minHeight: 250 },
  briefFeatureText: { width: '36%', gap: 10, minWidth: 0, justifyContent: 'center', paddingRight: 2 },
  briefFeatureTitle: { color: colors.text, fontSize: 18.5, lineHeight: 24, fontWeight: '900', includeFontPadding: false, flexShrink: 1 },
  briefFeatureDescription: { color: colors.muted, fontSize: 13.5, lineHeight: 20, includeFontPadding: false, flexShrink: 1 },
  briefTimePill: { alignSelf: 'flex-start', paddingLeft: 8 },
  briefThumbWrap: { flex: 1, position: 'relative', minWidth: 0, marginLeft: 2 },
  briefThumb: { width: '100%', aspectRatio: 16 / 9, borderRadius: 18, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: '#07111D' },
  buildPanel: { padding: 22 },
  buildBody: { flexDirection: 'row', gap: 18, alignItems: 'flex-start', minHeight: 150 },
  buildThumb: { width: 152, aspectRatio: 16 / 9, borderRadius: 17, borderWidth: 1, borderColor: colors.lineStrong },
  buildText: { flex: 1, minWidth: 0, paddingRight: 2 },
  buildTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  buildLabel: { color: colors.gold, fontSize: 13, lineHeight: 17, fontWeight: '900', letterSpacing: .3, includeFontPadding: false },
  more: { color: colors.muted, fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  buildTitle: { color: colors.text, fontSize: 19.5, lineHeight: 25, fontWeight: '900', marginTop: 10, includeFontPadding: false },
  buildDescription: { color: colors.muted, fontSize: 14.5, lineHeight: 21, marginTop: 8, includeFontPadding: false },
  sheetLayer: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', paddingBottom: 122, zIndex: 30 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.25)' },
  sheet: { borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingHorizontal: 26, paddingTop: 20, paddingBottom: 26, backgroundColor: 'rgba(13, 23, 37, .995)', borderWidth: 1, borderColor: colors.lineStrong },
  handle: { alignSelf: 'center', width: 82, height: 7, borderRadius: 99, backgroundColor: '#607189', marginBottom: 22 },
  sheetTitle: { color: colors.text, fontSize: 34, lineHeight: 40, fontWeight: '900', includeFontPadding: false },
  sheetCopy: { color: colors.muted, fontSize: 15.5, lineHeight: 23, marginTop: 12, marginBottom: 22, includeFontPadding: false },
  previewRow: { minHeight: 138, borderRadius: 23, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(16, 30, 48, .82)', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  previewThumb: { width: 136, aspectRatio: 16 / 9, borderRadius: 16 },
  previewCopy: { flex: 1, minWidth: 0, paddingRight: 2 },
  previewTitle: { color: colors.text, fontSize: 17, lineHeight: 22, fontWeight: '900', marginTop: 7, includeFontPadding: false },
  previewDesc: { color: colors.muted, fontSize: 13.5, lineHeight: 18, marginTop: 7, includeFontPadding: false },
  optionGrid: { minHeight: 184, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14, marginBottom: 18 },
  optionButton: { width: '47.2%', minWidth: 0 },
  optionButtonAccent: { width: '47.2%', borderColor: colors.teal, minWidth: 0 },
  reason: { minHeight: 74, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(5, 10, 17, .86)', justifyContent: 'center', paddingHorizontal: 20, marginBottom: 16 },
  reasonText: { color: colors.dim, fontSize: 15, lineHeight: 19, includeFontPadding: false },
});
