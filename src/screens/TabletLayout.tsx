import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { getColors } from '../theme';
import FolderPanel from '../components/FolderPanel';
import NoteListPanel from '../components/NoteListPanel';
import NoteEditor from '../components/NoteEditor';

export default function TabletLayout() {
  const { state } = useApp();
  const C = getColors(state.theme);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: C.bg }]}
      edges={['top', 'bottom']}
    >
      <View style={styles.panels}>
        <FolderPanel />
        <NoteListPanel />
        <View style={styles.editorPane}>
          <NoteEditor noteId={state.activeNoteId} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  panels: { flex: 1, flexDirection: 'row' },
  editorPane: { flex: 1 },
});
