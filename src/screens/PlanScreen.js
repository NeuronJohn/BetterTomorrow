import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AssetIcon from '../components/AssetIcon';
import AppShell from '../components/AppShell';
import { Panel } from '../components/Cards';
import { colors } from '../theme/tokens';

export default function PlanScreen({ activeTab = 'Plan', onNavigate, pack }) {
  const target = pack.plan?.mainTarget || {};
  const tasks = pack.plan?.tasks || [];

  return (
    <AppShell
      activeTab={activeTab}
      onNavigate={onNavigate}
      title={pack.plan?.title || 'Today’s plan'}
      subtitle={pack.plan?.subtitle || 'A focused plan for steady progress without the pressure.'}
    >
      <Panel style={styles.card}>
        <Text style={styles.label}>{target.label || 'MAIN TARGET'}</Text>
        <Text style={styles.title}>{target.title}</Text>
        <Text style={styles.copy}>{target.copy}</Text>
      </Panel>

      {tasks.map((task) => (
        <Panel style={styles.task} key={task.title}>
          <View style={styles.taskIcon}><AssetIcon name="check" size={25} color={colors.teal} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskCopy}>{task.copy}</Text>
          </View>
          <Text style={styles.time}>{task.time}</Text>
        </Panel>
      ))}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: { padding: 22 },
  label: { color: colors.teal, fontSize: 14, fontWeight: '900', letterSpacing: .5 },
  title: { color: colors.text, fontSize: 28, lineHeight: 35, fontWeight: '900', marginTop: 12 },
  copy: { color: colors.muted, fontSize: 17, lineHeight: 25, marginTop: 10 },
  task: { padding: 18, flexDirection: 'row', gap: 14, alignItems: 'center' },
  taskIcon: { width: 54, height: 54, borderRadius: 20, backgroundColor: 'rgba(16, 30, 48, .9)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  taskTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  taskCopy: { color: colors.muted, fontSize: 16, lineHeight: 23, marginTop: 6 },
  time: { color: colors.blue, fontSize: 13, fontWeight: '900' },
});
