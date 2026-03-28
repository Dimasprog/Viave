import React from 'react';
import { Text, View } from 'react-native';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';
import { useScaledSize } from '../../hooks/useScaledSize';
import { gameScreenStyles as styles } from './gameScreenStyles';

type Variant = 'portrait' | 'landscape';

type Props = {
  variant: Variant;
};

export function GameTimeUpBanner({ variant }: Props) {
  const { phase } = useGame();
  const { t } = useLanguage();
  const { body } = useScaledSize();

  if (phase !== 'roundEnded') {
    return null;
  }

  if (variant === 'landscape') {
    return (
      <View
        style={[styles.banner, styles.bannerLandscape]}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive">
        <Text
          style={[
            styles.bannerText,
            styles.bannerTextLandscape,
            { fontSize: body - 1 },
          ]}>
          {t('game_time_up')}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={styles.banner}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive">
      <Text style={[styles.bannerText, { fontSize: body }]}>
        {t('game_time_up')}
      </Text>
    </View>
  );
}
