import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { Children, forwardRef } from 'react';

export type AvatarStackProps = {
  /**
   *  Adjusts gap-mask between avatars in the stack. Must be a valid css length value (px, em, rem, var(--ds-size-1) etc.)
   *  @default 2px
   */
  gap?: string;
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
   *  Text to the right of the avatars to show a number representing additional avatars not shown such as '+5'".
   */
  suffix?: string;
  /**
   *  Expand on hover to show full avatars.
   *  'fixed': AvatarStack physical width does not change when avatars are expanded.
   *  @default undefined
   */
  expandable?: 'fixed' | true;
} & HTMLAttributes<HTMLDivElement>;

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
  const style = {
    ...(rest.style || {}),
    '--dsc-avatar-stack-gap': gap !== undefined ? `${gap}` : undefined,
    '--dsc-avatar-stack-size': avatarSize ? `${avatarSize}` : undefined,
    '--dsc-avatar-stack-overlap':
      overlap !== undefined ? `${overlap}` : undefined,
    '--dsc-avatar-count':
      expandable === 'fixed' ? Children.count(children) : undefined,
  } as React.CSSProperties;
  return (
    <figure
      tabIndex={expandable ? 0 : -1}
      ref={ref}
      className={cl(`ds-avatar-stack`, className)}
      style={style}
      data-expandable={expandable}
      data-suffix={suffix}
      {...rest}
    >
      {children}
    </figure>
  );
});
