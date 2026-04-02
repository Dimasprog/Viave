import React from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  ROUND_SECONDS_OPTIONS,
  type RoundSecondsOption,
} from '../../constants/game';
import { useLanguage } from '../../context/LanguageContext';
import { useScaledSize } from '../../hooks/useScaledSize';
import { homeScreenStyles as styles } from './homeScreenStyles';
import { HomeOptionScroll } from './HomeOptionScroll';
import { useHomeLayout } from './useHomeLayout';

type Props = {
  roundSeconds: RoundSecondsOption;
  onSelectSeconds: (sec: RoundSecondsOption) => void;
};

export function HomeRoundTimeCard({
  roundSeconds,
  onSelectSeconds,
}: Props) {
  const { t } = useLanguage();
  const { button } = useScaledSize();
  const { cardStyle } = useHomeLayout();

  return (
    <View style={cardStyle}>
      <Text style={styles.label} accessibilityRole="header">
        {t('round_time_label')}
      </Text>
      <HomeOptionScroll>
        {ROUND_SECONDS_OPTIONS.map(sec => (
          <Pressable
            key={sec}
            accessibilityRole="button"
            accessibilityLabel={t('round_time_seconds', { seconds: sec })}
            accessibilityHint={t('a11y_round_time')}
            accessibilityState={{ selected: roundSeconds === sec }}
            onPress={() => onSelectSeconds(sec)}
            style={({ pressed }) => [
              styles.chip,
              roundSeconds === sec && styles.chipSelected,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.chipText, { fontSize: button }]}>
              {t('round_time_seconds', { seconds: sec })}
            </Text>
          </Pressable>
        ))}
      </HomeOptionScroll>
    </View>
  );
}
