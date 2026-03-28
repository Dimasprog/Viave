import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../../theme';
import { colors } from '../../theme/colors';

type Props = {
  wordIndex: number;
  text: string;
  fontSize: number;
  numberOfLines: number;
  minimumFontScale: number;
  landscape?: boolean;
};

/**
 * Fade + slide la schimbarea cuvântului; intrare la primul frame unic.
 */
export function GameAnimatedWord({
  wordIndex,
  text,
  fontSize,
  numberOfLines,
  minimumFontScale,
  landscape,
}: Props) {
  const [displayText, setDisplayText] = useState(text);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    const key = `${wordIndex}:${text}`;
    if (lastKey.current === key) {
      return;
    }
    const isFirst = lastKey.current === null;
    lastKey.current = key;

    const slideOut = landscape ? -6 : -8;
    const slideIn = landscape ? 8 : 12;

    if (isFirst) {
      setDisplayText(text);
      opacity.setValue(0);
      translateY.setValue(slideIn + 4);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 130,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: slideOut,
        duration: 130,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDisplayText(text);
      translateY.setValue(slideIn);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 7,
          tension: 72,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [wordIndex, text, landscape, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.clip,
        { opacity, transform: [{ translateY }] },
      ]}>
      <Text
        accessibilityRole="text"
        style={[styles.word, { fontSize }]}
        numberOfLines={numberOfLines}
        adjustsFontSizeToFit
        minimumFontScale={minimumFontScale}>
        {displayText}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
    width: '100%',
  },
  word: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
