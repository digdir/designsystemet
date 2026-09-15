import cl from 'clsx/lite';
import type { CSSProperties, HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type AvatarStackProps = {
  /**
   *  Adjusts gap-mask between avatars in the stack. Must be a valid css length value (px, em, rem, var(--ds-size-1) etc.)
   *  @default 2px
   *  @deprecated Please use `style={{ '--dsc-avatar-stack-gap': VALUE }}` instead
   */
  gap?: string;
  /**
   *  Control the size of the avatars. Must be a valid css length value (px, em, rem, var(--ds-size-12) etc.)
   *  @default 'var(--ds-size-12)'
   *  @deprecated Please use `style={{ '--dsc-avatar-stack-size': VALUE }}` instead
   */
  avatarSize?: string;
  /**
   *  A number which represents the percentage value of how much avatars should overlap.
   *  @default 50
   *  @deprecated Please use `style={{ '--dsc-avatar-stack-overlap': VALUE }}` instead
   */
  overlap?: number | string;
  /**
   *  Text to the right of the avatars to show a number representing additional avatars not shown such as '+5'".
   *  @deprecated Please use a trailing `<li>` with text instead
   */
  suffix?: string;
  /**
   *  Expand on hover to show full avatars.
   *  'fixed': AvatarStack physical width does not change when avatars are expanded.
   *  @default undefined
   */
  expandable?: 'fixed' | boolean;
} & HTMLAttributes<HTMLUListElement>;

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
  HTMLUListElement,
  AvatarStackProps
>(function AvatarStack(
  {
    className,
    gap,
    suffix,
    children,
    avatarSize,
    overlap,
    style,
    expandable,
    ...rest
  },
  ref,
) {
  if (typeof overlap === 'number')
    overlap = `calc(var(--dsc-avatar-stack-size) / 100 * ${overlap})`; // Support backwards compatible integer overlap

  return (
    <ul
      className={cl(`ds-avatar-stack`, className)}
      data-expandable={expandable || undefined}
      tabIndex={rest.tabIndex ?? (expandable ? 0 : undefined)}
      ref={ref}
      style={
        {
          '--dsc-avatar-stack-gap': gap,
          '--dsc-avatar-stack-size': avatarSize,
          '--dsc-avatar-stack-overlap': overlap,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
      {suffix && <li>{suffix}</li>}
    </ul>
  );
});
