import { Badge as BadgeElm } from './Badge';
import { BadgePosition } from './BadgePosition';

const Badge = Object.assign(BadgeElm, { Position: BadgePosition });

Badge.Position.displayName = 'Badge.Position';

export { Badge, BadgePosition };
export type { BadgeProps } from './Badge';
export type { BadgePositionProps } from './BadgePosition';
