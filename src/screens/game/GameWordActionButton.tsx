import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { CheckIcon } from '../../components/icons/CheckIcon';
import { CrossIcon } from '../../components/icons/CrossIcon';
import { useLanguage } from '../../context/LanguageContext';
import { gameScreenStyles as styles } from './gameScreenStyles';
import { useGameScreenLayout } from './useGameScreenLayout';

type Variant = 'skip' | 'guess';
type LayoutMode = 'portrait' | 'landscape';

type Props = {
  variant: Variant;
  disabled: boolean;
  onPress: () => void;
  layout: LayoutMode;
};

export function GameWordActionButton({
  variant,
  disabled,
  onPress,
  layout,
}: Props) {
  const { t } = useLanguage();
  const {
    actionBtnWidthPortrait,
    actionBtnWidthLandscape,
    actionIconSize,
    button,
  } = useGameScreenLayout();

  const width =
    layout === 'portrait'
      ? actionBtnWidthPortrait
      : actionBtnWidthLandscape;
  const labelFontSize = button - 1;

  const label =
    variant === 'skip' ? t('game_skip') : t('game_guess');
  const hint =
    variant === 'skip' ? t('a11y_skip_hint') : t('a11y_guess_hint');

  const colorStyle =
    variant === 'skip' ? styles.wideActionRed : styles.wideActionGreen;

  const scale = useRef(new Animated.Value(1)).current;

  const springTo = (to: number) => {
    Animated.spring(scale, {
      toValue: to,
      friction: 5,
      tension: 280,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={() => {
        if (!disabled) {
          springTo(0.93);
        }
      }}
      onPressOut={() => {
        springTo(1);
      }}
      onPress={onPress}
      style={{ width }}>
      <Animated.View
        style={[
          styles.wideActionBtn,
          colorStyle,
          { width, transform: [{ scale }] },
          disabled && styles.wideActionDisabled,
        ]}>
        <View style={styles.wideActionInner}>
          {variant === 'skip' ? (
            <CrossIcon size={actionIconSize} color="#fff" />
          ) : (
            <CheckIcon size={actionIconSize} color="#fff" />
          )}
          <Text style={[styles.wideActionLabel, { fontSize: labelFontSize }]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
