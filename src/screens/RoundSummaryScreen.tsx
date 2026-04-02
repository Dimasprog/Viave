import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef } from 'react';
import { BackHandler, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { RoundSummaryGuessedIcon } from '../components/icons/RoundSummaryGuessedIcon';
import { RoundSummaryMissedIcon } from '../components/icons/RoundSummaryMissedIcon';
import { getTribeKeysForTeamCount } from '../constants/tribes';
import { tribeTranslationKey } from '../constants/tribes';
import type { RoundSummaryWordItem } from '../context/GameContext';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { wordAt } from '../data/words';
import type { RootStackParamList } from '../navigation/types';
import { spacing } from '../theme';
import { useGameScreenLayout } from './game/useGameScreenLayout';
import { roundSummaryStyles as styles } from './roundSummaryStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'RoundSummary'>;

function RoundWordRows({
  items,
  language,
  fontSize,
  iconSize,
  indexFontSize,
  indexMinWidth,
}: {
  items: RoundSummaryWordItem[];
  language: 'ro' | 'ru';
  fontSize: number;
  iconSize: number;
  indexFontSize: number;
  indexMinWidth: number;
}) {
  const { t } = useLanguage();
  if (items.length === 0) {
    return (
      <Text style={[styles.emptyText, { fontSize }]} accessibilityRole="text">
        {t('round_summary_empty')}
      </Text>
    );
  }
  return (
    <View style={styles.wordList} accessibilityRole="list">
      {items.map((item, i) => {
        const label = wordAt([item.entry], 0, language);
        const a11yStatus = item.guessed
          ? t('a11y_round_word_guessed')
          : t('a11y_round_word_skipped');
        const order = i + 1;
        return (
          <View
            key={`${item.entry.ro}|${item.entry.ru}|${i}|${item.guessed}`}
            style={styles.wordRow}
            accessibilityRole="text"
            accessibilityLabel={`${order}. ${label}. ${a11yStatus}`}>
            <Text
              style={[
                styles.wordRowIndex,
                { fontSize: indexFontSize, minWidth: indexMinWidth },
              ]}
              importantForAccessibility="no">
              {order}.
            </Text>
            <View
              style={[styles.wordRowIcon, { width: iconSize + 8 }]}
              importantForAccessibility="no">
              {item.guessed ? (
                <RoundSummaryGuessedIcon size={iconSize} />
              ) : (
                <RoundSummaryMissedIcon size={iconSize} />
              )}
            </View>
            <Text
              style={[styles.wordRowText, { fontSize }]}
              numberOfLines={4}
              importantForAccessibility="no">
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function RoundSummaryScreen({ navigation }: Props) {
  const { language, t } = useLanguage();
  const insets = useSafeAreaInsets();
  const {
    phase,
    teamCount,
    currentTeamIndex,
    roundSummaryWords,
    nextRound,
    resetGame,
  } = useGame();
  const { padH, padHRight, body, title } = useGameScreenLayout();
  const leavingForNextRoundRef = useRef(false);

  useEffect(() => {
    if (leavingForNextRoundRef.current) {
      return;
    }
    if (phase !== 'roundEnded') {
      resetGame();
      navigation.replace('Home');
    }
  }, [phase, navigation, resetGame]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        resetGame();
        navigation.navigate('Home');
        return true;
      });
      return () => sub.remove();
    }, [navigation, resetGame]),
  );

  const onNextRound = useCallback(() => {
    leavingForNextRoundRef.current = true;
    nextRound();
    navigation.replace('Game');
  }, [nextRound, navigation]);

  const tribeKeys =
    teamCount != null ? getTribeKeysForTeamCount(teamCount) : [];
  const teamKey = tribeKeys[currentTeamIndex];
  const teamName = teamKey != null ? t(tribeTranslationKey(teamKey)) : '';

  const chipSize = body;
  const iconSize = Math.max(18, Math.min(26, Math.round(body * 1.05)));
  const indexFontSize = Math.max(13, Math.round(body * 0.92));
  const indexMinWidth = Math.max(
    28,
    `${roundSummaryWords.length || 1}`.length * (indexFontSize * 0.62) + 4,
  );

  const scrollPad = {
    paddingLeft: padH,
    paddingRight: padHRight,
    paddingTop: spacing.md,
  };

  const bodyContent = (
    <ScrollView
      style={styles.main}
      contentContainerStyle={[styles.scrollContent, scrollPad]}
      showsVerticalScrollIndicator={false}
      bounces>
      <RoundWordRows
        items={roundSummaryWords}
        language={language}
        fontSize={chipSize}
        iconSize={iconSize}
        indexFontSize={indexFontSize}
        indexMinWidth={indexMinWidth}
      />
    </ScrollView>
  );

  if (phase !== 'roundEnded' && !leavingForNextRoundRef.current) {
    return <View style={styles.root} />;
  }

  return (
    <View style={styles.root}>
      <AppHeader
        title={t('round_summary_title')}
        subtitle={
          teamName ? t('game_round_for', { team: teamName }) : undefined
        }
      />
      <View style={styles.main}>{bodyContent}</View>
      <View
        style={[
          styles.footer,
          {
            paddingLeft: padH,
            paddingRight: padHRight,
            paddingBottom: Math.max(insets.bottom, spacing.lg),
          },
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('game_next_round')}
          accessibilityHint={t('a11y_round_summary_next')}
          onPress={onNextRound}
          style={({ pressed }) => [
            styles.nextBtn,
            pressed && styles.nextBtnPressed,
          ]}>
          <Text style={[styles.nextBtnText, { fontSize: title }]}>
            {t('game_next_round')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
