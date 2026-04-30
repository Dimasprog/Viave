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

/** O intrare în rezumatul rundei, în ordinea jocului. */
export type RoundSummaryWordItem = {
  entry: WordEntry;
  guessed: boolean;
};

type GameState = {
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
  roundSummaryWords: RoundSummaryWordItem[];
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
  roundSummaryWords: [],
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
  roundSummaryWords: RoundSummaryWordItem[];
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
  toggleWordStatus: (index: number) => void;
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
        roundSummaryWords: [],
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
    setState(s =>
      s.phase === 'playing' ? { ...s, phase: 'roundEnded' } : s,
    );
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
      const entry = s.words[s.wordIndex];
      const nextWords =
        entry != null
          ? [...s.roundSummaryWords, { entry, guessed: true }]
          : s.roundSummaryWords;
      const nextScores = [...s.scores];
      nextScores[s.currentTeamIndex] =
        (nextScores[s.currentTeamIndex] ?? 0) + 1;
      return {
        ...s,
        roundSummaryWords: nextWords,
        wordIndex: advanceWord(s.words, s.wordIndex),
        scores: nextScores,
      };
    });
  }, [advanceWord]);

  const skipWord = useCallback(() => {
    setState(s => {
      if (s.phase !== 'playing') {
        return s;
      }
      const entry = s.words[s.wordIndex];
      const nextWords =
        entry != null
          ? [...s.roundSummaryWords, { entry, guessed: false }]
          : s.roundSummaryWords;
      const nextScores = [...s.scores];
      if (s.skipPenalizesScore && s.teamCount) {
        const i = s.currentTeamIndex;
        nextScores[i] = (nextScores[i] ?? 0) - 1;
      }
      return {
        ...s,
        roundSummaryWords: nextWords,
        wordIndex: advanceWord(s.words, s.wordIndex),
        scores: nextScores,
      };
    });
  }, [advanceWord]);

  const toggleWordStatus = useCallback((index: number) => {
    setState(s => {
      if (s.phase !== 'roundEnded') {
        return s;
      }
      const item = s.roundSummaryWords[index];
      if (!item) {
        return s;
      }
      const wasGuessed = item.guessed;
      const newWords = s.roundSummaryWords.map((w, i) =>
        i === index ? { ...w, guessed: !w.guessed } : w,
      );
      const newScores = [...s.scores];
      const teamIdx = s.currentTeamIndex;
      if (wasGuessed) {
        // guessed → skipped: remove +1, optionally add -1 penalty
        newScores[teamIdx] = (newScores[teamIdx] ?? 0) - 1;
        if (s.skipPenalizesScore) {
          newScores[teamIdx] = (newScores[teamIdx] ?? 0) - 1;
        }
      } else {
        // skipped → guessed: add +1, optionally remove -1 penalty
        newScores[teamIdx] = (newScores[teamIdx] ?? 0) + 1;
        if (s.skipPenalizesScore) {
          newScores[teamIdx] = (newScores[teamIdx] ?? 0) + 1;
        }
      }
      return { ...s, roundSummaryWords: newWords, scores: newScores };
    });
  }, []);

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
        phase: 'idle',
        currentTeamIndex: nextTeam,
        words,
        wordIndex: 0,
        roundSummaryWords: [],
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
      roundSummaryWords: state.roundSummaryWords,
      prepareGame,
      startRound,
      endRound,
      guessWord,
      skipWord,
      toggleWordStatus,
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
      toggleWordStatus,
      nextRound,
      resetGame,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within GameProvider');
  }
  return ctx;
}
