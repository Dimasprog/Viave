/**
 * Viave — Alias biblic (React Native)
 *
 * @format
 */

import { StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider } from './src/context/GameContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors, fonts } from './src/theme';

const defaultFontStyle = { fontFamily: fonts.regular };
const RNText = Text as typeof Text & {
  defaultProps?: { style?: object | object[] };
};
const RNTextInput = TextInput as typeof TextInput & {
  defaultProps?: { style?: object | object[] };
};
const textDefaults = RNText.defaultProps ?? {};
const textInputDefaults = RNTextInput.defaultProps ?? {};
RNText.defaultProps = {
  ...textDefaults,
  style: StyleSheet.flatten([defaultFontStyle, textDefaults.style]),
};
RNTextInput.defaultProps = {
  ...textInputDefaults,
  style: StyleSheet.flatten([defaultFontStyle, textInputDefaults.style]),
};

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
      />
      <LanguageProvider>
        <GameProvider>
          <View style={styles.root}>
            <RootNavigator />
          </View>
        </GameProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
