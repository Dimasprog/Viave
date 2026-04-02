import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useScaledSize } from '../../hooks/useScaledSize';
import { gameScreenStyles as styles } from './gameScreenStyles';

export function GameLanguageToggle() {
  const { language, t, setLanguage } = useLanguage();
  const { button, isLandscape } = useScaledSize();
  const chipFont = Math.max(12, Math.min(15, button - 3));

  return (
    <View
      style={isLandscape ? styles.langRow : styles.langCol}
      accessibilityRole="toolbar"
    >
      {(['ro', 'ru'] as const).map(lang => (
        <Pressable
          key={lang}
          accessibilityRole="button"
          accessibilityLabel={lang === 'ro' ? t('lang_ro') : t('lang_ru')}
          accessibilityHint={t('a11y_language')}
          accessibilityState={{ selected: language === lang }}
          onPress={() => setLanguage(lang)}
          style={({ pressed }) => [
            styles.langChip,
            language === lang && styles.langChipSelected,
            pressed && styles.langChipPressed,
          ]}
        >
          <Text style={[styles.langChipText, { fontSize: chipFont }]}>
            {lang === 'ro' ? t('lang_ro') : t('lang_ru')}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
