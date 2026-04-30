import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { RoundSummaryGuessedIcon } from '../components/icons/RoundSummaryGuessedIcon';
import { RoundSummaryMissedIcon } from '../components/icons/RoundSummaryMissedIcon';
import {
  getTribeKeysForTeamCount,
  tribeTranslationKey,
} from '../constants/tribes';
import type { RoundSummaryWordItem } from '../context/GameContext';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { wordAt } from '../data/words';
import type { RootStackParamList } from '../navigation/types';
import { colors, fonts, spacing } from '../theme';
import { GamePauseModal } from './game/GameModals';
import { gameScreenStyles } from './game/gameScreenStyles';
import { useGameScreenLayout } from './game/useGameScreenLayout';
import { roundSummaryStyles as styles } from './roundSummaryStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'RoundSummary'>;

function ScoreBoard({
  scores,
  tribeKeys,
  currentTeamIndex,
  fontSize,
}: {
  scores: number[];
  tribeKeys: readonly string[];
  currentTeamIndex: number;
  fontSize: number;
}) {
  const { t } = useLanguage();
  return (
    <View style={styles.scoreBoardContainer}>
      <Text style={[styles.scoreBoardTitle, { fontSize: fontSize * 0.8 }]}>
        {t('game_team_scores')}
      </Text>
      <View style={styles.scoreBoardRow}>
        {tribeKeys.map((key, i) => {
          const isActive = i === currentTeamIndex;
          return (
            <View
              key={key}
              style={[styles.scoreChip, isActive && styles.scoreChipActive]}>
              <Text
                style={[
                  styles.scoreChipName,
                  { fontSize: fontSize * 0.75 },
                  isActive && styles.scoreChipNameActive,
                ]}
                numberOfLines={1}>
                {t(tribeTranslationKey(key as Parameters<typeof tribeTranslationKey>[0]))}
              </Text>
              <Text
                style={[
                  styles.scoreChipValue,
                  { fontSize: fontSize * 1.05 },
                  isActive && styles.scoreChipValueActive,
                ]}>
                {scores[i] ?? 0}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function RoundWordRows({
  items,
  language,
  fontSize,
  iconSize,
  indexFontSize,
  indexMinWidth,
  onToggle,
}: {
  items: RoundSummaryWordItem[];
  language: 'ro' | 'ru';
  fontSize: number;
  iconSize: number;
  indexFontSize: number;
  indexMinWidth: number;
  onToggle: (index: number) => void;
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
          <Pressable
            key={`${item.entry.ro}|${item.entry.ru}|${i}`}
            style={({ pressed }) => [
              styles.wordRow,
              pressed && styles.wordRowPressed,
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: item.guessed }}
            accessibilityLabel={`${order}. ${label}. ${a11yStatus}`}
            onPress={() => onToggle(i)}>
            <Text
              style={[
                styles.wordRowIndex,
                { fontSize: indexFontSize, minWidth: indexMinWidth },
              ]}
              importantForAccessibility="no">
              {order}.
            </Text>
            <View
              style={[
                styles.wordRowCheck,
                item.guessed
                  ? styles.wordRowCheckGuessed
                  : styles.wordRowCheckMissed,
                { width: iconSize + 8, height: iconSize + 8 },
              ]}
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
          </Pressable>
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
    scores,
    currentTeamIndex,
    roundSummaryWords,
    toggleWordStatus,
    nextRound,
    resetGame,
  } = useGame();
  const { padH, padHRight, body, title } = useGameScreenLayout();
  const leavingForNextRoundRef = useRef(false);
  const [menuVisible, setMenuVisible] = useState(false);

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
    navigation.replace('Countdown');
  }, [nextRound, navigation]);

  const onExitToMenu = useCallback(() => {
    setMenuVisible(false);
    resetGame();
    navigation.navigate('Home');
  }, [resetGame, navigation]);

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

  if (phase !== 'roundEnded' && !leavingForNextRoundRef.current) {
    return <View style={styles.root} />;
  }

  const pauseButton = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('game_exit')}
      accessibilityHint={t('a11y_exit_game')}
      onPress={() => setMenuVisible(true)}
      style={({ pressed }) => [
        gameScreenStyles.pauseBtn,
        pressed && gameScreenStyles.pauseBtnPressed,
      ]}>
      {({ pressed }) => (
        <View
          style={gameScreenStyles.pauseBars}
          importantForAccessibility="no">
          <View
            style={[
              gameScreenStyles.pauseBar,
              pressed && gameScreenStyles.pauseBarOnAccent,
            ]}
          />
          <View
            style={[
              gameScreenStyles.pauseBar,
              pressed && gameScreenStyles.pauseBarOnAccent,
            ]}
          />
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <AppHeader
        title={t('round_summary_title')}
        subtitle={
          teamName ? t('game_round_for', { team: teamName }) : undefined
        }
        rightAction={pauseButton}
      />
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
          onToggle={toggleWordStatus}
        />
      </ScrollView>
      <ScoreBoard
        scores={scores}
        tribeKeys={tribeKeys}
        currentTeamIndex={currentTeamIndex}
        fontSize={body}
      />
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
      <GamePauseModal
        visible={menuVisible}
        onResume={() => setMenuVisible(false)}
        onExitToMenu={onExitToMenu}
      />
    </View>
  );
}
