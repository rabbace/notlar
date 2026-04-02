import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { getColors } from '../theme';
import NoteEditor from '../components/NoteEditor';
import { RootStackParamList } from '../types';

type Nav = StackNavigationProp<RootStackParamList, 'NoteEditor'>;
type Route = RouteProp<RootStackParamList, 'NoteEditor'>;

export default function NoteEditorScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { state, dispatch } = useApp();
  const C = getColors(state.theme);

  const noteId = route.params?.noteId ?? null;

  const handleDelete = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: C.bg }]}
      edges={['bottom']}
    >
      <NoteEditor
        noteId={noteId}
        onBack={() => navigation.goBack()}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
