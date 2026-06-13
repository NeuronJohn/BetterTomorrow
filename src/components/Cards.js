import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { thumbnails } from '../data/assets';
import { colors } from '../theme/tokens';
import AssetIcon from './AssetIcon';
import { PillButton } from './Buttons';

export function getThumbSource(item) {
  if (item?.thumbnailUrl) return { uri: item.thumbnailUrl };
  return thumbnails[item?.thumbnailKey] || thumbnails.ticketTracker;
}

export function getCardThumbSource(item) {
  if (item?.thumbnailUrl) return { uri: item.thumbnailUrl };
  if (item?.thumbnailKey === 'ticketTracker') return thumbnails.ticketTrackerCard || thumbnails.ticketTracker;
  return getThumbSource(item);
}

function resizeMode(item) {
  return item?.thumbnailResizeMode || 'cover';
}

function mainAspectRatio(item) {
  const value = Number(item?.thumbnailAspectRatio);
  return Math.max(value || 2.15, 2.0);
}

export function Panel({ children, style }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

function ThumbFrame({ item, style }) {
  return (
    <View style={[styles.thumbFrameBase, style]}>
      <Image source={getCardThumbSource(item)} resizeMode={resizeMode(item)} style={styles.thumbImage} />
    </View>
  );
}

function PressableThumbFrame({ item, onTune, onAction, style }) {
  return (
    <Pressable
      onPress={() => onAction?.('open', item)}
      onLongPress={() => onTune?.(item)}
      delayLongPress={450}
      style={[styles.thumbFrameBase, style]}
    >
      <Image source={getCardThumbSource(item)} resizeMode={resizeMode(item)} style={styles.thumbImage} />
    </Pressable>
  );
}

function TimePill({ label }) {
  return (
    <View style={styles.timePill}>
      <AssetIcon name="clock" size={16} color={colors.muted} />
      <Text allowFontScaling={false} numberOfLines={1} style={styles.timePillText}>
        {label || '10 min'}
      </Text>
    </View>
  );
}

function ActionRow({ item, onAction, primaryLabel = 'Open item' }) {
  const saved = !!item?.saved;

  return (
    <View style={styles.actionRow}>
      <PillButton
        label={saved ? 'Saved' : 'Save'}
        icon="bookmark"
        accentText={saved}
        onPress={() => onAction?.(saved ? 'unsave' : 'save', item)}
        style={[styles.tightButton, styles.secondaryAction]}
      />
      <PillButton
        label="Hide"
        icon="hide"
        onPress={() => onTune?.(item)}
        style={[styles.tightButton, styles.secondaryAction]}
      />
      <PillButton
        label={primaryLabel}
        icon="play"
        primary
        onPress={() => onAction?.('open', item)}
        style={[styles.tightButton, styles.primaryAction]}
      />
    </View>
  );
}

function MetaChipRow({ item }) {
  return (
    <View style={styles.metaChipRow}>
      <Text allowFontScaling={false} style={styles.label} numberOfLines={1}>{item.label || 'UPDATE'}</Text>
      <TimePill label={item.duration || '10 min'} />
      {item.category ? (
        <View style={styles.categoryInline}>
          <AssetIcon name="tag" size={15} color={colors.muted} />
          <Text allowFontScaling={false} style={styles.categoryText} numberOfLines={1}>{item.category}</Text>
        </View>
      ) : null}
    </View>
  );
}

function MainFocusCard({ item, onTune, onAction }) {
  return (
    <Panel style={styles.mainCard}>
      <PressableThumbFrame item={item} onTune={onTune} onAction={onAction} style={[styles.mainThumb, { aspectRatio: mainAspectRatio(item) }]} />
      <View style={styles.mainCopyBlock}>
        <MetaChipRow item={item} />
        <Text allowFontScaling={false} style={styles.mainTitle} numberOfLines={2}>{item.title}</Text>
        <Text allowFontScaling={false} style={styles.mainDescription} numberOfLines={2}>{item.description}</Text>
      </View>
      <ActionRow item={item} onAction={onAction} />
    </Panel>
  );
}

function CompactFocusCard({ item, onTune, onAction }) {
  return (
    <Panel style={styles.compactCard}>
      <View style={styles.compactTop}>
        <View style={styles.compactCopy}>
          <Text allowFontScaling={false} style={styles.label} numberOfLines={1}>{item.label || 'UPDATE'}</Text>
          <Text allowFontScaling={false} style={styles.compactTitle} numberOfLines={3}>{item.title}</Text>
          <Text allowFontScaling={false} style={styles.compactDescription} numberOfLines={3}>{item.description}</Text>
          <TimePill label={item.duration || '10 min'} />
        </View>
        <PressableThumbFrame item={item} onTune={onTune} onAction={onAction} style={styles.compactThumb} />
      </View>
      <ActionRow item={item} onAction={onAction} />
    </Panel>
  );
}

export function UpdatesFeatureCard({ item, onTune, onAction }) {
  const style = item?.updatesCardStyle || item?.cardStyle || item?.thumbnailSize || 'main';
  if (style === 'small' || style === 'compact') return <CompactFocusCard item={item} onTune={onTune} onAction={onAction} />;
  return <MainFocusCard item={item} onTune={onTune} onAction={onAction} />;
}

export function BriefFeatureCard({ item, onTune, onAction }) {
  const style = item?.briefCardStyle || item?.briefThumbnailSize || 'compact';
  if (style === 'main') return <MainFocusCard item={item} onTune={onTune} onAction={onAction} />;
  return <CompactFocusCard item={item} onTune={onTune} onAction={onAction} />;
}

export function BuildStatusCard({ item, mode = 'updates', onAction, onTune }) {
  const brief = mode === 'brief';
  const saved = !!item?.saved;

  return (
    <Panel style={styles.buildCard}>
      <View style={styles.buildTop}>
        <ThumbFrame item={item} style={styles.buildThumb} />
        <View style={styles.buildCopy}>
          <View style={styles.buildLabelRow}>
            <Text allowFontScaling={false} style={styles.buildLabel} numberOfLines={1}>{item.label || 'BUILD STATUS'}</Text>
            <Text allowFontScaling={false} style={styles.more}>•••</Text>
          </View>
          <Text allowFontScaling={false} style={styles.buildTitle} numberOfLines={2}>{item.title}</Text>
          <Text allowFontScaling={false} style={styles.buildDescription} numberOfLines={3}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.twoActions}>
        <PillButton
          label={brief ? 'View progress' : saved ? 'Saved' : 'Save'}
          icon={brief ? 'trend' : 'bookmark'}
          accentText={brief || saved}
          onPress={() => onAction?.(brief ? 'progress' : saved ? 'unsave' : 'save', item)}
          style={[styles.tightButton, styles.fullAction]}
        />
        <PillButton
          label={brief ? 'See details' : 'Hide'}
          icon={brief ? 'eye' : 'hide'}
          accentText={brief}
          onPress={() => brief ? onAction?.('details', item) : onTune?.(item)}
          style={[styles.tightButton, styles.fullAction]}
        />
      </View>
    </Panel>
  );
}

