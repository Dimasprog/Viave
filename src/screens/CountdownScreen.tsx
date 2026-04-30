import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useGame } from '../context/GameContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Countdown'>;

const STEPS = ['3', '2', '1', 'GO!'] as const;
const HOLD_MS = 800;
const FADE_MS = 120;
const CIRCLE_SIZE = 210;

export function CountdownScreen({ navigation }: Props) {
  const { phase } = useGame();
  const [stepIndex, setStepIndex] = useState(0);
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const navigatedRef = useRef(false);

  const goToGame = useCallback(() => {
    if (navigatedRef.current) {
      return;
    }
    navigatedRef.current = true;
    navigation.replace('Game');
  }, [navigation]);

  // If game phase is no longer idle (e.g. stale nav), bail out
  useEffect(() => {
    if (phase === 'roundEnded') {
      navigation.replace('RoundSummary');
    }
  }, [phase, navigation]);

  useEffect(() => {
    scale.setValue(0.5);
    opacity.setValue(0);

    const animIn = Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: FADE_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    animIn.start();

    const holdTimer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        if (stepIndex < STEPS.length - 1) {
          setStepIndex(i => i + 1);
        } else {
          goToGame();
        }
      });
    }, HOLD_MS);

    return () => {
      clearTimeout(holdTimer);
      animIn.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  const label = STEPS[stepIndex] ?? '3';
  const isGo = stepIndex === STEPS.length - 1;

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.circle,
          isGo && styles.circleGo,
          { opacity, transform: [{ scale }] },
        ]}>
        <Animated.Text
          style={[styles.label, isGo && styles.labelGo]}
          accessibilityRole="text"
          accessibilityLabel={label}>
          {label}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 5,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleGo: {
    borderColor: colors.success,
    backgroundColor: colors.surface,
  },
  label: {
    fontFamily: fonts.extraBold,
    fontSize: 96,
    color: colors.text,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  labelGo: {
    fontSize: 52,
    color: colors.success,
  },
});
