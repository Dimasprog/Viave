import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScaledSize } from '../../hooks/useScaledSize';
import { spacing } from '../../theme/spacing';
import { homeScreenStyles as styles } from './homeScreenStyles';

/**
 * Padding, grid width și stil card pentru Home — același rezultat oriunde e apelat.
 */
export function useHomeLayout() {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { isLandscape, landscapeSideExtra: landPadX } = useScaledSize();

  const padLeft = Math.max(insets.left, spacing.lg) + landPadX;
  const padRight = Math.max(insets.right, spacing.lg) + landPadX;
  const contentW = windowWidth - padLeft - padRight;
  const landGap = spacing.md;

  const halfCardW = useMemo(() => (contentW - landGap) / 2, [contentW, landGap]);

  const cardStyle = useMemo(
    () => (isLandscape ? [styles.card, { width: halfCardW }] : styles.card),
    [isLandscape, halfCardW],
  );

  const scrollContentPadding = useMemo(
    () => ({
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
      paddingLeft: padLeft,
      paddingRight: padRight,
    }),
    [padLeft, padRight],
  );

  const footerPadding = useMemo(
    () => ({
      paddingTop: spacing.md,
      paddingBottom: Math.max(insets.bottom, spacing.lg),
      paddingLeft: padLeft,
      paddingRight: padRight,
    }),
    [padLeft, padRight, insets.bottom],
  );

  return {
    isLandscape,
    contentWidth: contentW,
    landGap,
    cardStyle,
    scrollContentPadding,
    footerPadding,
  };
}
