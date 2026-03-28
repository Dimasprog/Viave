import React, { useEffect, useRef } from 'react';
import {
  Animated,
  type StyleProp,
  type TextStyle,
} from 'react-native';

type Props = {
  score: number;
  style?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

export function GameAnimatedScore({
  score,
  style,
  accessibilityLabel,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (prev.current === null) {
      prev.current = score;
      return;
    }
    if (prev.current === score) {
      return;
    }
    const from = prev.current;
    prev.current = score;
    const delta = score - from;

    scale.stopAnimation();
    translateY.stopAnimation();

    const runUp = () => {
      translateY.setValue(-7);
      scale.setValue(1.16);
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 6,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const runDown = () => {
      translateY.setValue(7);
      scale.setValue(0.9);
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 7,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();
    };

    if (delta > 0) {
      runUp();
    } else if (delta < 0) {
      runDown();
    }
  }, [score, scale, translateY]);

  return (
    <Animated.Text
      accessibilityLabel={accessibilityLabel}
      style={[
        style,
        { transform: [{ translateY }, { scale }] },
      ]}>
      {score}
    </Animated.Text>
  );
}
