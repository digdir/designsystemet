import { Badge as BadgeElm, BadgePlacement } from './Badge';

const Badge = Object.assign(BadgeElm, { Placement: BadgePlacement });

Badge.Placement.displayName = 'Badge.Placement';

export { Badge, BadgePlacement };
export type { BadgeProps, BadgePlacementProps } from './Badge';
