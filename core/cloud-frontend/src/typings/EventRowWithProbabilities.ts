import {
  EventTrackerEventEstimate,
  EventTrackerEvent,
  EventTrackerRowResponse,
} from "@api/types/index";
import { ProbabilityDisplayString } from "./Probabilities";

export interface EstimateWithProbabilities extends EventTrackerEventEstimate {
  upside_probability_display_string: ProbabilityDisplayString;
  downside_probability_display_string: ProbabilityDisplayString;
}

export interface EventWithEstimatesAndProbabilities extends EventTrackerEvent {
  estimate?: EstimateWithProbabilities;
}

export interface EventTrackerRowWithProbabilities
  extends EventTrackerRowResponse {
  events: EventWithEstimatesAndProbabilities[];
}
