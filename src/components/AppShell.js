import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import BottomNav from './BottomNav';
import { colors } from '../theme/tokens';

export default function AppShell({ activeTab, onNavigate, title, subtitle, headerRight, children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View pointerEvents="none" style={styles.blueGlow} />
      <View pointerEvents="none" style={styles.greenGlow} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.headerBlock}>
          <Text allowFontScaling={false} style={styles.kicker}>DAILY COMPANION</Text>
          <Text allowFontScaling={false} style={styles.title}>{title}</Text>
          {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
          <Text allowFontScaling={false} style={styles.subtitle}>{subtitle}</Text>
        </View>
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
  headerBlock: {
    position: 'relative',
    zIndex: 3,
    elevation: 3,
    marginBottom: 26,
  },
  headerRight: {
    position: 'absolute',
    right: 0,
    top: 42,
    zIndex: 6,
    elevation: 6,
  },
  kicker: {
    color: colors.blue,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    letterSpacing: 1.7,
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '900',
    letterSpacing: -1.8,
    paddingRight: 155,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 28,
    marginTop: 8,
    maxWidth: 340,
  },
  blueGlow: {
    position: 'absolute',
    zIndex: 0,
    width: 265,
    height: 265,
    borderRadius: 150,
    left: -78,
    top: -70,
    backgroundColor: 'rgba(10, 48, 106, .55)',
  },
  greenGlow: {
    position: 'absolute',
    zIndex: 0,
    width: 310,
    height: 310,
    borderRadius: 180,
    right: -85,
    top: -65,
    backgroundColor: 'rgba(0, 91, 76, .42)',
  },
});
