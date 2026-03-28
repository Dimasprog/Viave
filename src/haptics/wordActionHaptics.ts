import { trigger, HapticFeedbackTypes } from 'react-native-haptic-feedback';

const opts = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
} as const;

/** Feedback la cuvânt ghicit — succes scurt (Taptic / pattern dublu pe Android). */
export function feedbackWordGuess(): void {
  trigger(HapticFeedbackTypes.notificationSuccess, opts);
}

/** Feedback la trecere — „tick” ușor, diferit de ghicit. */
export function feedbackWordSkip(): void {
  trigger(HapticFeedbackTypes.effectTick, opts);
}
