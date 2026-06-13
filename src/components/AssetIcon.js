import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { icons } from '../data/assets';
import { colors } from '../theme/tokens';

export default function AssetIcon({ name, size = 22, color = colors.muted, style }) {
  const source = icons[name] || icons.updates;
  return <Image source={source} style={[styles.icon, { width: size, height: size, tintColor: color }, style]} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  icon: { opacity: 1 },
});
