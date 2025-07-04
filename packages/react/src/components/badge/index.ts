import { Badge as BadgeElm } from './Badge';
import { BadgePosition } from './BadgePosition';

/**
 * `Badge` is a non-interactive component for displaying status with or without numbers.
 *
 * @example without children
 * <Badge count={5} maxCount={10} />
 */
const Badge = Object.assign(BadgeElm, { Position: BadgePosition });

Badge.Position.displayName = 'Badge.Position';

export { Badge, BadgePosition };
export type { BadgeProps } from './Badge';
export type { BadgePositionProps } from './BadgePosition';
