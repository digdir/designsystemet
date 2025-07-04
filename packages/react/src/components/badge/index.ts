import { Badge as BadgeElm } from './badge';
import { BadgePosition } from './badge-position';

/**
 * `Badge` is a non-interactive component for displaying status with or without numbers.
 *
 * @example without children
 * <Badge count={5} maxCount={10} />
 */
const Badge = Object.assign(BadgeElm, { Position: BadgePosition });

Badge.Position.displayName = 'Badge.Position';

export { Badge, BadgePosition };
export type { BadgeProps } from './badge';
export type { BadgePositionProps } from './badge-position';
