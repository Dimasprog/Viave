import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  ScrollView,
  Vibration,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTribeKeysForTeamCount } from '../constants/tribes';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { wordAt } from '../data/words';
import {
  feedbackWordGuess,
  feedbackWordSkip,
} from '../haptics/wordActionHaptics';
import type { RootStackParamList } from '../navigation/types';
import { spacing } from '../theme';
import { GameExitConfirmModal, GamePauseModal } from './game/GameModals';
import { GameNextRoundButton } from './game/GameNextRoundButton';
import { GameScoreBoard } from './game/GameScoreBoard';
import { GameTimeUpBanner } from './game/GameTimeUpBanner';
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
    endRound,
    guessWord,
    skipWord,
    resetGame,
  } = useGame();

  const [paused, setPaused] = useState(false);
  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);
  const [remaining, setRemaining] = useState<number>(roundSeconds);
  const pausedRef = useRef(paused);
  const phaseRef = useRef(phase);
  const exitConfirmVisibleRef = useRef(exitConfirmVisible);
  pausedRef.current = paused;
  phaseRef.current = phase;
  exitConfirmVisibleRef.current = exitConfirmVisible;

  useFocusEffect(
    useCallback(() => {
      const onHardwareBack = () => {
        if (exitConfirmVisibleRef.current) {
          setExitConfirmVisible(false);
          return true;
        }
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

  const expireOnce = useRef(false);

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

  const handleTimeUp = useCallback(() => {
    if (pausedRef.current) {
      return;
    }
    if (phaseRef.current !== 'playing') {
      return;
    }
    if (expireOnce.current) {
      return;
    }
    expireOnce.current = true;
    Vibration.vibrate(400);
    endRound();
  }, [endRound]);

  useEffect(() => {
    if (phase === 'playing') {
      expireOnce.current = false;
    }
  }, [phase]);

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
    let completeTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const clearCompleteTimeout = () => {
      if (completeTimeoutId != null) {
        clearTimeout(completeTimeoutId);
        completeTimeoutId = null;
      }
    };

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
          clearCompleteTimeout();
          completeTimeoutId = setTimeout(() => {
            completeTimeoutId = null;
            if (!pausedRef.current && phaseRef.current === 'playing') {
              handleTimeUp();
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalId != null) {
        clearInterval(intervalId);
      }
      clearCompleteTimeout();
    };
  }, [phase, paused, timerSessionId, roundSeconds, handleTimeUp]);

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

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', () => {
      resetGame();
    });
    return unsub;
  }, [navigation, resetGame]);

  const tribeKeys =
    teamCount != null ? getTribeKeysForTeamCount(teamCount) : [];

  const currentWord =
    words.length > 0 ? wordAt(words, wordIndex, language) : '';

  const onExitToMenu = useCallback(() => {
    pausedRef.current = false;
    setPaused(false);
    setExitConfirmVisible(false);
    navigation.navigate('Home');
  }, [navigation]);

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
  const roundEnded = phase === 'roundEnded';

  useEffect(() => {
    if (!roundEnded) {
      setExitConfirmVisible(false);
    }
  }, [roundEnded]);

  const bottomPad = Math.max(insets.bottom, spacing.lg);

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
      <GameTimeUpBanner variant="portrait" />
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
      <GameNextRoundButton compact={false} />
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
        onRequestExitConfirm={() => setExitConfirmVisible(true)}
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
                  <GameTimeUpBanner variant="landscape" />
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
                  <GameNextRoundButton compact />
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

      <GameExitConfirmModal
        visible={exitConfirmVisible}
        onDismiss={() => setExitConfirmVisible(false)}
        onConfirmExit={onExitToMenu}
      />
    </View>
  );
}
