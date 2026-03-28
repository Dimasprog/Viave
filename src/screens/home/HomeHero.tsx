import React from 'react';
import { Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useScaledSize } from '../../hooks/useScaledSize';
import { homeScreenStyles as styles } from './homeScreenStyles';
import { useHomeLayout } from './useHomeLayout';

export function HomeHero() {
  const { t } = useLanguage();
  const { body } = useScaledSize();
  const { isLandscape, contentWidth } = useHomeLayout();

  return (
    <View
      style={[
        styles.hero,
        isLandscape && { width: contentWidth, marginBottom: 0 },
      ]}>
      <Text style={[styles.muted, { fontSize: body }]}>
        {t('home_subtitle')}
      </Text>
    </View>
  );
}
