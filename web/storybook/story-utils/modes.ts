import { fromPairs } from 'ramda';
export const viewportWidths = [320, 375, 576, 768, 992, 1200, 1440] as const;

export const allModes = fromPairs(
  viewportWidths.map((width) => [width, { viewport: { width } }]),
);
