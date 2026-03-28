import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { RoundSecondsOption } from '../constants/game';
import { DEFAULT_ROUND_SECONDS } from '../constants/game';
import type { TeamCount } from '../constants/tribes';
import type { WordCategoryId } from '../data/categories';
import type { WordEntry } from '../data/words';
import { getWordsForCategory } from '../data/words';

export type GamePhase = 'idle' | 'playing' | 'roundEnded';

type GameState = {
  phase: GamePhase;
  categoryId: WordCategoryId | null;
  teamCount: TeamCount | null;
  words: WordEntry[];
  wordIndex: number;
  scores: number[];
  currentTeamIndex: number;
  /** Incremented when a playing round starts (fresh countdown). */
  timerSessionId: number;
  roundSeconds: RoundSecondsOption;
  /** Dacă true, la skip scade un punct echipei curente (min. 0). */
  skipPenalizesScore: boolean;
};

function initialScores(teamCount: number): number[] {
  return Array.from({ length: teamCount }, () => 0);
}

const defaultState: GameState = {
  phase: 'idle',
  categoryId: null,
  teamCount: null,
  words: [],
  wordIndex: 0,
  scores: [],
  currentTeamIndex: 0,
  timerSessionId: 0,
  roundSeconds: DEFAULT_ROUND_SECONDS,
  skipPenalizesScore: false,
};

type GameContextValue = {
  phase: GamePhase;
  categoryId: WordCategoryId | null;
  teamCount: TeamCount | null;
  words: WordEntry[];
  wordIndex: number;
  scores: number[];
  currentTeamIndex: number;
  timerSessionId: number;
  roundSeconds: RoundSecondsOption;
  skipPenalizesScore: boolean;
  prepareGame: (
    categoryId: WordCategoryId,
    teamCount: TeamCount,
    roundSeconds: RoundSecondsOption,
    skipPenalizesScore: boolean,
  ) => void;
  startRound: () => void;
  endRound: () => void;
  guessWord: () => void;
  skipWord: () => void;
  nextRound: () => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);

  const prepareGame = useCallback(
    (
      categoryId: WordCategoryId,
      teamCount: TeamCount,
      roundSeconds: RoundSecondsOption,
      skipPenalizesScore: boolean,
    ) => {
      const words = getWordsForCategory(categoryId);
      setState({
        phase: 'idle',
        categoryId,
        teamCount,
        words,
        wordIndex: 0,
        scores: initialScores(teamCount),
        currentTeamIndex: 0,
        timerSessionId: 0,
        roundSeconds,
        skipPenalizesScore,
      });
    },
    [],
  );

  const startRound = useCallback(() => {
    setState(s => {
      if (s.phase !== 'idle' || !s.teamCount || !s.categoryId) {
        return s;
      }
      return {
        ...s,
        phase: 'playing',
        timerSessionId: s.timerSessionId + 1,
      };
    });
  }, []);

  const endRound = useCallback(() => {
    setState(s => (s.phase === 'playing' ? { ...s, phase: 'roundEnded' } : s));
  }, []);

  const advanceWord = useCallback((words: WordEntry[], wordIndex: number) => {
    if (words.length === 0) {
      return 0;
    }
    return (wordIndex + 1) % words.length;
  }, []);

  const guessWord = useCallback(() => {
    setState(s => {
      if (s.phase !== 'playing' || !s.teamCount) {
        return s;
      }
      const nextIdx = advanceWord(s.words, s.wordIndex);
      const nextScores = [...s.scores];
      nextScores[s.currentTeamIndex] =
        (nextScores[s.currentTeamIndex] ?? 0) + 1;
      return { ...s, wordIndex: nextIdx, scores: nextScores };
    });
  }, [advanceWord]);

  const skipWord = useCallback(() => {
    setState(s => {
      if (s.phase !== 'playing') {
        return s;
      }
      const nextScores = [...s.scores];
      if (s.skipPenalizesScore && s.teamCount) {
        const i = s.currentTeamIndex;
        nextScores[i] = (nextScores[i] ?? 0) - 1;
      }
      return {
        ...s,
        wordIndex: advanceWord(s.words, s.wordIndex),
        scores: nextScores,
      };
    });
  }, [advanceWord]);

  const nextRound = useCallback(() => {
    setState(s => {
      if (!s.teamCount || !s.categoryId || s.phase !== 'roundEnded') {
        return s;
      }
      const n = s.teamCount;
      const nextTeam = (s.currentTeamIndex + 1) % n;
      const words = getWordsForCategory(s.categoryId);
      return {
        ...s,
        phase: 'playing',
        currentTeamIndex: nextTeam,
        words,
        wordIndex: 0,
        timerSessionId: s.timerSessionId + 1,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(defaultState);
  }, []);

  const value = useMemo(
    () => ({
      phase: state.phase,
      categoryId: state.categoryId,
      teamCount: state.teamCount,
      words: state.words,
      wordIndex: state.wordIndex,
      scores: state.scores,
      currentTeamIndex: state.currentTeamIndex,
      timerSessionId: state.timerSessionId,
      roundSeconds: state.roundSeconds,
      skipPenalizesScore: state.skipPenalizesScore,
      prepareGame,
      startRound,
      endRound,
      guessWord,
      skipWord,
      nextRound,
      resetGame,
    }),
    [
      state,
      prepareGame,
      startRound,
      endRound,
      guessWord,
      skipWord,
      nextRound,
      resetGame,
    ],
  );

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within GameProvider');
  }
  return ctx;
}
