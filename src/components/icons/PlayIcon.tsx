import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

/**
 * Play glyph with soft left edge and tapered tip (reads clearly at small sizes).
 * Vector-only — no font/emoji fallbacks on iOS.
 */
export function PlayIcon({ size = 18, color = '#fff' }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Path
        fill={color}
        d="M8 5.16v13.68c0 .63.65 1.04 1.2.73l10.52-6.26c.55-.33.55-1.13 0-1.46L9.2 4.59A.86.86 0 0 0 8 5.16Z"
      />
    </Svg>
  );
}
