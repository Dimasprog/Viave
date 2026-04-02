import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme';

type Props = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** Cruce roșie — cuvânt omis / trecut în rezumatul rundei. */
export function RoundSummaryMissedIcon({
  size = 22,
  color = colors.danger,
  strokeWidth = 2.75,
}: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      accessibilityElementsHidden>
      <Path
        d="M7 7 L17 17 M17 7 L7 17"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
