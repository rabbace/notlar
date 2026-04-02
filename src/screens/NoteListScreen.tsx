import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { getColors } from '../theme';
import NoteListPanel from '../components/NoteListPanel';
import { RootStackParamList } from '../types';

type Nav = StackNavigationProp<RootStackParamList, 'NoteList'>;
type Route = RouteProp<RootStackParamList, 'NoteList'>;

export default function NoteListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { state, dispatch } = useApp();
  const C = getColors(state.theme);

  // Sync active folder from route params
  React.useEffect(() => {
    dispatch({ type: 'SET_ACTIVE_FOLDER', payload: route.params.folder });
  }, [route.params.folder]);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: C.bg }]}
      edges={['bottom']}
    >
      <View style={[styles.container, { backgroundColor: C.bg }]}>
        <NoteListPanel
          containerStyle={{ flex: 1, width: undefined, borderRightWidth: 0 }}
          onOpenNote={(noteId) =>
            navigation.navigate('NoteEditor', { noteId })
          }
          onNewNote={(noteId) =>
            navigation.navigate('NoteEditor', { noteId })
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
});
