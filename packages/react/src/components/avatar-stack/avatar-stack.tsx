import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type AvatarStackProps = {
  /**
   *  Adjusts gap between avatars in the stack in px.
   *  @default 4
   */
  gap?: number;
  avatarSize?: number;
  /**
   *  This is a percentage value of how much avatars should overlap.
   *  @default 50
   */
  overlap?: number;
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
    { className, gap, avatarSize, overlap = 50, ...rest },
    ref,
  ) {
    const style = {
      ...(rest.style || {}),
      '--gap': gap ? `${gap}px` : undefined,
      '--size': avatarSize ? `${avatarSize}px` : undefined,
      '--overlap': overlap ? `${overlap}` : undefined,
    } as React.CSSProperties;
    return (
      <div
        ref={ref}
        className={cl(`ds-avatar-stack`, className)}
        style={style}
        {...rest}
      />
    );
  },
);
