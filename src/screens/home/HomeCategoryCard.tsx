import React from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  WORD_CATEGORY_IDS,
  CATEGORY_I18N_KEY,
  type WordCategoryId,
} from '../../data/categories';
import { useLanguage } from '../../context/LanguageContext';
import type { TranslationKey } from '../../i18n/translations';
import { useScaledSize } from '../../hooks/useScaledSize';
import { homeScreenStyles as styles } from './homeScreenStyles';
import { HomeOptionScroll } from './HomeOptionScroll';
import { useHomeLayout } from './useHomeLayout';

type Props = {
  category: WordCategoryId;
  onSelectCategory: (id: WordCategoryId) => void;
};

export function HomeCategoryCard({ category, onSelectCategory }: Props) {
  const { t } = useLanguage();
  const { button } = useScaledSize();
  const { cardStyle } = useHomeLayout();

  return (
    <View style={cardStyle}>
      <Text style={styles.label} accessibilityRole="header">
        {t('category_label')}
      </Text>
      <HomeOptionScroll>
        {WORD_CATEGORY_IDS.map(id => (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={t(CATEGORY_I18N_KEY[id] as TranslationKey)}
            accessibilityHint={t('a11y_category')}
            accessibilityState={{ selected: category === id }}
            onPress={() => onSelectCategory(id)}
            style={({ pressed }) => [
              styles.chip,
              category === id && styles.chipSelected,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.chipText, { fontSize: button }]}>
              {t(CATEGORY_I18N_KEY[id] as TranslationKey)}
            </Text>
          </Pressable>
        ))}
      </HomeOptionScroll>
    </View>
  );
}
