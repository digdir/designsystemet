import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { Children, forwardRef } from 'react';

/* @TODO:
 * a11y
 * rightAligned?
 * vertical??
 * support Badge?
 * design for +n indicator
 */

export type AvatarStackProps = {
  /**
   *  Adjusts gap-mask between avatars in the stack in px.
   *  @default 2
   */
  gap?: number;
  /**
   *  Control the size of the avatars. Must be a valid css length value (px, em, rem, var(--ds-size-12) etc.)
   *  @default 'var(--ds-size-12)'
   */
  avatarSize?: string;
  /**
   *  A number which represents the percentage value of how much avatars should overlap. 
   *  @default 50
   */
  overlap?: number;
  /**
   *  The maximum number of avatars to render, additional avatars will show as "+ (n - max)".
   *  @default 10
   */
  max?: number;
  /**
   *  Expand on hover to show full avatars.
   *  'fixed': AvatarStack physical width does not change when avatars are expanded.
   *  @default false
   */
  expandable?: 'fixed' | boolean;
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
      avatarSize,
      overlap,
      max = 4,
      expandable,
      children,
      ...rest
    },
    ref,
  ) {
    const overflow = Math.max(Children.count(children) - max, 0);
    const childrenToShow =
      overflow > 0
        ? Children.toArray(children).slice(0, max)
        : Children.toArray(children);
    const style = {
      ...(rest.style || {}),
      '--gap': gap !== undefined ? `${gap}` : undefined,
      '--size': avatarSize ? `${avatarSize}` : undefined,
      '--overlap': overlap !== undefined ? `${overlap}` : undefined,
      '--n': childrenToShow.length || 0,
    } as React.CSSProperties;
    return (
      <figure
        tabIndex={expandable ? 0 : -1}
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
