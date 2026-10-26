import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type AvatarStackProps = {
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
 * <AvatarStack>
 *   <Avatar aria-label='name'>
 *     <img src={cat1} alt='' />
 *   </Avatar>
 *   <Avatar aria-label='name'>
 *     <BriefcaseIcon />
 *   </Avatar>
 *   <Avatar aria-label='name'>sm</Avatar>
 * </AvatarStack>
 */
export const AvatarStack = forwardRef<HTMLUListElement, AvatarStackProps>(
  function AvatarStack({ className, expandable, ...rest }, ref) {
    return (
      <ul
        className={cl(`ds-avatar-stack`, className)}
        data-expandable={expandable || undefined}
        tabIndex={rest.tabIndex ?? (expandable ? 0 : undefined)}
        ref={ref}
        {...rest}
      />
    );
  },
);
