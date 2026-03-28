import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useScaledSize } from '../../hooks/useScaledSize';
import { gameScreenStyles as styles } from './gameScreenStyles';

type PauseProps = {
  visible: boolean;
  onResume: () => void;
  onExitToMenu: () => void;
};

export function GamePauseModal({
  visible,
  onResume,
  onExitToMenu,
}: PauseProps) {
  const { t } = useLanguage();
  const { body, button } = useScaledSize();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onResume}
      statusBarTranslucent>
      <View style={styles.pauseModalRoot}>
        <View style={styles.pauseCard}>
          <Text
            style={[styles.pauseTitle, { fontSize: body + 4 }]}
            accessibilityRole="header">
            {t('game_paused_title')}
          </Text>
          <Text style={[styles.pauseHint, { fontSize: body - 1 }]}>
            {t('game_paused_hint')}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('game_resume')}
            accessibilityHint={t('a11y_resume')}
            onPress={onResume}
            style={({ pressed }) => [
              styles.pausePrimaryBtn,
              pressed && styles.pausePrimaryBtnPressed,
            ]}>
            <Text style={[styles.pausePrimaryText, { fontSize: button }]}>
              {t('game_resume')}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('game_exit')}
            accessibilityHint={t('a11y_exit_game')}
            onPress={onExitToMenu}
            style={({ pressed }) => [
              styles.pauseSecondaryBtn,
              pressed && styles.pauseSecondaryBtnPressed,
            ]}>
            <Text
              style={[styles.pauseSecondaryText, { fontSize: button - 1 }]}>
              {t('game_exit')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

type ExitProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirmExit: () => void;
};

export function GameExitConfirmModal({
  visible,
  onDismiss,
  onConfirmExit,
}: ExitProps) {
  const { t } = useLanguage();
  const { body, button } = useScaledSize();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent>
      <View style={styles.pauseModalRoot}>
        <View style={styles.pauseCard}>
          <Text
            style={[styles.pauseTitle, { fontSize: body + 4 }]}
            accessibilityRole="header">
            {t('game_exit_confirm_title')}
          </Text>
          <Text style={[styles.pauseHint, { fontSize: body - 1 }]}>
            {t('game_exit_confirm_message')}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('game_cancel')}
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.pauseSecondaryBtn,
              pressed && styles.pauseSecondaryBtnPressed,
            ]}>
            <Text
              style={[
                styles.pauseSecondaryTextMuted,
                { fontSize: button - 1 },
              ]}>
              {t('game_cancel')}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('game_confirm_exit')}
            accessibilityHint={t('a11y_exit_game')}
            onPress={onConfirmExit}
            style={({ pressed }) => [
              styles.exitConfirmDangerBtn,
              pressed && styles.exitConfirmDangerBtnPressed,
            ]}>
            <Text
              style={[styles.exitConfirmDangerText, { fontSize: button }]}>
              {t('game_confirm_exit')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
