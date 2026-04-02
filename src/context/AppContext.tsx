import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from 'react';
import { AppState, AppAction } from '../types';
import {
  loadNotes,
  saveNotes,
  loadFolders,
  saveFolders,
  loadTheme,
  saveTheme,
} from '../utils/storage';

const DEFAULT_FOLDERS = ['Genel', 'Kişisel', 'İş'];

const initialState: AppState = {
  notes: [],
  folders: DEFAULT_FOLDERS,
  activeFolder: null,
  activeNoteId: null,
  theme: 'dark',
  searchQuery: '',
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload.id ? action.payload : n
        ),
      };

    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
        activeNoteId:
          state.activeNoteId === action.payload ? null : state.activeNoteId,
      };

    case 'ADD_FOLDER':
      if (state.folders.includes(action.payload)) return state;
      return { ...state, folders: [...state.folders, action.payload] };

    case 'DELETE_FOLDER':
      return {
        ...state,
        folders: state.folders.filter((f) => f !== action.payload),
        notes: state.notes.map((n) =>
          n.folder === action.payload ? { ...n, folder: 'Genel' } : n
        ),
        activeFolder:
          state.activeFolder === action.payload ? null : state.activeFolder,
      };

    case 'SET_ACTIVE_FOLDER':
      return { ...state, activeFolder: action.payload, searchQuery: '' };

    case 'SET_ACTIVE_NOTE':
      return { ...state, activeNoteId: action.payload };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [initialized, setInitialized] = useState(false);

  // Load persisted state once on mount
  useEffect(() => {
    (async () => {
      const [notes, folders, theme] = await Promise.all([
        loadNotes(),
        loadFolders(),
        loadTheme(),
      ]);
      dispatch({
        type: 'LOAD_STATE',
        payload: {
          notes: notes ?? [],
          folders: folders ?? DEFAULT_FOLDERS,
          theme: theme ?? 'dark',
        },
      });
      setInitialized(true);
    })();
  }, []);

  // Persist on every relevant state change (skip until initialized)
  useEffect(() => {
    if (!initialized) return;
    saveNotes(state.notes);
  }, [state.notes, initialized]);

  useEffect(() => {
    if (!initialized) return;
    saveFolders(state.folders);
  }, [state.folders, initialized]);

  useEffect(() => {
    if (!initialized) return;
    saveTheme(state.theme);
  }, [state.theme, initialized]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export const DEFAULT_APP_FOLDERS = DEFAULT_FOLDERS;
