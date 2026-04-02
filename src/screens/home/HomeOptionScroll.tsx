import React, { type ReactNode } from 'react';
import { Platform, ScrollView } from 'react-native';
import { homeScreenStyles as styles } from './homeScreenStyles';

type Props = { children: ReactNode };

export function HomeOptionScroll({ children }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={Platform.OS === 'android'}
      style={styles.optionRowScroll}
      contentContainerStyle={styles.optionRowScrollContent}
    >
      {children}
    </ScrollView>
  );
}
