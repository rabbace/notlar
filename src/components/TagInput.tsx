import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../types';
import { getColors } from '../theme';
import { getTagColor } from '../utils/helpers';

interface Props {
  tags: string[];
  theme: Theme;
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, theme, onChange }: Props) {
  const C = getColors(theme);
  const [input, setInput] = useState('');

  const commit = () => {
    const tag = input.trim().replace(/^#+/, '');
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput('');
  };

  const remove = (tag: string) => onChange(tags.filter((t) => t !== tag));

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {tags.map((tag) => {
          const color = getTagColor(tag);
          return (
            <View
              key={tag}
              style={[styles.chip, { backgroundColor: color + '28', borderColor: color + '60' }]}
            >
              <Text
                style={[styles.chipText, { color, fontFamily: 'Outfit_400Regular' }]}
              >
                #{tag}
              </Text>
              <TouchableOpacity onPress={() => remove(tag)} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}>
                <Ionicons name="close" size={12} color={color} />
              </TouchableOpacity>
            </View>
          );
        })}

        <View
          style={[
            styles.inputWrap,
            { borderColor: C.border, backgroundColor: C.inputBg },
          ]}
        >
          <Text style={[styles.hash, { color: C.textTertiary }]}>#</Text>
          <TextInput
            style={[styles.input, { color: C.text, fontFamily: 'Outfit_400Regular' }]}
            value={input}
            onChangeText={setInput}
            placeholder="etiket ekle"
            placeholderTextColor={C.textTertiary}
            returnKeyType="done"
            blurOnSubmit={false}
            onSubmitEditing={commit}
            onBlur={commit}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 34 },
  scroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: { fontSize: 12 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 90,
  },
  hash: { fontSize: 12, marginRight: 2 },
  input: { fontSize: 12, minWidth: 60, paddingVertical: 0 },
});
