import { Circle as SkeletonCircle, type CircleProps } from './Circle/Circle';
import {
  Rectangle as SkeletonRectangle,
  type RectangleProps,
} from './Rectangle/Rectangle';
import { Text as SkeletonText, type TextProps } from './Text/Text';

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

export type { CircleProps, RectangleProps, TextProps };
export { Skeleton, SkeletonCircle, SkeletonRectangle, SkeletonText };
