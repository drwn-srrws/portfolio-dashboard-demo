import { EventEstimateProbability } from "@api/types/index";

export const Probabilities = Object.values(EventEstimateProbability);

export const DisplayStringsToProbabilities = {
  "75-100%": EventEstimateProbability.BAND_75_100,
  "50-75%": EventEstimateProbability.BAND_50_75,
  "25-50%": EventEstimateProbability.BAND_25_50,
  "0-25%": EventEstimateProbability.BAND_0_25,
};

export type ProbabilityDisplayString =
  keyof typeof DisplayStringsToProbabilities;

export const ProbabilitiesToDisplayStrings: {
  [probability: string]: ProbabilityDisplayString;
} = {
  [EventEstimateProbability.BAND_75_100]: "75-100%",
  [EventEstimateProbability.BAND_50_75]: "50-75%",
  [EventEstimateProbability.BAND_25_50]: "25-50%",
  [EventEstimateProbability.BAND_0_25]: "0-25%",
};

export const probabilityDisplayStrings = Object.values(
  ProbabilitiesToDisplayStrings
);

export const getImpliedDownsideProbability = (
  upsideProbability: EventEstimateProbability
): EventEstimateProbability => {
  switch (upsideProbability) {
    case EventEstimateProbability.BAND_75_100:
      return EventEstimateProbability.BAND_0_25;
    case EventEstimateProbability.BAND_50_75:
      return EventEstimateProbability.BAND_25_50;
    case EventEstimateProbability.BAND_25_50:
      return EventEstimateProbability.BAND_50_75;
    case EventEstimateProbability.BAND_0_25:
      return EventEstimateProbability.BAND_75_100;
  }
};
