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

export function getCardThumbSource(item) {
  if (item?.thumbnailUrl) return { uri: item.thumbnailUrl };
  if (item?.thumbnailKey === 'ticketTracker') return thumbnails.ticketTrackerCard || thumbnails.ticketTracker;
  return getThumbSource(item);
}

function imageMode(item) {
  return item?.thumbnailResizeMode || 'cover';
}

export function Panel({ children, style }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

function ActionRow({ primaryLabel = 'Open item' }) {
  return (
    <View style={styles.actionRow}>
      <PillButton label="Save" icon="bookmark" style={styles.secondaryAction} />
      <PillButton label="Hide" icon="hide" style={styles.secondaryAction} />
      <PillButton label={primaryLabel} icon="play" primary style={styles.primaryAction} />
    </View>
  );
}

function Thumb({ item, style, imageStyle }) {
  return (
    <Image
      source={getCardThumbSource(item)}
      resizeMode={imageMode(item)}
      style={[styles.thumbImage, imageStyle]}
    />
  );
}

function MainFocusMediaCard({ item, onTune }) {
  const aspectRatio = Number(item?.thumbnailAspectRatio) || 16 / 9;

  return (
    <Panel style={styles.mainMediaPanel}>
      <Pressable
        onLongPress={() => onTune?.(item)}
        delayLongPress={450}
        style={[styles.mainThumbFrame, { aspectRatio }]}
      >
        <Thumb item={item} />
      </Pressable>

      <View style={styles.mainInfoRow}>
        <View style={styles.mainMetaCol}>
          <Text allowFontScaling={false} style={styles.youtubeLabel} numberOfLines={1}>
            {item.label || 'YOUTUBE'}
          </Text>
          <View style={styles.timeRow}>
            <AssetIcon name="clock" size={21} color={colors.muted} />
            <MetaPill label={item.duration || '10 min'} style={styles.timePill} />
          </View>
        </View>

        <View style={styles.copyCol}>
          <Text allowFontScaling={false} style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text allowFontScaling={false} style={styles.cardDescription} numberOfLines={3}>
            {item.description}
          </Text>
        </View>
      </View>

      <ActionRow />
    </Panel>
  );
}

function SmallMediaCard({ item, onTune }) {
  return (
    <Panel style={styles.smallMediaPanel}>
      <View style={styles.smallBody}>
        <View style={styles.smallTextCol}>
          <Text allowFontScaling={false} style={styles.youtubeLabel} numberOfLines={1}>
            {item.label || 'YOUTUBE'}
          </Text>
          <Text allowFontScaling={false} style={styles.cardTitle} numberOfLines={3}>
            {item.title}
          </Text>
          <Text allowFontScaling={false} style={styles.cardDescription} numberOfLines={4}>
            {item.description}
          </Text>
          <View style={styles.timeRow}>
            <AssetIcon name="clock" size={21} color={colors.muted} />
            <MetaPill label={item.duration || '10 min'} style={styles.timePill} />
          </View>
        </View>

        <Pressable
          onLongPress={() => onTune?.(item)}
          delayLongPress={450}
          style={styles.smallThumbFrame}
        >
          <Thumb item={item} />
        </Pressable>
      </View>

      <ActionRow />
    </Panel>
  );
}

export function UpdatesFeatureCard({ item, onTune }) {
  const size = item?.updatesThumbnailSize || item?.thumbnailSize || 'main';
  if (size === 'small') return <SmallMediaCard item={item} onTune={onTune} />;
  return <MainFocusMediaCard item={item} onTune={onTune} />;
}

export function BriefFeatureCard({ item, onTune }) {
  const size = item?.briefThumbnailSize || 'small';
  if (size === 'main') return <MainFocusMediaCard item={item} onTune={onTune} />;
  return <SmallMediaCard item={item} onTune={onTune} />;
}

export function BuildStatusCard({ item, mode = 'updates' }) {
  const brief = mode === 'brief';
  return (
    <Panel style={styles.buildPanel}>
      <View style={styles.buildBody}>
        <View style={styles.buildThumbFrame}>
          <Image source={getThumbSource(item)} resizeMode={item?.thumbnailResizeMode || 'cover'} style={styles.thumbImage} />
        </View>

        <View style={styles.buildText}>
          <View style={styles.buildTopLine}>
            <Text allowFontScaling={false} style={styles.buildLabel} numberOfLines={1}>
              {item.label || 'BUILD STATUS'}
            </Text>
            <Text allowFontScaling={false} style={styles.more}>•••</Text>
          </View>
          <Text allowFontScaling={false} style={styles.buildTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text allowFontScaling={false} style={styles.buildDescription} numberOfLines={3}>
            {item.description}
          </Text>
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
          <View style={styles.previewThumbFrame}>
            <Thumb item={item} />
          </View>
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

  mainMediaPanel: {
    padding: 16,
  },
  mainThumbFrame: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: '#07111D',
    overflow: 'hidden',
  },
  mainInfoRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    paddingTop: 14,
    minHeight: 96,
  },
  mainMetaCol: {
    width: 112,
    gap: 11,
    minWidth: 0,
  },

  smallMediaPanel: {
    padding: 16,
  },
  smallBody: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    minHeight: 162,
  },
  smallTextCol: {
    flex: 1,
    minWidth: 0,
    gap: 8,
    justifyContent: 'center',
  },
  smallThumbFrame: {
    width: '46%',
    aspectRatio: 16 / 9,
    flexShrink: 0,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: '#07111D',
    overflow: 'hidden',
  },

  thumbImage: {
    width: '100%',
    height: '100%',
  },
  copyCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },

  youtubeLabel: {
    color: colors.coral,
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '900',
    letterSpacing: .35,
    includeFontPadding: false,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18.5,
    lineHeight: 23,
    fontWeight: '900',
    includeFontPadding: false,
  },
  cardDescription: {
    color: colors.muted,
    fontSize: 13.8,
    lineHeight: 19,
    includeFontPadding: false,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timePill: {
    alignSelf: 'flex-start',
    paddingLeft: 8,
  },

  actionRow: {
    minHeight: 60,
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  twoActions: {
    minHeight: 60,
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  secondaryAction: { flex: 1.08, minWidth: 0 },
  primaryAction: { flex: 2.08, minWidth: 0 },
  fullAction: { flex: 1, minWidth: 0 },

  buildPanel: {
    padding: 16,
  },
  buildBody: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    minHeight: 102,
  },
  buildThumbFrame: {
    width: '43%',
    aspectRatio: 16 / 9,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: '#07111D',
    flexShrink: 0,
    overflow: 'hidden',
  },
  buildText: {
    flex: 1,
    minWidth: 0,
    paddingRight: 2,
  },
  buildTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  buildLabel: {
    color: colors.gold,
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '900',
    letterSpacing: .3,
    includeFontPadding: false,
  },
  more: {
    color: colors.muted,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 2,
  },
  buildTitle: {
    color: colors.text,
    fontSize: 18.8,
    lineHeight: 24,
    fontWeight: '900',
    marginTop: 9,
    includeFontPadding: false,
  },
  buildDescription: {
    color: colors.muted,
    fontSize: 13.8,
    lineHeight: 19.5,
    marginTop: 7,
    includeFontPadding: false,
  },

  sheetLayer: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', paddingBottom: 122, zIndex: 30 },
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
  handle: { alignSelf: 'center', width: 82, height: 7, borderRadius: 99, backgroundColor: '#607189', marginBottom: 22 },
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
  previewThumbFrame: { width: 136, aspectRatio: 16 / 9, borderRadius: 16, backgroundColor: '#07111D', overflow: 'hidden' },
  previewCopy: { flex: 1, minWidth: 0, paddingRight: 2 },
  previewTitle: { color: colors.text, fontSize: 17, lineHeight: 22, fontWeight: '900', marginTop: 7, includeFontPadding: false },
  previewDesc: { color: colors.muted, fontSize: 13.5, lineHeight: 18, marginTop: 7, includeFontPadding: false },
  optionGrid: { minHeight: 184, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14, marginBottom: 18 },
  optionButton: { width: '47.2%', minWidth: 0 },
  optionButtonAccent: { width: '47.2%', borderColor: colors.teal, minWidth: 0 },
  reason: { minHeight: 74, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(5, 10, 17, .86)', justifyContent: 'center', paddingHorizontal: 20, marginBottom: 16 },
  reasonText: { color: colors.dim, fontSize: 15, lineHeight: 19, includeFontPadding: false },
});
