import { EventEstimateProbability } from "@/api/types";
import {
  ProbabilitiesToDisplayStrings,
  getImpliedDownsideProbability,
} from "@/typings/Probabilities";

export const estimateProbabilityOptions = [
  {
    label: ProbabilitiesToDisplayStrings[EventEstimateProbability.BAND_75_100],
    value: EventEstimateProbability.BAND_75_100,
  },
  {
    label: ProbabilitiesToDisplayStrings[EventEstimateProbability.BAND_50_75],
    value: EventEstimateProbability.BAND_50_75,
  },
  {
    label: ProbabilitiesToDisplayStrings[EventEstimateProbability.BAND_25_50],
    value: EventEstimateProbability.BAND_25_50,
  },
  {
    label: ProbabilitiesToDisplayStrings[EventEstimateProbability.BAND_0_25],
    value: EventEstimateProbability.BAND_0_25,
  },
];

export { getImpliedDownsideProbability as getDownsideByUpside };
