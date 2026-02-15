import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';

export default function SearchBar({ value, onChangeText, onClear }) {
  const { theme } = useTheme();
  const { t } = useI18n();

  return (
    <View style={[styles.container, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
      <Ionicons name="search-outline" size={16} color={theme.inputPlaceholder} />
      <TextInput
        style={[styles.input, { color: theme.inputText }]}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor={theme.inputPlaceholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value ? (
        <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={16} color={theme.inputPlaceholder} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
});
