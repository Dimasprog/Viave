import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../theme';

export const roundSummaryStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  main: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
  wordList: {
    gap: spacing.sm,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingRight: spacing.xs,
  },
  wordRowIndex: {
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    textAlign: 'right',
    paddingRight: spacing.xs,
  },
  wordRowIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordRowText: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  emptyText: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingTop: spacing.md,
  },
  nextBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 14,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  nextBtnPressed: {
    backgroundColor: colors.accentPressed,
  },
  nextBtnText: {
    color: '#fff',
    fontFamily: fonts.extraBold,
  },
});
