import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Animated, BackHandler, Easing, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTribeKeysForTeamCount } from '../constants/tribes';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { wordAt } from '../data/words';
import {
  feedbackRoundEnded,
  feedbackTimerExpired,
} from '../haptics/roundEndHaptics';
import {
  feedbackWordGuess,
  feedbackWordSkip,
} from '../haptics/wordActionHaptics';
import type { GamePhase } from '../context/GameContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';
import { GamePauseModal } from './game/GameModals';
import { GameScoreBoard } from './game/GameScoreBoard';
import { GameTopBar } from './game/GameTopBar';
import { GameAnimatedWord } from './game/GameAnimatedWord';
import { GameWordActionButton } from './game/GameWordActionButton';
import { gameScreenStyles as styles } from './game/gameScreenStyles';
import { useGameScreenLayout } from './game/useGameScreenLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export function GameScreen({ navigation }: Props) {
  const { language } = useLanguage();
  const {
    phase,
    teamCount,
    words,
    wordIndex,
    scores,
    currentTeamIndex,
    timerSessionId,
    roundSeconds,
    startRound,
    notifyTimerExpired,
    guessWord,
    skipWord,
    resetGame,
  } = useGame();

  const prevPhaseRef = useRef<GamePhase>(phase);

  useLayoutEffect(() => {
    const prev = prevPhaseRef.current;
    if (phase === 'roundEnded' && prev === 'playing') {
      feedbackRoundEnded();
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  useLayoutEffect(() => {
    if (phase === 'roundEnded') {
      navigation.replace('RoundSummary');
    }
  }, [phase, navigation]);

  const [paused, setPaused] = useState(false);
  const [remaining, setRemaining] = useState<number>(roundSeconds);
  const pausedRef = useRef(paused);
  const phaseRef = useRef(phase);
  pausedRef.current = paused;
  phaseRef.current = phase;

  useFocusEffect(
    useCallback(() => {
      const onHardwareBack = () => {
        if (pausedRef.current) {
          pausedRef.current = false;
          setPaused(false);
          return true;
        }
        return true;
      };
      const sub = BackHandler.addEventListener(
        'hardwareBackPress',
        onHardwareBack,
      );
      return () => sub.remove();
    }, []),
  );

  const insets = useSafeAreaInsets();
  const {
    isLandscape,
    word: wordSize,
    padH,
    padHRight,
    actionGap,
    landColumnGap,
  } = useGameScreenLayout();

  const enterOpacity = useRef(new Animated.Value(0)).current;
  const enterY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    enterOpacity.setValue(0);
    enterY.setValue(18);
    Animated.parallel([
      Animated.timing(enterOpacity, {
        toValue: 1,
        duration: 440,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(enterY, {
        toValue: 0,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [timerSessionId, enterOpacity, enterY]);

  useEffect(() => {
    if (phase !== 'playing') {
      setPaused(false);
    }
  }, [phase]);

  useLayoutEffect(() => {
    setRemaining(roundSeconds);
  }, [timerSessionId, roundSeconds]);

  useLayoutEffect(() => {
    if (phase !== 'playing' || paused) {
      return undefined;
    }

    let intervalId: ReturnType<typeof setInterval> | null = null;

    intervalId = setInterval(() => {
      if (pausedRef.current || phaseRef.current !== 'playing') {
        return;
      }
      setRemaining(prev => {
        if (pausedRef.current || phaseRef.current !== 'playing') {
          return prev;
        }
        if (prev <= 1) {
          if (intervalId != null) {
            clearInterval(intervalId);
            intervalId = null;
          }
          if (!pausedRef.current && phaseRef.current === 'playing') {
            feedbackTimerExpired();
            notifyTimerExpired();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalId != null) {
        clearInterval(intervalId);
      }
    };
  }, [phase, paused, timerSessionId, roundSeconds, notifyTimerExpired]);

  const onTogglePause = useCallback(() => {
    setPaused(p => {
      const next = !p;
      pausedRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    if (phase === 'idle') {
      startRound();
    }
  }, [phase, startRound]);

  const tribeKeys =
    teamCount != null ? getTribeKeysForTeamCount(teamCount) : [];

  const currentWord =
    words.length > 0 ? wordAt(words, wordIndex, language) : '';

  const onExitToMenu = useCallback(() => {
    pausedRef.current = false;
    setPaused(false);
    resetGame();
    navigation.navigate('Home');
  }, [navigation, resetGame]);

  const onResumeFromPauseModal = useCallback(() => {
    pausedRef.current = false;
    setPaused(false);
  }, []);

  const onGuessPress = useCallback(() => {
    feedbackWordGuess();
    guessWord();
  }, [guessWord]);

  const onSkipPress = useCallback(() => {
    feedbackWordSkip();
    skipWord();
  }, [skipWord]);

  const playing = phase === 'playing';

  const bottomPad = Math.max(insets.bottom, spacing.lg);

  if (phase === 'roundEnded') {
    return <View style={[styles.root, { backgroundColor: colors.background }]} />;
  }

  const scoreBoard = (
    <GameScoreBoard
      tribeKeys={tribeKeys}
      scores={scores}
      currentTeamIndex={currentTeamIndex}
    />
  );

  const actionRowPortrait = (
    <View style={[styles.actions, { gap: actionGap }]}>
      <GameWordActionButton
        variant="skip"
        disabled={!playing}
        onPress={onSkipPress}
        layout="portrait"
      />
      <GameWordActionButton
        variant="guess"
        disabled={!playing}
        onPress={onGuessPress}
        layout="portrait"
      />
    </View>
  );

  const actionColumnLandscape = (
    <View style={[styles.landActionsColumn, { gap: actionGap }]}>
      <GameWordActionButton
        variant="skip"
        disabled={!playing}
        onPress={onSkipPress}
        layout="landscape"
      />
      <GameWordActionButton
        variant="guess"
        disabled={!playing}
        onPress={onGuessPress}
        layout="landscape"
      />
    </View>
  );

  const wordBlockPortrait = (
    <View style={styles.wordBlock}>
      <View style={styles.wordCard}>
        <GameAnimatedWord
          wordIndex={wordIndex}
          text={currentWord}
          fontSize={wordSize}
          numberOfLines={4}
          minimumFontScale={0.45}
        />
      </View>
    </View>
  );

  const wordAreaLandscape = (
    <View style={styles.wordBlock}>
      <View style={[styles.wordCard, styles.wordCardLandscape]}>
        <GameAnimatedWord
          wordIndex={wordIndex}
          text={currentWord}
          fontSize={wordSize}
          numberOfLines={3}
          minimumFontScale={0.4}
          landscape
        />
      </View>
    </View>
  );

  const footerPortrait = (
    <View style={[styles.footer, { paddingBottom: bottomPad }]}>
      {scoreBoard}
      {actionRowPortrait}
    </View>
  );

  return (
    <View style={styles.root}>
      <GameTopBar
        remaining={remaining}
        roundSeconds={roundSeconds}
        paused={paused}
        phase={phase}
        onTogglePause={onTogglePause}
      />
      <Animated.View
        style={[
          styles.body,
          styles.bodyFlex,
          { paddingLeft: padH, paddingRight: padHRight },
          {
            opacity: enterOpacity,
            transform: [{ translateY: enterY }],
          },
        ]}
      >
        {isLandscape ? (
          <View style={[styles.landRoot, { paddingBottom: bottomPad }]}>
            <View style={[styles.landRow, { gap: landColumnGap }]}>
              <View style={[styles.landColHalf, styles.landColInsetLeft]}>
                <ScrollView
                  style={styles.landLeftScroll}
                  contentContainerStyle={styles.landLeftScrollContent}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  bounces
                >
                  {wordAreaLandscape}
                  <View style={styles.landScoreScrollWrap}>{scoreBoard}</View>
                </ScrollView>
              </View>
              <View
                style={[
                  styles.landColHalf,
                  styles.landColInsetRight,
                  styles.landRightCol,
                ]}
              >
                <View style={styles.landRightStack}>
                  {actionColumnLandscape}
                </View>
              </View>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.portraitGrow}>{wordBlockPortrait}</View>
            {footerPortrait}
          </>
        )}
      </Animated.View>

      <GamePauseModal
        visible={paused}
        onResume={onResumeFromPauseModal}
        onExitToMenu={onExitToMenu}
      />
    </View>
  );
}
