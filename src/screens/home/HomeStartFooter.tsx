import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { PlayIcon } from '../../components/icons/PlayIcon';
import { useLanguage } from '../../context/LanguageContext';
import { useScaledSize } from '../../hooks/useScaledSize';
import { homeScreenStyles as styles } from './homeScreenStyles';
import { useHomeLayout } from './useHomeLayout';

type Props = {
  onStart: () => void;
};

export function HomeStartFooter({ onStart }: Props) {
  const { t } = useLanguage();
  const { button } = useScaledSize();
  const { footerPadding } = useHomeLayout();

  return (
    <View style={[styles.startFooter, footerPadding]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('start_game')}
        accessibilityHint={t('a11y_start_hint')}
        onPress={onStart}
        style={({ pressed }) => [
          styles.primaryBtn,
          pressed && styles.primaryBtnPressed,
        ]}>
        <PlayIcon size={Math.max(16, Math.min(22, button))} color="#fff" />
        <Text style={[styles.primaryBtnText, { fontSize: button + 2 }]}>
          {t('start_game')}
        </Text>
      </Pressable>
    </View>
  );
}
