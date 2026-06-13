import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { defaultDailyPack } from '../data/defaultDailyPack';
import { colors } from '../theme/tokens';
import { PillButton } from './Buttons';

export default function ImportDailyPackModal({ visible, onClose, onImport, status }) {
  const [raw, setRaw] = useState('');
  const sample = useMemo(() => JSON.stringify(defaultDailyPack, null, 2), []);

  function loadSample() {
    setRaw(sample);
  }

  async function submit() {
    const result = await onImport(raw);
    if (result?.ok) onClose?.();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.layer}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Import daily pack</Text>
          <Text style={styles.copy}>
            Paste the JSON I give you. It updates Brief, Plan, Updates, Memory, and notification copy.
          </Text>

          <TextInput
            value={raw}
            onChangeText={setRaw}
            placeholder="Paste daily pack JSON here..."
            placeholderTextColor={colors.dim}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <Text style={styles.status}>{status}</Text>

          <View style={styles.row}>
            <PillButton label="Load sample" onPress={loadSample} style={styles.secondary} />
            <PillButton label="Import" onPress={submit} primary style={styles.secondary} />
          </View>

          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  layer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,.35)',
  },
  sheet: {
    backgroundColor: 'rgba(13, 23, 37, .995)',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    padding: 22,
    paddingBottom: 28,
  },
  handle: {
    width: 82,
    height: 7,
    borderRadius: 99,
    backgroundColor: '#607189',
    alignSelf: 'center',
    marginBottom: 18,
  },
  title: { color: colors.text, fontSize: 30, fontWeight: '900' },
  copy: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: 8, marginBottom: 16 },
  input: {
    minHeight: 220,
    maxHeight: 300,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#050A11',
    color: colors.text,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 13,
    lineHeight: 18,
  },
  status: { color: colors.dim, fontSize: 13, marginTop: 10 },
  row: { flexDirection: 'row', gap: 12, marginTop: 14 },
  secondary: { flex: 1 },
  close: { alignItems: 'center', paddingTop: 18 },
  closeText: { color: colors.muted, fontSize: 16, fontWeight: '800' },
});
