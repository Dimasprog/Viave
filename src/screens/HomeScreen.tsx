import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import {
  DEFAULT_ROUND_SECONDS,
  type RoundSecondsOption,
} from '../constants/game';
import type { TeamCount } from '../constants/tribes';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import type { WordCategoryId } from '../data/categories';
import type { RootStackParamList } from '../navigation/types';
import { HomeCategoryCard } from './home/HomeCategoryCard';
import { HomeHero } from './home/HomeHero';
import { HomeLanguageCard } from './home/HomeLanguageCard';
import { HomeRoundTimeCard } from './home/HomeRoundTimeCard';
import { HomeSkipRuleCard } from './home/HomeSkipRuleCard';
import { HomeStartFooter } from './home/HomeStartFooter';
import { HomeTeamsCard } from './home/HomeTeamsCard';
import { homeScreenStyles as styles } from './home/homeScreenStyles';
import { useHomeLayout } from './home/useHomeLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { t } = useLanguage();
  const { prepareGame } = useGame();
  const { isLandscape, contentWidth, landGap, scrollContentPadding } =
    useHomeLayout();

  const [category, setCategory] = useState<WordCategoryId>('mix');
  const [teamCount, setTeamCount] = useState<TeamCount>(2);
  const [roundSeconds, setRoundSeconds] = useState<RoundSecondsOption>(
    DEFAULT_ROUND_SECONDS,
  );
  const [skipPenalizesScore, setSkipPenalizesScore] = useState(false);

  const onStart = useCallback(() => {
    prepareGame(category, teamCount, roundSeconds, skipPenalizesScore);
    navigation.navigate('Countdown');
  }, [
    category,
    navigation,
    prepareGame,
    roundSeconds,
    skipPenalizesScore,
    teamCount,
  ]);

  const settingsColumn = (
    <>
      <HomeLanguageCard />
      <HomeCategoryCard category={category} onSelectCategory={setCategory} />
      <HomeTeamsCard teamCount={teamCount} onSelectTeamCount={setTeamCount} />
      <HomeRoundTimeCard
        roundSeconds={roundSeconds}
        onSelectSeconds={setRoundSeconds}
      />
      <HomeSkipRuleCard
        skipPenalizesScore={skipPenalizesScore}
        onSelectSkipPenalizes={setSkipPenalizesScore}
      />
    </>
  );

  return (
    <View style={styles.screenRoot}>
      <AppHeader title={t('app_name')} subtitle={t('home_title')} />
      <View style={styles.bodyMain}>
        <ScrollView
          style={styles.scrollFill}
          contentContainerStyle={[styles.scrollContent, scrollContentPadding]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {isLandscape ? (
            <View
              style={[styles.landGrid, { width: contentWidth, gap: landGap }]}
            >
              <HomeHero />
              {settingsColumn}
            </View>
          ) : (
            <View style={styles.block}>
              <HomeHero />
              {settingsColumn}
            </View>
          )}
        </ScrollView>
        <HomeStartFooter onStart={onStart} />
      </View>
    </View>
  );
}
