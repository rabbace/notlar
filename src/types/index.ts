export interface Note {
  id: string;
  title: string;
  body: string;
  folder: string;
  tags: string[];
  color: NoteColor;
  createdAt: number;
  updatedAt: number;
}

export type NoteColor = 'purple' | 'orange' | 'green' | 'red' | 'yellow' | 'blue' | 'pink';

export type Theme = 'dark' | 'light';

export type EditorMode = 'edit' | 'split' | 'preview';

export interface AppState {
  notes: Note[];
  folders: string[];
  activeFolder: string | null;
  activeNoteId: string | null;
  theme: Theme;
  searchQuery: string;
}

export type AppAction =
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_FOLDER'; payload: string }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'SET_ACTIVE_FOLDER'; payload: string | null }
  | { type: 'SET_ACTIVE_NOTE'; payload: string | null }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

export type RootStackParamList = {
  Folders: undefined;
  NoteList: { folder: string | null; title: string };
  NoteEditor: { noteId?: string; folder?: string };
};
