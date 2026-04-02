import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NoteColor, Theme } from '../types';
import { NOTE_COLORS, getNoteAccent } from '../utils/helpers';

interface Props {
  value: NoteColor;
  theme: Theme;
  onChange: (color: NoteColor) => void;
}

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {NOTE_COLORS.map((color) => {
        const accent = getNoteAccent(color);
        const selected = color === value;
        return (
          <TouchableOpacity
            key={color}
            onPress={() => onChange(color)}
            style={[
              styles.swatch,
              {
                backgroundColor: accent,
                transform: [{ scale: selected ? 1.15 : 1 }],
              },
            ]}
          >
            {selected && (
              <Ionicons name="checkmark" size={12} color="#fff" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
