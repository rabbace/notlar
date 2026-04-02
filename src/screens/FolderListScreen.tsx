import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { getColors } from '../theme';
import FolderPanel from '../components/FolderPanel';
import { RootStackParamList } from '../types';

type Nav = StackNavigationProp<RootStackParamList, 'Folders'>;

export default function FolderListScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useApp();
  const C = getColors(state.theme);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: C.bg }]}
      edges={['bottom']}
    >
      <View style={[styles.container, { backgroundColor: C.bg }]}>
        <FolderPanel
          containerStyle={{ flex: 1, width: undefined, borderRightWidth: 0 }}
          onSelectFolder={(folder, title) =>
            navigation.navigate('NoteList', { folder, title })
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    flex: 1,
    // Override FolderPanel's fixed width so it fills the screen on phone
  },
});
