import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, Theme } from '../types';

const KEYS = {
  NOTES: '@notlar_notes',
  FOLDERS: '@notlar_folders',
  THEME: '@notlar_theme',
};

export async function loadNotes(): Promise<Note[] | null> {
  const json = await AsyncStorage.getItem(KEYS.NOTES);
  return json ? JSON.parse(json) : null;
}

export async function saveNotes(notes: Note[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
}

export async function loadFolders(): Promise<string[] | null> {
  const json = await AsyncStorage.getItem(KEYS.FOLDERS);
  return json ? JSON.parse(json) : null;
}

export async function saveFolders(folders: string[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.FOLDERS, JSON.stringify(folders));
}

export async function loadTheme(): Promise<Theme | null> {
  const value = await AsyncStorage.getItem(KEYS.THEME);
  return value as Theme | null;
}

export async function saveTheme(theme: Theme): Promise<void> {
  await AsyncStorage.setItem(KEYS.THEME, theme);
}
