/** Opțiuni durată rundă (secunde). */
export const ROUND_SECONDS_OPTIONS = [5, 30, 45, 60, 90, 120] as const;

export type RoundSecondsOption = (typeof ROUND_SECONDS_OPTIONS)[number];

/** Valoare implicită la pornire / reset. */
export const DEFAULT_ROUND_SECONDS: RoundSecondsOption = 60;
