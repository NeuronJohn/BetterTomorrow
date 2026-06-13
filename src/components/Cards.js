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

export function Panel({ children, style }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

function VideoCardContent({ item, onTune }) {
  return (
    <>
      <View style={styles.videoBody}>
        <View style={styles.videoTextCol}>
          <Text allowFontScaling={false} style={styles.youtubeLabel} numberOfLines={1}>
            {item.label || 'YOUTUBE'}
          </Text>
          <Text allowFontScaling={false} style={styles.videoTitle} numberOfLines={3}>
            {item.title}
          </Text>
          <Text allowFontScaling={false} style={styles.videoDesc} numberOfLines={4}>
            {item.description}
          </Text>
          <View style={styles.timeRow}>
            <AssetIcon name="clock" size={22} color={colors.muted} />
            <MetaPill label={item.duration || '10 min'} style={styles.timePill} />
          </View>
        </View>

        <Pressable onLongPress={() => onTune?.(item)} delayLongPress={450} style={styles.videoThumbFrame}>
          <Image source={getCardThumbSource(item)} resizeMode="cover" style={styles.videoThumb} />
        </Pressable>
      </View>

      <View style={styles.threeActions}>
        <PillButton label="Save" icon="bookmark" style={styles.secondaryAction} />
        <PillButton label="Hide" icon="hide" style={styles.secondaryAction} />
        <PillButton label="Open item" icon="play" primary style={styles.primaryAction} />
      </View>
    </>
  );
}

export function UpdatesFeatureCard({ item, onTune }) {
  return (
    <Panel style={styles.videoPanel}>
      <VideoCardContent item={item} onTune={onTune} />
    </Panel>
  );
}

export function BriefFeatureCard({ item, onTune }) {
  return (
    <Panel style={styles.videoPanel}>
      <VideoCardContent item={item} onTune={onTune} />
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
          <View style={styles.buildTopLine}>
            <Text allowFontScaling={false} style={styles.buildLabel} numberOfLines={1}>{item.label || 'BUILD STATUS'}</Text>
            <Text allowFontScaling={false} style={styles.more}>•••</Text>
          </View>
          <Text allowFontScaling={false} style={styles.buildTitle} numberOfLines={2}>{item.title}</Text>
          <Text allowFontScaling={false} style={styles.buildDescription} numberOfLines={3}>{item.description}</Text>
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
        <Text allowFontScaling={false} style={styles.sheetTitle}>Tune this</Text>
        <Text allowFontScaling={false} style={styles.sheetCopy}>
          Choose what should happen with this suggestion. Future mornings adjust from this.
        </Text>

        <View style={styles.previewRow}>
          <Image source={getCardThumbSource(item)} resizeMode="cover" style={styles.previewThumb} />
          <View style={styles.previewCopy}>
            <Text allowFontScaling={false} style={styles.youtubeLabel} numberOfLines={1}>{item.label || 'YOUTUBE'}</Text>
            <Text allowFontScaling={false} style={styles.previewTitle} numberOfLines={2}>{item.title}</Text>
            <Text allowFontScaling={false} style={styles.previewDesc} numberOfLines={1}>Useful for today’s skill sprint.</Text>
          </View>
        </View>

        <View style={styles.optionGrid}>
          <PillButton label="Save this" icon="bookmark" style={styles.optionButton} />
          <PillButton label="Use today" icon="bolt" style={styles.optionButtonAccent} />
          <PillButton label="Too much" icon="minus" style={styles.optionButton} />
          <PillButton label="Not useful" icon="close" style={styles.optionButton} />
        </View>

        <View style={styles.reason}><Text allowFontScaling={false} style={styles.reasonText}>Optional reason</Text></View>

        <View style={styles.twoActions}>
          <PillButton label="Cancel" onPress={onClose} style={styles.fullAction} />
          <PillButton label="Remember" primary onPress={onClose} style={styles.fullAction} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 28,
    backgroundColor: 'rgba(13, 23, 37, .96)',
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 18,
    overflow: 'hidden',
  },

  videoPanel: { padding: 18 },
  videoBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 160,
  },
  videoTextCol: {
    flex: 1,
    minWidth: 0,
    gap: 8,
    justifyContent: 'center',
  },
  youtubeLabel: {
    color: colors.coral,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '900',
    letterSpacing: .4,
    includeFontPadding: false,
  },
  videoTitle: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
    includeFontPadding: false,
  },
  videoDesc: {
    color: colors.muted,
    fontSize: 14.5,
    lineHeight: 20,
    includeFontPadding: false,
  },
  videoThumbFrame: {
    width: 156,
    height: 88,
    flexShrink: 0,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: '#07111D',
    overflow: 'hidden',
  },
  videoThumb: {
    width: '100%',
    height: '100%',
  },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timePill: { alignSelf: 'flex-start', paddingLeft: 8 },

  threeActions: {
    minHeight: 64,
    flexDirection: 'row',
    gap: 12,
    paddingTop: 18,
    paddingHorizontal: 8,
  },
  twoActions: {
    minHeight: 64,
    flexDirection: 'row',
    gap: 12,
    paddingTop: 18,
    paddingHorizontal: 8,
  },
  secondaryAction: { flex: 1.08, minWidth: 0 },
  primaryAction: { flex: 2.05, minWidth: 0 },
  fullAction: { flex: 1, minWidth: 0 },

  buildPanel: { padding: 18 },
  buildBody: { flexDirection: 'row', gap: 18, alignItems: 'center', minHeight: 118 },
  buildThumb: {
    width: 146,
    height: 82,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: '#07111D',
  },
  buildText: { flex: 1, minWidth: 0, paddingRight: 2 },
  buildTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  buildLabel: { color: colors.gold, fontSize: 13, lineHeight: 17, fontWeight: '900', letterSpacing: .3, includeFontPadding: false },
  more: { color: colors.muted, fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  buildTitle: { color: colors.text, fontSize: 19.5, lineHeight: 25, fontWeight: '900', marginTop: 10, includeFontPadding: false },
  buildDescription: { color: colors.muted, fontSize: 14.5, lineHeight: 21, marginTop: 8, includeFontPadding: false },

  sheetLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingBottom: 122,
    zIndex: 30,
  },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.25)' },
  sheet: {
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 26,
    paddingTop: 20,
    paddingBottom: 26,
    backgroundColor: 'rgba(13, 23, 37, .995)',
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  handle: {
    alignSelf: 'center',
    width: 82,
    height: 7,
    borderRadius: 99,
    backgroundColor: '#607189',
    marginBottom: 22,
  },
  sheetTitle: { color: colors.text, fontSize: 34, lineHeight: 40, fontWeight: '900', includeFontPadding: false },
  sheetCopy: { color: colors.muted, fontSize: 15.5, lineHeight: 23, marginTop: 12, marginBottom: 22, includeFontPadding: false },
  previewRow: {
    minHeight: 138,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(16, 30, 48, .82)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  previewThumb: { width: 136, aspectRatio: 16 / 9, borderRadius: 16, backgroundColor: '#07111D' },
  previewCopy: { flex: 1, minWidth: 0, paddingRight: 2 },
  previewTitle: { color: colors.text, fontSize: 17, lineHeight: 22, fontWeight: '900', marginTop: 7, includeFontPadding: false },
  previewDesc: { color: colors.muted, fontSize: 13.5, lineHeight: 18, marginTop: 7, includeFontPadding: false },
  optionGrid: { minHeight: 184, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14, marginBottom: 18 },
  optionButton: { width: '47.2%', minWidth: 0 },
  optionButtonAccent: { width: '47.2%', borderColor: colors.teal, minWidth: 0 },
  reason: {
    minHeight: 74,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(5, 10, 17, .86)',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  reasonText: { color: colors.dim, fontSize: 15, lineHeight: 19, includeFontPadding: false },
});
