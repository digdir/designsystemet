import { Circle as SkeletonCircle, type CircleProps } from './Circle/Circle';
import {
  Rectangle as SkeletonRectangle,
  type RectangleProps,
} from './Rectangle/Rectangle';
import { Text as SkeletonText, type TextProps } from './Text/Text';

type SkeletonComponent = {
  /**
   * Represent a draft of page while the content loads. Mix different skeleton components to create your layout.
   * @example
   *   <Skeleton.Circle />
   *   <Skeleton.Text />
   *   <Skeleton.Text />
   *   <Skeleton.Text />
   *   <Skeleton.Rectangle />
   */
  Circle: typeof SkeletonCircle;
  Rectangle: typeof SkeletonRectangle;
  Text: typeof SkeletonText;
};

const Skeleton: SkeletonComponent = {
  Circle: SkeletonCircle,
  Rectangle: SkeletonRectangle,
  Text: SkeletonText,
};

export type { CircleProps, RectangleProps, TextProps };
export { Skeleton, SkeletonCircle, SkeletonRectangle };
