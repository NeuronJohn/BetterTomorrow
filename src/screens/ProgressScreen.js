import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AssetIcon from '../components/AssetIcon';
import AppShell from '../components/AppShell';
import { PillButton } from '../components/Buttons';
import { Panel } from '../components/Cards';
import { colors } from '../theme/tokens';

function projectId(project) {
  return project?.id || project?.title || 'project';
}

function normalizeTasks(project, pack) {
  const direct = project?.progress?.tasks || project?.tasks || [];
  if (direct.length) return direct;

  return (pack.plan?.tasks || []).map((task, index) => ({
    id: `plan-${index}`,
    title: task.title,
    copy: task.copy,
    time: task.time,
    category: 'Today',
  }));
}

function percentComplete(tasks, completedIds) {
  if (!tasks.length) return 0;
  const done = tasks.filter((task, index) => completedIds.includes(task.id || `${index}`)).length;
  return Math.round((done / tasks.length) * 100);
}

export default function ProgressScreen({
  activeTab = 'Updates',
  onNavigate,
  pack,
  project,
  progressState,
  onToggleTask,
  onAddUpdate,
  onCardAction,
}) {
  const fallbackProject = pack.buildStatus || {};
  const item = project || fallbackProject;
  const pid = projectId(item);
  const tasks = normalizeTasks(item, pack);
  const completedIds = progressState?.completedTaskIds || [];
  const updates = progressState?.updates || [];
  const [updateText, setUpdateText] = useState('');

  const doneCount = useMemo(
    () => tasks.filter((task, index) => completedIds.includes(task.id || `${index}`)).length,
    [tasks, completedIds]
  );
  const pct = percentComplete(tasks, completedIds);
  const progress = item.progress || {};
  const nextStep = progress.currentStep || tasks.find((task, index) => !completedIds.includes(task.id || `${index}`))?.title || 'Keep momentum on the next useful task.';

  function submitUpdate() {
    const trimmed = updateText.trim();
    if (!trimmed) return;
    onAddUpdate?.(pid, trimmed);
    setUpdateText('');
  }

  return (
    <AppShell
      activeTab={activeTab}
      onNavigate={onNavigate}
      title="Progress"
      subtitle="Update the project, check off tasks, and keep the next step obvious."
      headerRight={<PillButton label="Back" icon="close" onPress={() => onNavigate?.('Updates')} style={styles.backButton} />}
    >
      <Panel style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.projectIcon}>
            <AssetIcon name="trend" size={28} color={colors.teal} />
          </View>
          <View style={styles.heroCopy}>
            <Text allowFontScaling={false} style={styles.kicker} numberOfLines={1}>{item.label || 'ACTIVE PROJECT'}</Text>
            <Text allowFontScaling={false} style={styles.projectTitle} numberOfLines={2}>{item.title || 'Active project'}</Text>
            <Text allowFontScaling={false} style={styles.projectDesc} numberOfLines={3}>
              {progress.summary || item.description || 'Track what matters and keep moving.'}
            </Text>
          </View>
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.progressHeader}>
            <Text allowFontScaling={false} style={styles.progressPercent}>{pct}%</Text>
            <Text allowFontScaling={false} style={styles.progressMeta}>{doneCount}/{tasks.length || 0} tasks done</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(6, pct)}%` }]} />
          </View>
        </View>

        <View style={styles.nextBox}>
          <Text allowFontScaling={false} style={styles.nextLabel}>NEXT BEST STEP</Text>
          <Text allowFontScaling={false} style={styles.nextText} numberOfLines={2}>{nextStep}</Text>
        </View>

        <View style={styles.actionRow}>
          <PillButton label="Open project" icon="trend" accentText onPress={() => onCardAction?.('progress_link', item)} style={styles.actionButton} />
          <PillButton label="Details" icon="eye" onPress={() => onCardAction?.('details', item)} style={styles.actionButton} />
        </View>
      </Panel>

      <SectionTitle title="Goal tasks" action={`${doneCount}/${tasks.length || 0}`} />
      {tasks.map((task, index) => {
        const id = task.id || `${index}`;
        const done = completedIds.includes(id);
        return (
          <Pressable key={id} onPress={() => onToggleTask?.(pid, id)} style={({ pressed }) => [pressed && styles.pressed]}>
            <Panel style={[styles.taskCard, done && styles.taskDone]}>
              <View style={[styles.checkBox, done && styles.checkBoxDone]}>
                {done ? <AssetIcon name="check" size={22} color="#061014" /> : null}
              </View>
              <View style={styles.taskCopy}>
                <View style={styles.taskTitleRow}>
                  <Text allowFontScaling={false} style={[styles.taskTitle, done && styles.doneText]} numberOfLines={2}>{task.title}</Text>
                  {task.time ? <Text allowFontScaling={false} style={styles.taskTime} numberOfLines={1}>{task.time}</Text> : null}
                </View>
                <Text allowFontScaling={false} style={styles.taskDesc} numberOfLines={3}>{task.copy || task.description || ''}</Text>
                {task.category ? <Text allowFontScaling={false} style={styles.taskCategory} numberOfLines={1}>{task.category}</Text> : null}
              </View>
            </Panel>
          </Pressable>
        );
      })}

      <SectionTitle title="Add progress update" action="Today" />
      <Panel style={styles.updateCard}>
        <TextInput
          allowFontScaling={false}
          value={updateText}
          onChangeText={setUpdateText}
          placeholder="What changed? What got done? What is blocked?"
          placeholderTextColor={colors.dim}
          multiline
          textAlignVertical="top"
          style={styles.updateInput}
        />
        <View style={styles.updateFooter}>
          <Text allowFontScaling={false} style={styles.updateHint}>Saved locally for this project.</Text>
          <PillButton label="Add update" icon="note" primary onPress={submitUpdate} style={styles.addButton} />
        </View>
      </Panel>

      <SectionTitle title="Progress log" action={`${updates.length}`} />
      {updates.length ? updates.map((entry) => (
        <Panel key={entry.id} style={styles.logCard}>
          <View style={styles.logDot} />
          <View style={styles.logCopy}>
            <Text allowFontScaling={false} style={styles.logText}>{entry.text}</Text>
            <Text allowFontScaling={false} style={styles.logDate}>{entry.createdAtLabel || 'Saved just now'}</Text>
          </View>
        </Panel>
      )) : (
        <Panel style={styles.emptyLog}>
          <Text allowFontScaling={false} style={styles.emptyTitle}>No progress updates yet</Text>
          <Text allowFontScaling={false} style={styles.emptyCopy}>Add a quick note whenever you finish something, get stuck, or decide the next move.</Text>
        </Panel>
      )}
    </AppShell>
  );
}

function SectionTitle({ title, action }) {
  return (
    <View style={styles.sectionRow}>
      <Text allowFontScaling={false} style={styles.sectionTitle}>{title}</Text>
      <Text allowFontScaling={false} style={styles.sectionAction}>{action}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: { minWidth: 118, minHeight: 52, borderRadius: 20 },
  heroCard: { padding: 16 },
  heroTop: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  projectIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.teal,
    backgroundColor: 'rgba(0, 91, 76, .20)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroCopy: { flex: 1, minWidth: 0 },
  kicker: { color: colors.gold, fontSize: 12.5, lineHeight: 16, fontWeight: '900', letterSpacing: .4 },
  projectTitle: { color: colors.text, fontSize: 25, lineHeight: 31, fontWeight: '900', marginTop: 6 },
  projectDesc: { color: colors.muted, fontSize: 14.5, lineHeight: 21, marginTop: 7 },
  progressBlock: { marginTop: 18, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 15 },
  progressHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 },
  progressPercent: { color: colors.teal, fontSize: 34, lineHeight: 38, fontWeight: '900' },
  progressMeta: { color: colors.muted, fontSize: 14.5, lineHeight: 19, fontWeight: '800', marginBottom: 3 },
  progressTrack: { height: 13, borderRadius: 99, backgroundColor: 'rgba(10, 20, 34, .9)', borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99, backgroundColor: colors.teal },
  nextBox: { marginTop: 15, padding: 14, borderRadius: 21, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(16, 30, 48, .72)' },
  nextLabel: { color: colors.blue, fontSize: 12.5, lineHeight: 16, fontWeight: '900', letterSpacing: .35 },
  nextText: { color: colors.text, fontSize: 16.5, lineHeight: 22, fontWeight: '900', marginTop: 5 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionButton: { flex: 1, minHeight: 52, borderRadius: 18, minWidth: 0 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 10, paddingHorizontal: 2 },
  sectionTitle: { color: colors.text, fontSize: 22, lineHeight: 28, fontWeight: '900' },
  sectionAction: { color: colors.teal, fontSize: 14, lineHeight: 18, fontWeight: '900' },
  pressed: { opacity: .78 },
  taskCard: { padding: 15, flexDirection: 'row', gap: 13, alignItems: 'flex-start' },
  taskDone: { borderColor: 'rgba(0, 214, 183, .55)', backgroundColor: 'rgba(13, 57, 57, .30)' },
  checkBox: { width: 38, height: 38, borderRadius: 14, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: 'rgba(16, 30, 48, .9)', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  checkBoxDone: { backgroundColor: colors.teal, borderColor: colors.teal },
  taskCopy: { flex: 1, minWidth: 0 },
  taskTitleRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  taskTitle: { color: colors.text, fontSize: 17.5, lineHeight: 22, fontWeight: '900', flex: 1 },
  doneText: { color: colors.teal },
  taskTime: { color: colors.blue, fontSize: 12.5, lineHeight: 16, fontWeight: '900', marginTop: 3 },
  taskDesc: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 6 },
  taskCategory: { color: colors.dim, fontSize: 12.5, lineHeight: 16, fontWeight: '800', marginTop: 8 },
  updateCard: { padding: 15 },
  updateInput: { minHeight: 92, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(5, 10, 17, .86)', color: colors.text, paddingHorizontal: 15, paddingVertical: 13, fontSize: 15, lineHeight: 21 },
  updateFooter: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 13 },
  updateHint: { color: colors.dim, fontSize: 12.5, lineHeight: 17, flex: 1 },
  addButton: { minWidth: 132, minHeight: 52, borderRadius: 18 },
  logCard: { padding: 15, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  logDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.teal, marginTop: 5 },
  logCopy: { flex: 1, minWidth: 0 },
  logText: { color: colors.text, fontSize: 15, lineHeight: 21, fontWeight: '800' },
  logDate: { color: colors.dim, fontSize: 12.5, lineHeight: 16, marginTop: 5 },
  emptyLog: { padding: 18 },
  emptyTitle: { color: colors.text, fontSize: 17, lineHeight: 22, fontWeight: '900' },
  emptyCopy: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 7 },
});
