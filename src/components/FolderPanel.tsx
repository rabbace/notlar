import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, DEFAULT_APP_FOLDERS } from '../context/AppContext';
import { getColors } from '../theme';

interface Props {
  /** Called on phone when a folder is tapped (triggers navigation) */
  onSelectFolder?: (folder: string | null, title: string) => void;
  /** Override container style — use to make full-width on phone */
  containerStyle?: ViewStyle;
}

export default function FolderPanel({ onSelectFolder, containerStyle }: Props) {
  const { state, dispatch } = useApp();
  const { theme, folders, activeFolder, notes } = state;
  const C = getColors(theme);

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const select = (folder: string | null, title: string) => {
    dispatch({ type: 'SET_ACTIVE_FOLDER', payload: folder });
    dispatch({ type: 'SET_ACTIVE_NOTE', payload: null });
    onSelectFolder?.(folder, title);
  };

  const commitAdd = () => {
    const name = newName.trim();
    if (name) dispatch({ type: 'ADD_FOLDER', payload: name });
    setNewName('');
    setAdding(false);
  };

  const deleteFolder = (folder: string) => {
    Alert.alert(
      'Klasörü Sil',
      `"${folder}" silinsin mi? İçindeki notlar "Genel"e taşınır.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => dispatch({ type: 'DELETE_FOLDER', payload: folder }),
        },
      ]
    );
  };

  const count = (folder: string | null) =>
    folder === null
      ? notes.length
      : notes.filter((n) => n.folder === folder).length;

  const Row = ({
    folder,
    label,
    icon,
  }: {
    folder: string | null;
    label: string;
    icon: string;
  }) => {
    const active = activeFolder === folder;
    const isDefault = folder !== null && DEFAULT_APP_FOLDERS.includes(folder);
    return (
      <TouchableOpacity
        style={[
          styles.row,
          active && { backgroundColor: C.accentLight },
        ]}
        onPress={() => select(folder, label)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={icon as any}
          size={17}
          color={active ? C.accent : C.textSecondary}
        />
        <Text
          style={[
            styles.rowLabel,
            { color: active ? C.accent : C.text, fontFamily: 'Outfit_400Regular' },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
        <Text style={[styles.badge, { color: C.textTertiary }]}>
          {count(folder)}
        </Text>
        {folder !== null && !isDefault && (
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => deleteFolder(folder)}
          >
            <Ionicons name="trash-outline" size={13} color={C.textTertiary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: C.surface, borderRightColor: C.border },
        containerStyle,
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <Text style={[styles.appTitle, { color: C.text, fontFamily: 'Lora_700Bold' }]}>
          Notlar
        </Text>
        <TouchableOpacity
          onPress={() =>
            dispatch({
              type: 'SET_THEME',
              payload: theme === 'dark' ? 'light' : 'dark',
            })
          }
        >
          <Ionicons
            name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={19}
            color={C.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Row folder={null} label="Tüm Notlar" icon="documents-outline" />

        <Text
          style={[
            styles.sectionLabel,
            { color: C.textTertiary, fontFamily: 'Outfit_400Regular' },
          ]}
        >
          KLASÖRLER
        </Text>

        {folders.map((f) => (
          <Row
            key={f}
            folder={f}
            label={f}
            icon={
              DEFAULT_APP_FOLDERS.includes(f)
                ? 'folder-outline'
                : 'folder-open-outline'
            }
          />
        ))}

        {adding ? (
          <View
            style={[
              styles.addInputWrap,
              { backgroundColor: C.inputBg, borderColor: C.border },
            ]}
          >
            <TextInput
              style={[
                styles.addInputText,
                { color: C.text, fontFamily: 'Outfit_400Regular' },
              ]}
              value={newName}
              onChangeText={setNewName}
              placeholder="Klasör adı..."
              placeholderTextColor={C.textTertiary}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={commitAdd}
              onBlur={() => {
                if (!newName.trim()) setAdding(false);
              }}
            />
            <TouchableOpacity onPress={commitAdd}>
              <Ionicons name="checkmark-circle" size={20} color={C.accent} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setAdding(true)}
          >
            <Ionicons name="add-circle-outline" size={17} color={C.accent} />
            <Text
              style={[
                styles.addBtnLabel,
                { color: C.accent, fontFamily: 'Outfit_400Regular' },
              ]}
            >
              Yeni Klasör
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    borderRightWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  appTitle: {
    fontSize: 22,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 6,
    marginVertical: 1,
    borderRadius: 8,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
  },
  badge: {
    fontSize: 12,
    minWidth: 18,
    textAlign: 'right',
  },
  addInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  addInputText: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  addBtnLabel: {
    fontSize: 14,
  },
});
