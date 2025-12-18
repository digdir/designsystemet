import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { Children, forwardRef } from 'react';

/* @TODO
- support tooltips around avatar?
- support link avatars?
 */
export type AvatarStackProps = {
  /**
   *  Adjusts gap-mask between avatars in the stack in px.
   *  @default 4
   */
  gap?: number;
  /**
   *  Control the size of the avatars. Must be a valid css length value (px, em, rem, var(--ds-size-12) etc.)
   *  @default 'var(--ds-size-12)'
   */
  avatarSize?: string;
  /**
   *  A number between 0 and 100 which represents the percentage value of how much avatars should overlap.
   *  @default 50
   */
  overlap?: number;
  /**
   *  The maximum number of avatars to show, additional avatars will show as "+ (n - max)".
   *  @default 10
   */
  max?: number;
  /**
   *  Expand on hover to show full avatars.
   *  @default false
   */
  expandable?: boolean;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Use `AvatarStack` to constrain Avatars into a stack.
 *
 * @example
 * <AvatarStack>
 *   <Avatar aria-label='name'>
 *     <img src={cat1} alt='' />
 *   </Avatar>
 *   <Avatar aria-label='name'>
 *     <BriefcaseIcon />
 *   </Avatar>
 *   <Avatar aria-label='name' initials='sm' />
 * </AvatarStack>
 */
export const AvatarStack = forwardRef<HTMLDivElement, AvatarStackProps>(
  function AvatarStack(
    {
      className,
      gap,
      avatarSize = 'var(--ds-size-12)',
      overlap = 50,
      max = 4,
      expandable = false,
      children,
      ...rest
    },
    ref,
  ) {
    const overflow = Math.max(Children.count(children) - max, 0);
    const safeOverlap = Math.min(Math.max(overlap, 0.01), 100);
    const childrenToShow =
      overflow > 0
        ? Children.toArray(children).slice(0, max)
        : Children.toArray(children);
    const style = {
      ...(rest.style || {}),
      '--gap': gap ? `${gap}px` : undefined,
      '--size': avatarSize ? `${avatarSize}` : undefined,
      '--overlap': safeOverlap ? `${safeOverlap}` : undefined,
      '--n': childrenToShow.length || 0,
    } as React.CSSProperties;
    return (
      <figure
        ref={ref}
        className={cl(`ds-avatar-stack`, className)}
        style={style}
        data-expandable={expandable}
        data-additionals={overflow > 0 ? overflow : undefined}
        {...rest}
      >
        {childrenToShow}
      </figure>
    );
  },
);
