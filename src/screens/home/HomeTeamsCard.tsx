import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { TeamCount } from '../../constants/tribes';
import { useLanguage } from '../../context/LanguageContext';
import type { TranslationKey } from '../../i18n/translations';
import { useScaledSize } from '../../hooks/useScaledSize';
import { homeScreenStyles as styles } from './homeScreenStyles';
import { HomeOptionScroll } from './HomeOptionScroll';
import { useHomeLayout } from './useHomeLayout';

const TEAM_OPTIONS: TeamCount[] = [2, 3, 4];

type Props = {
  teamCount: TeamCount;
  onSelectTeamCount: (n: TeamCount) => void;
};

export function HomeTeamsCard({ teamCount, onSelectTeamCount }: Props) {
  const { t } = useLanguage();
  const { button } = useScaledSize();
  const { cardStyle } = useHomeLayout();

  return (
    <View style={cardStyle}>
      <Text style={styles.label} accessibilityRole="header">
        {t('teams_label')}
      </Text>
      <HomeOptionScroll>
        {TEAM_OPTIONS.map(n => (
          <Pressable
            key={n}
            accessibilityRole="button"
            accessibilityLabel={t(`team_count_${n}` as TranslationKey)}
            accessibilityHint={t('a11y_team_count')}
            accessibilityState={{ selected: teamCount === n }}
            onPress={() => onSelectTeamCount(n)}
            style={({ pressed }) => [
              styles.chip,
              teamCount === n && styles.chipSelected,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.chipText, { fontSize: button }]}>
              {t(`team_count_${n}` as TranslationKey)}
            </Text>
          </Pressable>
        ))}
      </HomeOptionScroll>
    </View>
  );
}
