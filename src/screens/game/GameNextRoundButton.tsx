import React from 'react';
import { Pressable, Text } from 'react-native';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';
import { gameScreenStyles as styles } from './gameScreenStyles';
import { useGameScreenLayout } from './useGameScreenLayout';

type Props = {
  compact: boolean;
};

export function GameNextRoundButton({ compact }: Props) {
  const { t } = useLanguage();
  const { phase, nextRound } = useGame();
  const { button, actionBtnWidthLandscape } = useGameScreenLayout();

  if (phase !== 'roundEnded') {
    return null;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('game_next_round')}
      accessibilityHint={t('a11y_next_round_hint')}
      onPress={nextRound}
      style={({ pressed }) => [
        styles.nextRoundBtn,
        ...(compact
          ? [
              styles.nextRoundBtnCompact,
              { width: actionBtnWidthLandscape },
            ]
          : []),
        pressed && styles.nextRoundBtnPressed,
      ]}>
      <Text style={[styles.nextRoundText, { fontSize: button }]} numberOfLines={1}>
        {t('game_next_round')}
      </Text>
    </Pressable>
  );
}
