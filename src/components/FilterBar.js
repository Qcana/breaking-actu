import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../constants';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import { selectionTap } from '../utils/haptics';

const FILTER_ORDER = ['all', 'international', 'politique', 'economie', 'societe', 'technology', 'science', 'sports'];

export default function FilterBar({ selectedCategory, onSelectCategory }) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const [modalVisible, setModalVisible] = useState(false);

  const activeCat = CATEGORIES[selectedCategory];

  const handleSelect = (key) => {
    selectionTap();
    onSelectCategory(key);
    setModalVisible(false);
  };

  return (
    <View style={styles.bar}>
      {/* Chip active */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        style={[
          styles.chip,
          { backgroundColor: activeCat.bg, borderColor: activeCat.color + '80' },
        ]}
      >
        <Text style={styles.chipEmoji}>{activeCat.emoji}</Text>
        <Text style={[styles.chipText, { color: activeCat.color }]}>
          {t(activeCat.labelKey)}
        </Text>
        <Ionicons name="chevron-down" size={14} color={activeCat.color} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={[styles.modal, { backgroundColor: theme.bg, borderColor: theme.settingsBorder }]}>
            <Text style={[styles.modalTitle, { color: theme.textTitle }]}>
              {t('filterCategories')}
            </Text>
            <View style={styles.grid}>
              {FILTER_ORDER.map((key) => {
                const cat = CATEGORIES[key];
                const isActive = selectedCategory === key;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => handleSelect(key)}
                    activeOpacity={0.7}
                    style={[
                      styles.gridItem,
                      { backgroundColor: theme.chipBg },
                      isActive && { backgroundColor: cat.bg, borderColor: cat.color + '80' },
                    ]}
                  >
                    <Text style={styles.gridEmoji}>{cat.emoji}</Text>
                    <Text
                      style={[
                        styles.gridText,
                        { color: theme.chipText },
                        isActive && { color: cat.color },
                      ]}
                    >
                      {t(cat.labelKey)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipEmoji: {
    fontSize: 12,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  gridEmoji: {
    fontSize: 14,
  },
  gridText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
