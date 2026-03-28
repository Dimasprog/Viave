import { useWindowDimensions } from 'react-native';
import { landscapeSideExtra } from '../theme/layout';

/**
 * Responsive typography and layout hints from the smaller screen edge.
 */
export function useScaledSize() {
  const { width, height } = useWindowDimensions();
  const minDim = Math.min(width, height);
  const maxDim = Math.max(width, height);
  const isLandscape = width > height;

  const title = Math.max(20, Math.min(44, minDim * 0.052));
  const body = Math.max(15, Math.min(22, minDim * 0.038));
  const word = Math.max(28, Math.min(80, minDim * 0.095));
  const timer = Math.max(22, Math.min(40, minDim * 0.055));
  const button = Math.max(16, Math.min(22, minDim * 0.04));

  return {
    width,
    height,
    minDim,
    maxDim,
    isLandscape,
    landscapeSideExtra: landscapeSideExtra(isLandscape),
    title,
    body,
    word,
    timer,
    button,
  };
}
