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
    gap: spacing.xs,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingRight: spacing.xs,
    paddingLeft: spacing.xs,
    borderRadius: 10,
  },
  wordRowPressed: {
    backgroundColor: colors.surfaceElevated,
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
  wordRowCheck: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 1.5,
  },
  wordRowCheckGuessed: {
    borderColor: colors.success,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  wordRowCheckMissed: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.10)',
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
  // Score board
  scoreBoardContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  scoreBoardTitle: {
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scoreBoardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  scoreChip: {
    flex: 1,
    minWidth: 64,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  scoreChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.chipSelected,
  },
  scoreChipName: {
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  scoreChipNameActive: {
    color: colors.accent,
  },
  scoreChipValue: {
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  scoreChipValueActive: {
    color: colors.text,
  },
  // Footer
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
