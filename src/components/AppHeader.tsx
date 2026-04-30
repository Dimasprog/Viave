import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../theme';
import { landscapeSideExtra } from '../theme/layout';

type Props = {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
};

export function AppHeader({ title, subtitle, rightAction }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const sideX = landscapeSideExtra(width > height);
  const padH = Math.max(insets.left, spacing.lg) + sideX;
  const padHRight = Math.max(insets.right, spacing.lg) + sideX;

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: Math.max(insets.top, spacing.md),
          paddingBottom: spacing.md,
          paddingLeft: padH,
          paddingRight: padHRight,
        },
      ]}
      accessibilityRole="header">
      <View style={styles.topRow}>
        <View style={styles.textBlock}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {rightAction != null ? (
          <View style={styles.rightSlot}>{rightAction}</View>
        ) : null}
      </View>
      <View style={styles.accentRow}>
        <View style={styles.accentBar} />
        <View style={styles.accentFade} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  rightSlot: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontFamily: fonts.extraBold,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: fonts.medium,
    lineHeight: 20,
  },
  accentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  accentBar: {
    height: 3,
    width: 40,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  accentFade: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    opacity: 0.85,
  },
});
