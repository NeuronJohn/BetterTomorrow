import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import AssetIcon from './AssetIcon';
import { colors } from '../theme/tokens';

export function PillButton({ label, icon, primary = false, style, onPress }) {
  const tint = primary ? '#061014' : colors.muted;
  return (
    <Pressable onPress={onPress} style={[styles.button, primary ? styles.primary : styles.secondary, style]}>
      {icon ? <AssetIcon name={icon} size={34} color={tint} style={styles.buttonIcon} /> : null}
      <Text style={[styles.text, primary ? styles.primaryText : styles.secondaryText]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>{label}</Text>
    </Pressable>
  );
}

export function MetaPill({ label, style }) {
  return <Text style={[styles.meta, style]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{label}</Text>;
}

const styles = StyleSheet.create({
  button: {
    minHeight: 84,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    gap: 12,
  },
  secondary: { backgroundColor: 'rgba(16, 30, 48, .88)', borderColor: colors.line },
  primary: { backgroundColor: colors.teal, borderColor: colors.teal },
  buttonIcon: { marginTop: 1 },
  text: { fontSize: 17, lineHeight: 22, fontWeight: '900', flexShrink: 1, includeFontPadding: false, textAlign: 'center' },
  secondaryText: { color: colors.muted },
  primaryText: { color: '#061014' },
  meta: {
    minHeight: 46,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(10, 20, 34, .86)',
    color: colors.muted,
    paddingVertical: 11,
    paddingHorizontal: 15,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
    includeFontPadding: false,
  },
});
