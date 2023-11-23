import { Circle as SkeletonCircle, type CircleProps } from './Circle/Circle';
import {
  Rectangle as SkeletonRectangle,
  type RectangleProps,
} from './Rectangle/Rectangle';

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
};

const Skeleton: SkeletonComponent = {
  Circle: SkeletonCircle,
  Rectangle: SkeletonRectangle,
};

Skeleton.Circle.displayName = 'Skeleton.Circle';
Skeleton.Rectangle.displayName = 'Skeleton.Rectangle';

export type { CircleProps, RectangleProps };
export { Skeleton, SkeletonCircle, SkeletonRectangle };
