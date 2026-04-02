import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getColors } from '../theme';
import { createNote } from '../utils/helpers';
import NoteCard from './NoteCard';
import { Note } from '../types';

interface Props {
  /** Called on phone to navigate to the editor */
  onOpenNote?: (noteId: string) => void;
  onNewNote?: (noteId: string) => void;
  containerStyle?: ViewStyle;
}

export default function NoteListPanel({ onOpenNote, onNewNote, containerStyle }: Props) {
  const { state, dispatch } = useApp();
  const { notes, activeFolder, activeNoteId, theme, searchQuery } = state;
  const C = getColors(theme);

  const filtered = useMemo(() => {
    let list = activeFolder === null
      ? notes
      : notes.filter((n) => n.folder === activeFolder);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q)
      );
    }

    return list;
  }, [notes, activeFolder, searchQuery]);

  const handleNewNote = () => {
    const note = createNote({ folder: activeFolder ?? 'Genel' });
    dispatch({ type: 'ADD_NOTE', payload: note });
    dispatch({ type: 'SET_ACTIVE_NOTE', payload: note.id });
    onNewNote?.(note.id);
  };

  const handleSelect = (note: Note) => {
    dispatch({ type: 'SET_ACTIVE_NOTE', payload: note.id });
    onOpenNote?.(note.id);
  };

  const folderTitle =
    activeFolder === null ? 'Tüm Notlar' : activeFolder;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: C.bg, borderRightColor: C.border },
        containerStyle,
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <Text
          style={[
            styles.title,
            { color: C.text, fontFamily: 'Outfit_600SemiBold' },
          ]}
          numberOfLines={1}
        >
          {folderTitle}
        </Text>
        <TouchableOpacity onPress={handleNewNote} style={styles.addBtn}>
          <Ionicons name="add" size={22} color={C.accent} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchWrap,
          { backgroundColor: C.surface, borderColor: C.border },
        ]}
      >
        <Ionicons name="search-outline" size={15} color={C.textTertiary} />
        <TextInput
          style={[
            styles.searchInput,
            { color: C.text, fontFamily: 'Outfit_400Regular' },
          ]}
          placeholder="Notlarda ara..."
          placeholderTextColor={C.textTertiary}
          value={searchQuery}
          onChangeText={(q) =>
            dispatch({ type: 'SET_SEARCH', payload: q })
          }
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
          >
            <Ionicons name="close-circle" size={15} color={C.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            theme={theme}
            active={item.id === activeNoteId}
            onPress={() => handleSelect(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="document-text-outline"
              size={48}
              color={C.textTertiary}
            />
            <Text
              style={[
                styles.emptyText,
                { color: C.textTertiary, fontFamily: 'Outfit_400Regular' },
              ]}
            >
              {searchQuery ? 'Eşleşme yok' : 'Not yok'}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingVertical: 6, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    borderRightWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 17,
    flex: 1,
  },
  addBtn: {
    padding: 4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 10,
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
  },
});
