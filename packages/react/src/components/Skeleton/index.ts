import {
  Circle as SkeletonCircle,
  type CircleProps as SkeletonCircleProps,
} from './Circle/Circle';
import {
  Rectangle as SkeletonRectangle,
  type RectangleProps as SkeletonRectangleProps,
} from './Rectangle/Rectangle';
import {
  Text as SkeletonText,
  type TextProps as SkeletonTextProps,
} from './Text/Text';

/**
 * Represent a draft of page while the content loads. Mix different skeleton components to create your layout.
 * @example
 *   <Skeleton.Circle />
 *   <Skeleton.Text />
 *   <Skeleton.Text />
 *   <Skeleton.Text />
 *   <Skeleton.Rectangle />
 */
type SkeletonComponent = {
  /**  Skeleton component used for indicating loading elements of circular shape */
  Circle: typeof SkeletonCircle;
  /**  Skeleton component used for indicating loading elements of rectangle shape */
  Rectangle: typeof SkeletonRectangle;
  /**  Skeleton component used for indicating loading elements of text */
  Text: typeof SkeletonText;
};

const Skeleton: SkeletonComponent = {
  Circle: SkeletonCircle,
  Rectangle: SkeletonRectangle,
  Text: SkeletonText,
};

Skeleton.Circle.displayName = 'Skeleton.Circle';
Skeleton.Rectangle.displayName = 'Skeleton.Rectangle';
Skeleton.Text.displayName = 'Skeleton.Text';

export type { SkeletonCircleProps, SkeletonRectangleProps, SkeletonTextProps };
export { Skeleton, SkeletonCircle, SkeletonRectangle, SkeletonText };
