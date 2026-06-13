import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import AssetIcon from './AssetIcon';
import { colors } from '../theme/tokens';

export function PillButton({ label, icon, primary = false, style, onPress }) {
  const tint = primary ? '#061014' : colors.muted;
  return (
    <Pressable onPress={onPress} style={[styles.button, primary ? styles.primary : styles.secondary, style]}>
      {icon ? <AssetIcon name={icon} size={22} color={tint} style={styles.buttonIcon} /> : null}
      <Text
        style={[styles.text, primary ? styles.primaryText : styles.secondaryText]}
        numberOfLines={1}
        allowFontScaling={false}
        maxFontSizeMultiplier={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function MetaPill({ label, style }) {
  return (
    <Text
      style={[styles.meta, style]}
      numberOfLines={1}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 60,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    gap: 7,
  },
  secondary: { backgroundColor: 'rgba(16, 30, 48, .88)', borderColor: colors.line },
  primary: { backgroundColor: colors.teal, borderColor: colors.teal },
  buttonIcon: { marginTop: 0 },
  text: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    includeFontPadding: false,
    textAlign: 'center',
    flexShrink: 0,
  },
  secondaryText: { color: colors.muted },
  primaryText: { color: '#061014' },
  meta: {
    minHeight: 42,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(10, 20, 34, .86)',
    color: colors.muted,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
    includeFontPadding: false,
  },
});
