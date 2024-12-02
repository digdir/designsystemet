import { Badge as BadgeElm } from './Badge';
import { BadgePlacement } from './BadgePlacement';

const Badge = Object.assign(BadgeElm, { Placement: BadgePlacement });

Badge.Placement.displayName = 'Badge.Placement';

export { Badge, BadgePlacement };
export type { BadgeProps } from './Badge';
export type { BadgePlacementProps } from './BadgePlacement';
