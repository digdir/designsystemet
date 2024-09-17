import { SkeletonCircle, SkeletonRectangle, SkeletonText } from './Skeletons';

/**
 * Represent a draft of page while the content loads. Mix different skeleton components to create your layout.
 * @example
 *   <Skeleton.Circle />
 *   <Skeleton.Text />
 *   <Skeleton.Text />
 *   <Skeleton.Text />
 *   <Skeleton.Rectangle />
 */
const Skeleton = {
  Circle: SkeletonCircle,
  Rectangle: SkeletonRectangle,
  Text: SkeletonText,
};

Skeleton.Circle.displayName = 'Skeleton.Circle';
Skeleton.Rectangle.displayName = 'Skeleton.Rectangle';
Skeleton.Text.displayName = 'Skeleton.Text';

export type {
  SkeletonCircleProps,
  SkeletonRectangleProps,
  SkeletonTextProps,
} from './Skeletons';
export { Skeleton, SkeletonCircle, SkeletonRectangle, SkeletonText };
