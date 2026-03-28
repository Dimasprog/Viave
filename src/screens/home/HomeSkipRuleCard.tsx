import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useScaledSize } from '../../hooks/useScaledSize';
import { homeScreenStyles as styles } from './homeScreenStyles';
import { useHomeLayout } from './useHomeLayout';

type Props = {
  skipPenalizesScore: boolean;
  onSelectSkipPenalizes: (value: boolean) => void;
};

export function HomeSkipRuleCard({
  skipPenalizesScore,
  onSelectSkipPenalizes,
}: Props) {
  const { t } = useLanguage();
  const { button } = useScaledSize();
  const { cardStyle } = useHomeLayout();

  return (
    <View style={cardStyle}>
      <Text style={styles.label} accessibilityRole="header">
        {t('skip_rule_label')}
      </Text>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('skip_rule_yes')}
          accessibilityHint={t('a11y_skip_rule')}
          accessibilityState={{ selected: skipPenalizesScore }}
          onPress={() => onSelectSkipPenalizes(true)}
          style={({ pressed }) => [
            styles.chip,
            skipPenalizesScore && styles.chipSelected,
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.chipText, { fontSize: button }]}>
            {t('skip_rule_yes')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('skip_rule_no')}
          accessibilityHint={t('a11y_skip_rule')}
          accessibilityState={{ selected: !skipPenalizesScore }}
          onPress={() => onSelectSkipPenalizes(false)}
          style={({ pressed }) => [
            styles.chip,
            !skipPenalizesScore && styles.chipSelected,
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.chipText, { fontSize: button }]}>
            {t('skip_rule_no')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
