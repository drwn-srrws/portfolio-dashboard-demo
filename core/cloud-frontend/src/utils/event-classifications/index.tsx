import {
  CircledStar,
  EventClassificationIcon,
  FilledCircle,
  FilledHexagon,
  FilledStar,
  InwardPointingTriangles,
  OutwardPointingTriangles,
} from "./icons";

export const EventClassificationIconsMap: {
  [classification: string]: EventClassificationIcon;
} = {
  Financing: InwardPointingTriangles,
  Major: FilledCircle,
  Minor: OutwardPointingTriangles,
  "Cash Flow Run Out": FilledHexagon,
  "Year's Biggest": CircledStar,
  Other: FilledStar,
};
