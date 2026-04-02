import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getColors } from '../theme';
import { formatDate, getNoteCardBg, getNoteAccent } from '../utils/helpers';
import TagInput from './TagInput';
import ColorPicker from './ColorPicker';
import { EditorMode, NoteColor } from '../types';

interface Props {
  noteId: string | null;
  onBack?: () => void;
  onDelete?: () => void;
}

export default function NoteEditor({ noteId, onBack, onDelete }: Props) {
  const { state, dispatch } = useApp();
  const { theme, notes, folders } = state;
  const C = getColors(theme);

  const note = notes.find((n) => n.id === noteId) ?? null;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mode, setMode] = useState<EditorMode>('edit');
  const [folderModal, setFolderModal] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when active note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.body);
    } else {
      setTitle('');
      setBody('');
    }
  }, [noteId]); // only on noteId change

  const save = useCallback(
    (newTitle: string, newBody: string) => {
      if (!note) return;
      dispatch({
        type: 'UPDATE_NOTE',
        payload: { ...note, title: newTitle, body: newBody, updatedAt: Date.now() },
      });
    },
    [note, dispatch]
  );

  const debouncedSave = useCallback(
    (newTitle: string, newBody: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => save(newTitle, newBody), 600);
    },
    [save]
  );

  const handleTitleChange = (v: string) => {
    setTitle(v);
    debouncedSave(v, body);
  };

  const handleBodyChange = (v: string) => {
    setBody(v);
    debouncedSave(title, v);
  };

  const handleTagsChange = (tags: string[]) => {
    if (!note) return;
    dispatch({ type: 'UPDATE_NOTE', payload: { ...note, tags, updatedAt: Date.now() } });
  };

  const handleColorChange = (color: NoteColor) => {
    if (!note) return;
    dispatch({ type: 'UPDATE_NOTE', payload: { ...note, color, updatedAt: Date.now() } });
  };

  const handleFolderChange = (folder: string) => {
    if (!note) return;
    dispatch({ type: 'UPDATE_NOTE', payload: { ...note, folder, updatedAt: Date.now() } });
    setFolderModal(false);
  };

  const handleDelete = () => {
    if (!note) return;
    Alert.alert('Notu Sil', 'Bu notu silmek istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'DELETE_NOTE', payload: note.id });
          onDelete?.();
        },
      },
    ]);
  };

  if (!note) {
    return (
      <View style={[styles.empty, { backgroundColor: C.bg }]}>
        <Ionicons name="document-text-outline" size={64} color={C.textTertiary} />
        <Text style={[styles.emptyText, { color: C.textTertiary, fontFamily: 'Outfit_400Regular' }]}>
          Bir not seçin veya yeni not oluşturun
        </Text>
      </View>
    );
  }

  const cardBg = getNoteCardBg(note.color, theme);
  const accent = getNoteAccent(note.color);

  const mdStyles = {
    body: { color: C.text, fontFamily: 'Outfit_400Regular', fontSize: 15, lineHeight: 24 },
    heading1: { color: C.text, fontFamily: 'Lora_700Bold', fontSize: 22, marginBottom: 8 },
    heading2: { color: C.text, fontFamily: 'Lora_700Bold', fontSize: 18, marginBottom: 6 },
    heading3: { color: C.text, fontFamily: 'Outfit_600SemiBold', fontSize: 16 },
    code_inline: { fontFamily: 'JetBrainsMono_400Regular', backgroundColor: C.inputBg, color: accent, fontSize: 13 },
    fence: { backgroundColor: C.inputBg, padding: 12, borderRadius: 8 },
    code_block: { fontFamily: 'JetBrainsMono_400Regular', color: C.text, fontSize: 13 },
    blockquote: { borderLeftColor: accent, borderLeftWidth: 3, paddingLeft: 12, opacity: 0.8 },
    link: { color: accent },
    strong: { fontFamily: 'Outfit_600SemiBold' },
    bullet_list_icon: { color: accent },
  };

  const ModeBtn = ({ m, icon }: { m: EditorMode; icon: string }) => (
    <TouchableOpacity
      onPress={() => setMode(m)}
      style={[
        styles.modeBtn,
        mode === m && { backgroundColor: accent + '30', borderColor: accent },
        { borderColor: mode === m ? accent : C.border },
      ]}
    >
      <Ionicons name={icon as any} size={15} color={mode === m ? accent : C.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      {/* Toolbar */}
      <View style={[styles.toolbar, { borderBottomColor: C.border, backgroundColor: C.surface }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.toolbarBtn}>
            <Ionicons name="arrow-back" size={20} color={C.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Folder chip */}
        <TouchableOpacity
          onPress={() => setFolderModal(true)}
          style={[styles.folderChip, { backgroundColor: accent + '20', borderColor: accent + '50' }]}
        >
          <Ionicons name="folder-outline" size={13} color={accent} />
          <Text style={[styles.folderChipText, { color: accent, fontFamily: 'Outfit_400Regular' }]}>
            {note.folder}
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        {/* Mode switcher */}
        <View style={styles.modeSwitcher}>
          <ModeBtn m="edit" icon="create-outline" />
          <ModeBtn m="split" icon="git-compare-outline" />
          <ModeBtn m="preview" icon="eye-outline" />
        </View>

        <TouchableOpacity onPress={handleDelete} style={[styles.toolbarBtn, { marginLeft: 4 }]}>
          <Ionicons name="trash-outline" size={18} color={C.danger} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <TextInput
        style={[styles.titleInput, { color: C.text, fontFamily: 'Lora_700Bold', backgroundColor: cardBg }]}
        value={title}
        onChangeText={handleTitleChange}
        placeholder="Başlık"
        placeholderTextColor={C.textTertiary}
        multiline={false}
        returnKeyType="next"
      />

      {/* Meta row: color + tags */}
      <View style={[styles.metaRow, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <ColorPicker value={note.color} theme={theme} onChange={handleColorChange} />
        <View style={[styles.metaDivider, { backgroundColor: C.border }]} />
        <View style={{ flex: 1 }}>
          <TagInput tags={note.tags} theme={theme} onChange={handleTagsChange} />
        </View>
      </View>

      {/* Editor area */}
      {mode === 'edit' && (
        <ScrollView style={styles.editorScroll} keyboardShouldPersistTaps="handled">
          <TextInput
            style={[
              styles.bodyInput,
              { color: C.text, fontFamily: 'JetBrainsMono_400Regular', backgroundColor: C.bg },
            ]}
            value={body}
            onChangeText={handleBodyChange}
            placeholder="Yazmaya başla... (Markdown desteklenir)"
            placeholderTextColor={C.textTertiary}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      )}

      {mode === 'preview' && (
        <ScrollView style={[styles.editorScroll, { padding: 16 }]}>
          <Markdown style={mdStyles as any}>{body || '_Henüz içerik yok_'}</Markdown>
        </ScrollView>
      )}

      {mode === 'split' && (
        <View style={styles.splitView}>
          <TextInput
            style={[
              styles.bodyInput,
              styles.splitInput,
              { color: C.text, fontFamily: 'JetBrainsMono_400Regular', backgroundColor: C.bg, borderRightColor: C.border },
            ]}
            value={body}
            onChangeText={handleBodyChange}
            placeholder="Yaz..."
            placeholderTextColor={C.textTertiary}
            multiline
            textAlignVertical="top"
          />
          <ScrollView
            style={[styles.splitPreview, { backgroundColor: C.surfaceAlt }]}
            contentContainerStyle={{ padding: 16 }}
          >
            <Markdown style={mdStyles as any}>{body || '_Önizleme_'}</Markdown>
          </ScrollView>
        </View>
      )}

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: C.border, backgroundColor: C.surface }]}>
        <Text style={[styles.footerText, { color: C.textTertiary, fontFamily: 'Outfit_400Regular' }]}>
          {formatDate(note.createdAt)} · {body.split(/\s+/).filter(Boolean).length} kelime
        </Text>
      </View>

      {/* Folder selector modal */}
      <Modal
        visible={folderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setFolderModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFolderModal(false)}
        >
          <View style={[styles.modalSheet, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.modalTitle, { color: C.text, fontFamily: 'Outfit_600SemiBold' }]}>
              Klasör Seç
            </Text>
            <FlatList
              data={folders}
              keyExtractor={(f) => f}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalRow,
                    item === note.folder && { backgroundColor: C.accentLight },
                  ]}
                  onPress={() => handleFolderChange(item)}
                >
                  <Ionicons
                    name="folder-outline"
                    size={16}
                    color={item === note.folder ? C.accent : C.textSecondary}
                  />
                  <Text
                    style={[
                      styles.modalRowText,
                      {
                        color: item === note.folder ? C.accent : C.text,
                        fontFamily: 'Outfit_400Regular',
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {item === note.folder && (
                    <Ionicons name="checkmark" size={16} color={C.accent} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  emptyText: { fontSize: 15, textAlign: 'center', maxWidth: 260 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
  },
  toolbarBtn: { padding: 4 },
  folderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  folderChipText: { fontSize: 12 },
  modeSwitcher: {
    flexDirection: 'row',
    gap: 4,
  },
  modeBtn: {
    padding: 6,
    borderRadius: 7,
    borderWidth: 1,
  },
  titleInput: {
    fontSize: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 0,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
  },
  metaDivider: {
    width: 1,
    height: 20,
  },
  editorScroll: { flex: 1 },
  bodyInput: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    padding: 16,
    minHeight: 200,
  },
  splitView: { flex: 1, flexDirection: 'row' },
  splitInput: {
    flex: 1,
    borderRightWidth: 1,
  },
  splitPreview: { flex: 1 },
  footer: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  footerText: { fontSize: 11 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSheet: {
    width: 280,
    maxHeight: 360,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 4,
  },
  modalTitle: {
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  modalRowText: { flex: 1, fontSize: 14 },
});