export function TuneSheet({ item, visible, onClose, onAction }) {
  if (!visible || !item) return null;
  function doAction(action) { onAction?.(action, item); onClose?.(); }
  return (
    <View style={styles.sheetLayer} pointerEvents="box-none">
      <View style={styles.scrim} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text allowFontScaling={false} style={styles.sheetTitle}>Tune this</Text>
        <Text allowFontScaling={false} style={styles.sheetCopy}>Choose what should happen with this suggestion. Future mornings adjust from this.</Text>
        <View style={styles.previewRow}>
          <ThumbFrame item={item} style={styles.previewThumb} />
          <View style={styles.previewCopy}>
            <Text allowFontScaling={false} style={styles.label} numberOfLines={1}>{item.label || 'UPDATE'}</Text>
            <Text allowFontScaling={false} style={styles.previewTitle} numberOfLines={2}>{item.title}</Text>
            <Text allowFontScaling={false} style={styles.previewDesc} numberOfLines={1}>Useful for today’s skill sprint.</Text>
          </View>
        </View>
        <View style={styles.optionGrid}>
          <PillButton label={item?.saved ? 'Saved' : 'Save this'} icon="bookmark" accentText={!!item?.saved} onPress={() => doAction(item?.saved ? 'unsave' : 'save')} style={styles.optionButton} />
          <PillButton label="Use today" icon="bolt" onPress={() => doAction('open')} style={styles.optionButtonAccent} />
          <PillButton label="Too much" icon="minus" onPress={() => doAction('hide')} style={styles.optionButton} />
          <PillButton label="Not useful" icon="close" onPress={() => doAction('hide')} style={styles.optionButton} />
        </View>
        <View style={styles.reason}><Text allowFontScaling={false} style={styles.reasonText}>Optional reason</Text></View>
        <View style={styles.twoActions}>
          <PillButton label="Cancel" onPress={onClose} style={[styles.tightButton, styles.fullAction]} />
          <PillButton label="Remember" primary onPress={() => doAction('save')} style={[styles.tightButton, styles.fullAction]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: 28, backgroundColor: 'rgba(13, 23, 37, .96)', borderWidth: 1, borderColor: colors.line, marginBottom: 18, overflow: 'hidden' },
  thumbFrameBase: { borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: '#07111D', overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%' },
  mainCard: { padding: 14 },
  mainThumb: { width: '100%', borderRadius: 21 },
  mainCopyBlock: { paddingTop: 11, gap: 7 },
  metaChipRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  categoryInline: { flexDirection: 'row', alignItems: 'center', gap: 5, maxWidth: 150 },
  categoryText: { color: colors.muted, fontSize: 12.5, lineHeight: 16, fontWeight: '800' },
  mainTitle: { color: colors.text, fontSize: 18.2, lineHeight: 22.5, fontWeight: '900', includeFontPadding: false },
  mainDescription: { color: colors.muted, fontSize: 13.6, lineHeight: 18.8, includeFontPadding: false },
  compactCard: { padding: 14 },
  compactTop: { flexDirection: 'row', alignItems: 'center', gap: 13, minHeight: 142 },
  compactCopy: { flex: 1, minWidth: 0, gap: 7, justifyContent: 'center' },
  compactThumb: { width: '56%', aspectRatio: 16 / 9, borderRadius: 19, flexShrink: 0 },
  compactTitle: { color: colors.text, fontSize: 17.5, lineHeight: 22, fontWeight: '900', includeFontPadding: false },
  compactDescription: { color: colors.muted, fontSize: 13.4, lineHeight: 18.6, includeFontPadding: false },
  label: { color: colors.coral, fontSize: 12.1, lineHeight: 15.5, fontWeight: '900', letterSpacing: .35, includeFontPadding: false },
  timePill: {
    alignSelf: 'flex-start',
    minHeight: 34,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(10, 20, 34, .86)',
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  timePillText: { color: colors.muted, fontSize: 13.6, lineHeight: 17, fontWeight: '800', includeFontPadding: false },
  actionRow: { minHeight: 52, flexDirection: 'row', gap: 10, paddingTop: 11, paddingHorizontal: 7 },
  twoActions: { minHeight: 52, flexDirection: 'row', gap: 10, paddingTop: 11, paddingHorizontal: 7 },
  tightButton: { minHeight: 52, borderRadius: 18, paddingHorizontal: 12 },
  secondaryAction: { flex: 1.25, minWidth: 0 },
  primaryAction: { flex: 1.65, minWidth: 0 },
  fullAction: { flex: 1, minWidth: 0 },
  buildCard: { padding: 14 },
  buildTop: { flexDirection: 'row', gap: 14, alignItems: 'center', minHeight: 106 },
  buildThumb: { width: '51%', aspectRatio: 16 / 9, borderRadius: 18, flexShrink: 0 },
  buildCopy: { flex: 1, minWidth: 0, justifyContent: 'center' },
  buildLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buildLabel: { color: colors.gold, fontSize: 12.3, lineHeight: 15.5, fontWeight: '900', letterSpacing: .3, includeFontPadding: false, flex: 1 },
  more: { color: colors.muted, fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  buildTitle: { color: colors.text, fontSize: 17.6, lineHeight: 22, fontWeight: '900', marginTop: 7, includeFontPadding: false },
  buildDescription: { color: colors.muted, fontSize: 13.4, lineHeight: 18.5, marginTop: 6, includeFontPadding: false },
  sheetLayer: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', paddingBottom: 122, zIndex: 30 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.25)' },
  sheet: { borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingHorizontal: 26, paddingTop: 20, paddingBottom: 26, backgroundColor: 'rgba(13, 23, 37, .995)', borderWidth: 1, borderColor: colors.lineStrong },
  handle: { alignSelf: 'center', width: 82, height: 7, borderRadius: 99, backgroundColor: '#607189', marginBottom: 22 },
  sheetTitle: { color: colors.text, fontSize: 34, lineHeight: 40, fontWeight: '900', includeFontPadding: false },
  sheetCopy: { color: colors.muted, fontSize: 15.5, lineHeight: 23, marginTop: 12, marginBottom: 22 },
  previewRow: { minHeight: 126, borderRadius: 23, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(16, 30, 48, .82)', padding: 13, flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 20 },
  previewThumb: { width: 142, aspectRatio: 16 / 9, borderRadius: 16 },
  previewCopy: { flex: 1, minWidth: 0, paddingRight: 2 },
  previewTitle: { color: colors.text, fontSize: 16.5, lineHeight: 21, fontWeight: '900', marginTop: 7 },
  previewDesc: { color: colors.muted, fontSize: 13.2, lineHeight: 17.5, marginTop: 7 },
  optionGrid: { minHeight: 184, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14, marginBottom: 18 },
  optionButton: { width: '47.2%', minWidth: 0 },
  optionButtonAccent: { width: '47.2%', borderColor: colors.teal, minWidth: 0 },
  reason: { minHeight: 74, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(5, 10, 17, .86)', justifyContent: 'center', paddingHorizontal: 20, marginBottom: 16 },
  reasonText: { color: colors.dim, fontSize: 15, lineHeight: 19 },
});
