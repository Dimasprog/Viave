import React from 'react';
import Svg, { Polyline } from 'react-native-svg';
import { colors } from '../../theme';

type Props = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** Verificare verde — cuvânt ghicit în rezumatul rundei. */
export function RoundSummaryGuessedIcon({
  size = 22,
  color = colors.success,
  strokeWidth = 2.75,
}: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      accessibilityElementsHidden>
      <Polyline
        points="6,12 10.5,16.5 18,7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
