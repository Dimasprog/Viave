import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScaledSize } from '../../hooks/useScaledSize';
import { spacing } from '../../theme/spacing';

/**
 * Metrici comune pentru GameScreen și subcomponente (padding, lățimi acțiuni).
 */
export function useGameScreenLayout() {
  const scaled = useScaledSize();
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { landscapeSideExtra: landPadX, body } = scaled;

  const padH = Math.max(insets.left, spacing.lg) + landPadX;
  const padHRight = Math.max(insets.right, spacing.lg) + landPadX;
  const contentInnerWidth = windowWidth - padH - padHRight;
  const actionGap = spacing.md;
  const landColumnGap = useMemo(
    () =>
      Math.max(
        spacing.xxl + spacing.md,
        Math.round(contentInnerWidth * 0.05),
      ),
    [contentInnerWidth],
  );
  const landHalfInner = (contentInnerWidth - landColumnGap) / 2;
  const actionBtnWidthPortrait = Math.max(
    120,
    (contentInnerWidth - actionGap) / 2,
  );
  const actionBtnWidthLandscape = Math.max(120, landHalfInner);
  const actionIconSize = Math.max(22, Math.min(30, Math.round(body + 4)));

  return {
    ...scaled,
    padH,
    padHRight,
    contentInnerWidth,
    actionGap,
    landColumnGap,
    actionBtnWidthPortrait,
    actionBtnWidthLandscape,
    actionIconSize,
  };
}
