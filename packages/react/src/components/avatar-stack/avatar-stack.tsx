import cl from 'clsx/lite';
import type { CSSProperties, HTMLAttributes } from 'react';
import { forwardRef, useEffect } from 'react';
import { warn } from '../../utilities';

export type AvatarStackProps = {
  /**
   *  Adjusts gap-mask between avatars in the stack. Must be a valid css length value (px, em, rem, var(--ds-size-1) etc.)
   *  @default 2px
   *  @deprecated Please use `style={{ --dsc-avatar-stack-gap: VALUE }}` instead
   */
  gap?: string;
  /**
   *  Control the size of the avatars. Must be a valid css length value (px, em, rem, var(--ds-size-12) etc.)
   *  @default 'var(--ds-size-12)'
   *  @deprecated Please use `style={{ --dsc-avatar-stack-size: VALUE }}` instead
   */
  avatarSize?: string;
  /**
   *  A number which represents the percentage value of how much avatars should overlap.
   *  @default 50
   *  @deprecated Please use `style={{ --dsc-avatar-stack-overlap: VALUE }}` instead
   */
  overlap?: number;
  /**
   *  Text to the right of the avatars to show a number representing additional avatars not shown such as '+5'".
   */
  suffix?: string;
  /**
   *  Expand on hover to show full avatars.
   *  'fixed': AvatarStack physical width does not change when avatars are expanded.
   *  @default undefined
   */
  expandable?: 'fixed' | true;
} & HTMLAttributes<HTMLSpanElement>;

/**
 * Use `AvatarStack` to constrain Avatars into a stack.
 *
 * @example
 * <EXPERIMENTAL_AvatarStack>
 *   <Avatar aria-label='name'>
 *     <img src={cat1} alt='' />
 *   </Avatar>
 *   <Avatar aria-label='name'>
 *     <BriefcaseIcon />
 *   </Avatar>
 *   <Avatar aria-label='name' initials='sm' />
 * </EXPERIMENTAL_AvatarStack>
 */
export const EXPERIMENTAL_AvatarStack = forwardRef<
  HTMLDivElement,
  AvatarStackProps
>(function AvatarStack(
  {
    className,
    gap,
    suffix,
    avatarSize,
    overlap,
    expandable,
    children,
    ...rest
  },
  ref,
) {
  useEffect(() => {
    for (const [key, value] of Object.entries({ gap, avatarSize, overlap }))
      if (value)
        warn(
          `AvatarStack: "${key}" property is deprecated. Please use style={{ '--dsc-avatar-stack-${key}:' '${value}' } as React.CSSProperties} instead`,
        );
  }, [gap, avatarSize, overlap]);

  return (
    <div
      className={cl(`ds-avatar-stack`, className)}
      tabIndex={rest.tabIndex ?? (expandable ? 0 : undefined)}
      ref={ref}
      style={
        {
          ...(rest.style || {}),
          '--dsc-avatar-stack-gap': gap !== undefined ? `${gap}` : undefined,
          '--dsc-avatar-stack-size': avatarSize ? `${avatarSize}` : undefined,
          '--dsc-avatar-stack-overlap':
            overlap !== undefined ? `${overlap}` : undefined,
        } as CSSProperties
      }
      data-expandable={expandable}
      data-suffix={suffix}
      {...rest}
    >
      {children}
    </div>
  );
});
