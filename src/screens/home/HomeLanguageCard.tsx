import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useScaledSize } from '../../hooks/useScaledSize';
import { homeScreenStyles as styles } from './homeScreenStyles';
import { HomeOptionScroll } from './HomeOptionScroll';
import { useHomeLayout } from './useHomeLayout';

export function HomeLanguageCard() {
  const { language, t, setLanguage } = useLanguage();
  const { button } = useScaledSize();
  const { cardStyle } = useHomeLayout();

  return (
    <View style={cardStyle}>
      <Text style={styles.label} accessibilityRole="header">
        {t('language_label')}
      </Text>
      <HomeOptionScroll>
        {(['ro', 'ru'] as const).map(lang => (
          <Pressable
            key={lang}
            accessibilityRole="button"
            accessibilityLabel={lang === 'ro' ? t('lang_ro') : t('lang_ru')}
            accessibilityHint={t('a11y_language')}
            accessibilityState={{ selected: language === lang }}
            onPress={() => setLanguage(lang)}
            style={({ pressed }) => [
              styles.chip,
              language === lang && styles.chipSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.chipText, { fontSize: button }]}>
              {lang === 'ro' ? t('lang_ro') : t('lang_ru')}
            </Text>
          </Pressable>
        ))}
      </HomeOptionScroll>
    </View>
  );
}
