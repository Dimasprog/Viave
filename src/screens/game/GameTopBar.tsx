import React, { useMemo } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircularTimer } from '../../components/CircularTimer';
import { CloseGlyphIcon } from '../../components/icons/CloseGlyphIcon';
import { PlayIcon } from '../../components/icons/PlayIcon';
import type { GamePhase } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';
import { useScaledSize } from '../../hooks/useScaledSize';
import { colors } from '../../theme';
import { landscapeSideExtra } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { gameScreenStyles as styles } from './gameScreenStyles';

type Props = {
  remaining: number;
  roundSeconds: number;
  paused: boolean;
  phase: GamePhase;
  onTogglePause: () => void;
  onRequestExitConfirm: () => void;
};

export function GameTopBar({
  remaining,
  roundSeconds,
  paused,
  phase,
  onTogglePause,
  onRequestExitConfirm,
}: Props) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { minDim, button } = useScaledSize();

  const roundEnded = phase === 'roundEnded';
  const canPause =
    (phase === 'playing' || paused) && phase !== 'roundEnded';

  const landPadX = landscapeSideExtra(width > height);
  const paddingTop = insets.top + spacing.sm;
  const paddingLeft = Math.max(insets.left, spacing.lg) + landPadX;
  const paddingRight = Math.max(insets.right, spacing.lg) + landPadX;

  const timerDiameter = useMemo(
    () => Math.max(88, Math.min(130, minDim * 0.26)),
    [minDim],
  );
  const timerFont = useMemo(
    () => Math.max(22, Math.min(34, minDim * 0.065)),
    [minDim],
  );

  const timerA11yLabel = t('timer_accessibility', { seconds: remaining });
  const playIconSize = Math.max(16, Math.min(22, button));

  return (
    <View
      style={[
        styles.topBar,
        {
          paddingTop,
          paddingLeft,
          paddingRight,
        },
      ]}>
      <View style={styles.topBarSide} />
      <View
        style={styles.topBarCenter}
        accessibilityRole="timer"
        accessibilityLabel={timerA11yLabel}
        accessibilityLiveRegion="polite">
        <View style={paused ? styles.timerDimmed : undefined}>
          <CircularTimer
            remaining={remaining}
            totalSeconds={roundSeconds}
            diameter={timerDiameter}
            secondsFontSize={timerFont}
          />
        </View>
      </View>
      <View style={styles.topBarSide}>
        {roundEnded ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('game_stop')}
            accessibilityHint={t('a11y_end_game_round')}
            onPress={onRequestExitConfirm}
            style={({ pressed }) => [
              styles.pauseBtn,
              pressed && styles.pauseBtnPressed,
            ]}>
            {({ pressed }) => (
              <CloseGlyphIcon
                size={22}
                color={pressed ? '#fff' : colors.textMuted}
              />
            )}
          </Pressable>
        ) : canPause ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={paused ? t('game_resume') : t('game_pause')}
            accessibilityHint={paused ? t('a11y_resume') : t('a11y_pause')}
            onPress={onTogglePause}
            style={({ pressed }) => [
              styles.pauseBtn,
              pressed && styles.pauseBtnPressed,
            ]}>
            {({ pressed }) =>
              paused ? (
                <PlayIcon size={playIconSize} color="#fff" />
              ) : (
                <View style={styles.pauseBars} importantForAccessibility="no">
                  <View
                    style={[
                      styles.pauseBar,
                      pressed && styles.pauseBarOnAccent,
                    ]}
                  />
                  <View
                    style={[
                      styles.pauseBar,
                      pressed && styles.pauseBarOnAccent,
                    ]}
                  />
                </View>
              )
            }
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
