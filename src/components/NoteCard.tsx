import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Note, Theme } from '../types';
import { getColors } from '../theme';
import {
  getNoteCardBg,
  getNoteAccent,
  getTagColor,
  formatDate,
} from '../utils/helpers';

interface Props {
  note: Note;
  theme: Theme;
  active?: boolean;
  onPress: () => void;
}

export default function NoteCard({ note, theme, active, onPress }: Props) {
  const C = getColors(theme);
  const cardBg = getNoteCardBg(note.color, theme);
  const accent = getNoteAccent(note.color);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: active ? accent : 'transparent',
          shadowColor: accent,
        },
      ]}
    >
      {/* Accent bar */}
      <View style={[styles.accentBar, { backgroundColor: accent }]} />

      <View style={styles.content}>
        <Text
          style={[styles.title, { color: C.text, fontFamily: 'Lora_700Bold' }]}
          numberOfLines={1}
        >
          {note.title || 'Başlıksız'}
        </Text>

        {note.body.length > 0 && (
          <Text
            style={[
              styles.preview,
              { color: C.textSecondary, fontFamily: 'Outfit_400Regular' },
            ]}
            numberOfLines={2}
          >
            {note.body}
          </Text>
        )}

        {note.tags.length > 0 && (
          <View style={styles.tags}>
            {note.tags.slice(0, 4).map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  { backgroundColor: getTagColor(tag) + '28' },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    {
                      color: getTagColor(tag),
                      fontFamily: 'Outfit_400Regular',
                    },
                  ]}
                >
                  #{tag}
                </Text>
              </View>
            ))}
            {note.tags.length > 4 && (
              <Text style={[styles.moreTag, { color: C.textTertiary }]}>
                +{note.tags.length - 4}
              </Text>
            )}
          </View>
        )}

        <Text
          style={[
            styles.date,
            { color: C.textTertiary, fontFamily: 'Outfit_400Regular' },
          ]}
        >
          {formatDate(note.updatedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 4,
    overflow: 'hidden',
    borderWidth: 1.5,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  title: {
    fontSize: 15,
  },
  preview: {
    fontSize: 13,
    lineHeight: 18,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
  },
  moreTag: {
    fontSize: 11,
    alignSelf: 'center',
  },
  date: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'right',
  },
});
