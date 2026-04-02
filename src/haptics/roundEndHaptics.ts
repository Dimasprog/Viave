import { Platform, Vibration } from 'react-native';
import { trigger, HapticFeedbackTypes } from 'react-native-haptic-feedback';

const opts = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
} as const;

const TIMER_EXPIRED_MS = 2000;

/** Când ajunge timpul la 0: ~2s vibrație (Android) sau impulsuri Taptic (iOS). */
export function feedbackTimerExpired(): void {
  if (Platform.OS === 'android') {
    Vibration.vibrate(TIMER_EXPIRED_MS);
    return;
  }

  const stepMs = 200;
  const pulses = Math.ceil(TIMER_EXPIRED_MS / stepMs);
  let n = 0;
  const pulse = () => {
    trigger(HapticFeedbackTypes.impactMedium, opts);
    n += 1;
    if (n < pulses) {
      setTimeout(pulse, stepMs);
    }
  };
  pulse();
}

/** După ultima acțiune în grace — feedback scurt; vibrația lungă a fost la expirarea timerului. */
export function feedbackRoundEnded(): void {
  trigger(HapticFeedbackTypes.notificationWarning, opts);
}
