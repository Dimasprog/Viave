import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircularTimer } from '../../components/CircularTimer';
import { PlayIcon } from '../../components/icons/PlayIcon';
import type { GamePhase } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';
import { useScaledSize } from '../../hooks/useScaledSize';
import { landscapeSideExtra } from '../../theme/layout';
import { spacing } from '../../theme/spacing';
import { GameLanguageToggle } from './GameLanguageToggle';
import { gameScreenStyles as styles } from './gameScreenStyles';

type Props = {
  remaining: number;
  roundSeconds: number;
  paused: boolean;
  phase: GamePhase;
  onTogglePause: () => void;
};

export function GameTopBar({
  remaining,
  roundSeconds,
  paused,
  phase,
  onTogglePause,
}: Props) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { minDim, button, isLandscape } = useScaledSize();

  const canPause = phase === 'playing' || paused;

  const landPadX = landscapeSideExtra(isLandscape);
  const paddingTop = insets.top + spacing.sm;
  const paddingLeft = Math.max(insets.left, spacing.lg) + landPadX;
  const paddingRight = Math.max(insets.right, spacing.lg) + landPadX;
  const paddingBottom = isLandscape ? spacing.md : spacing.sm;

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

  const timerOverlayInset = useMemo(
    () => ({
      top: paddingTop,
      left: paddingLeft,
      right: paddingRight,
      bottom: paddingBottom,
    }),
    [paddingBottom, paddingLeft, paddingRight, paddingTop],
  );

  const barMinHeight = useMemo(() => {
    const contentMin = Math.max(
      timerDiameter,
      isLandscape ? timerDiameter + spacing.lg : 72,
    );
    return paddingTop + contentMin + paddingBottom;
  }, [isLandscape, paddingBottom, paddingTop, timerDiameter]);

  return (
    <View
      style={[
        styles.topBar,
        {
          paddingTop,
          paddingLeft,
          paddingRight,
          paddingBottom,
          minHeight: barMinHeight,
        },
      ]}>
      <View
        style={[styles.topBarTimerCenter, timerOverlayInset]}
        pointerEvents="box-none">
        <View
          accessibilityRole="timer"
          accessibilityLabel={timerA11yLabel}
          accessibilityLiveRegion="polite"
          pointerEvents="none">
          <View style={paused ? styles.timerDimmed : undefined}>
            <CircularTimer
              remaining={remaining}
              totalSeconds={roundSeconds}
              diameter={timerDiameter}
              secondsFontSize={timerFont}
            />
          </View>
        </View>
      </View>
      <View style={styles.topBarRow}>
        <View style={styles.topBarSideLang}>
          <GameLanguageToggle />
        </View>
        <View style={styles.topBarFlexSpacer} />
        <View style={styles.topBarSide}>
          {canPause ? (
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
    </View>
  );
}
