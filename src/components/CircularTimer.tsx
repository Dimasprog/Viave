import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { fonts } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

type Props = {
  remaining: number;
  totalSeconds: number;
  diameter: number;
  secondsFontSize: number;
};

/** 11 opriri: verde → galben-portocaliu → roșu (ratio timp rămas 1 → 0). */
const TIMER_GRADIENT_STOPS = [
  '#16a34a',
  '#22c55e',
  '#4ade80',
  '#84cc16',
  '#a3e635',
  '#d9f20a',
  '#eab308',
  '#f59e0b',
  '#f97316',
  '#fb7185',
  '#ef4444',
] as const;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = hex.replace('#', '');
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpHex(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(
    lerp(A.r, B.r, t),
    lerp(A.g, B.g, t),
    lerp(A.b, B.b, t),
  );
}

function timerAccentColor(ratio: number): string {
  const r = Math.max(0, Math.min(1, ratio));
  const stops = TIMER_GRADIENT_STOPS;
  const last = stops.length - 1;
  const pos = (1 - r) * last;
  const i = Math.min(Math.floor(pos), last - 1);
  const t = pos - i;
  return lerpHex(stops[i], stops[i + 1], t);
}

export function CircularTimer({
  remaining,
  totalSeconds,
  diameter,
  secondsFontSize,
}: Props) {
  const stroke = Math.max(5, Math.round(diameter * 0.085));
  const edgeInset = Math.max(1, stroke * 0.35 + 0.5);
  const cx = diameter / 2;
  const cy = diameter / 2;
  const r = Math.max(2, (diameter - stroke) / 2 - edgeInset);
  const circumference = useMemo(() => 2 * Math.PI * r, [r]);

  const ratio =
    totalSeconds > 0
      ? Math.max(0, Math.min(1, remaining / totalSeconds))
      : 0;
  const targetOffset = circumference * (1 - ratio);

  const dashAnim = useRef(new Animated.Value(targetOffset)).current;
  const digitScale = useRef(new Animated.Value(1)).current;
  const prevRemaining = useRef(remaining);
  const didSyncDash = useRef(false);

  useEffect(() => {
    if (!didSyncDash.current) {
      didSyncDash.current = true;
      dashAnim.setValue(targetOffset);
      return;
    }
    Animated.timing(dashAnim, {
      toValue: targetOffset,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [targetOffset, dashAnim]);

  useEffect(() => {
    if (prevRemaining.current === remaining) {
      return;
    }
    prevRemaining.current = remaining;
    digitScale.setValue(1.12);
    Animated.spring(digitScale, {
      toValue: 1,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [remaining, digitScale]);

  const accent = timerAccentColor(ratio);
  const track = '#2d3748';

  return (
    <View
      accessible={false}
      style={[styles.wrap, { width: diameter, height: diameter }]}>
      <Svg
        width={diameter}
        height={diameter}
        style={StyleSheet.absoluteFill}
        viewBox={`0 0 ${diameter} ${diameter}`}>
        <G transform={`rotate(-90 ${cx} ${cy})`}>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={track}
            strokeWidth={stroke}
            fill="none"
          />
          <AnimatedCircle
            cx={cx}
            cy={cy}
            r={r}
            stroke={accent}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={dashAnim}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <AnimatedText
        style={[
          styles.seconds,
          {
            fontSize: secondsFontSize,
            color: accent,
            transform: [{ scale: digitScale }],
          },
        ]}
        numberOfLines={1}>
        {remaining}
      </AnimatedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  seconds: {
    fontFamily: fonts.extraBold,
    fontVariant: ['tabular-nums'],
  },
});
