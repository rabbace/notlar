import { Note, NoteColor, Theme } from '../types';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Tag colors ────────────────────────────────────────────────────────────────
const TAG_PALETTE = [
  '#7c6af7', '#ff8c42', '#4caf50', '#ef5350',
  '#ffc107', '#2196f3', '#e91e63', '#00bcd4', '#ff5722',
];

export function getTagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length];
}

// ── Note colors ───────────────────────────────────────────────────────────────
export const NOTE_COLOR_MAP: Record<
  NoteColor,
  { bg: { dark: string; light: string }; accent: string }
> = {
  purple: { bg: { dark: '#1e1830', light: '#f3f0ff' }, accent: '#7c6af7' },
  orange: { bg: { dark: '#251a0a', light: '#fff8f0' }, accent: '#ff8c42' },
  green:  { bg: { dark: '#0a1e10', light: '#f0faf1' }, accent: '#4caf50' },
  red:    { bg: { dark: '#220a0a', light: '#fff0f0' }, accent: '#ef5350' },
  yellow: { bg: { dark: '#1e1900', light: '#fffde7' }, accent: '#ffc107' },
  blue:   { bg: { dark: '#0a1020', light: '#f0f4ff' }, accent: '#2196f3' },
  pink:   { bg: { dark: '#220a14', light: '#fff0f6' }, accent: '#e91e63' },
};

export const NOTE_COLORS: NoteColor[] = [
  'purple', 'orange', 'green', 'red', 'yellow', 'blue', 'pink',
];

export function getNoteCardBg(color: NoteColor, theme: Theme): string {
  return NOTE_COLOR_MAP[color].bg[theme];
}

export function getNoteAccent(color: NoteColor): string {
  return NOTE_COLOR_MAP[color].accent;
}

// ── Factory ───────────────────────────────────────────────────────────────────
export function createNote(overrides: Partial<Note> = {}): Note {
  const now = Date.now();
  return {
    id: generateId(),
    title: '',
    body: '',
    folder: 'Genel',
    tags: [],
    color: 'purple',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

// ── Date formatting ───────────────────────────────────────────────────────────
export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
