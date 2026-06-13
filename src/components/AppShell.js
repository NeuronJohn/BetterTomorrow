import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';
import BottomNav from './BottomNav';

export default function AppShell({ activeTab, onNavigate, title, subtitle, children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View pointerEvents="none" style={styles.blueGlow} />
      <View pointerEvents="none" style={styles.greenGlow} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.kicker}>DAILY COMPANION</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {children}
      </ScrollView>
      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: {
    zIndex: 2,
    elevation: 2,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 30 : 58,
    paddingHorizontal: 20,
    paddingBottom: 196,
  },
  kicker: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 14,
  },
  title: {
    color: colors.text,
    fontSize: 46,
    lineHeight: 52,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 26,
    marginTop: 16,
    marginBottom: 28,
    maxWidth: 360,
  },
  blueGlow: {
    position: 'absolute',
    zIndex: 0,
    width: 360,
    height: 360,
    borderRadius: 220,
    left: -118,
    top: -165,
    backgroundColor: '#071A38',
    opacity: 0.96,
  },
  greenGlow: {
    position: 'absolute',
    zIndex: 0,
    width: 360,
    height: 360,
    borderRadius: 220,
    right: -148,
    top: -150,
    backgroundColor: '#082B2C',
    opacity: 0.96,
  },
});
