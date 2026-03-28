import React from 'react';
import { Text, View } from 'react-native';
import type { TribeKey } from '../../constants/tribes';
import { tribeTranslationKey } from '../../constants/tribes';
import { useLanguage } from '../../context/LanguageContext';
import { useScaledSize } from '../../hooks/useScaledSize';
import { GameAnimatedScore } from './GameAnimatedScore';
import { gameScreenStyles as styles } from './gameScreenStyles';

type Props = {
  tribeKeys: readonly TribeKey[];
  scores: number[];
  currentTeamIndex: number;
};

export function GameScoreBoard({
  tribeKeys,
  scores,
  currentTeamIndex,
}: Props) {
  const { t } = useLanguage();
  const { body } = useScaledSize();

  return (
    <View style={styles.scoreCard}>
      <Text style={styles.scoreTitle} accessibilityRole="header">
        {t('game_team_scores')}
      </Text>
      {tribeKeys.map((key, i) => {
        const label = t(tribeTranslationKey(key));
        const score = scores[i] ?? 0;
        const active = i === currentTeamIndex;
        const line = `${label}: ${score}`;
        return (
          <View
            key={key}
            style={[styles.scoreRow, !active && styles.scoreRowDimmed]}>
            <Text
              style={[styles.scoreName, { fontSize: body }]}
              numberOfLines={1}>
              {label}
            </Text>
            <GameAnimatedScore
              score={score}
              style={[styles.scoreValue, { fontSize: body + 2 }]}
              accessibilityLabel={line}
            />
          </View>
        );
      })}
    </View>
  );
}
