import { Circle as SkeletonCircle, type CircleProps } from './Circle/Circle';

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
};

const Skeleton: SkeletonComponent = {
  Circle: SkeletonCircle,
};

Skeleton.Circle.displayName = 'Skeleton.Circle';

export type { CircleProps };
export { Skeleton, SkeletonCircle };
