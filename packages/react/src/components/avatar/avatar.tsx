import type { Size } from '@digdir/designsystemet-types';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { Fragment, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

type AriaHidden = HTMLAttributes<HTMLSpanElement>['aria-hidden'];
type AriaAttributes =
  | {
      'aria-label': string; // Require aria-label if no data-tooltip
      'data-tooltip'?: never;
      'aria-hidden'?: AriaHidden;
    }
  | {
      'aria-label'?: never;
      'data-tooltip': string; // Require data-tooltip if no aria-label
      'aria-hidden'?: AriaHidden;
    }
  | {
      'aria-label'?: string; // Make both optional if aria-hidden
      'data-tooltip'?: string;
      'aria-hidden': true | 'true';
    };

export type AvatarProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLSpanElement>,
  AriaAttributes & {
    /**
     * The size of the avatar.
     */
    'data-size'?: 'xs' | Size;
    /**
     * The shape of the avatar.
     *
     * @default 'circle'
     */
    variant?: 'circle' | 'square';
    /**
     * Initials to display inside the avatar.
     */
    initials?: string;
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
    /**
     * Image, icon or initials to display inside the avatar.
     *
     * Gets `aria-hidden="true"`
     */
    children?: ReactNode;
  }
>;

/**
 * Avatars are used to represent people or entities.
 *
 * @example
 * <Avatar aria-label="John Doe" initials="JD" />
 *
 * @example
 * <Avatar aria-label="John Doe">
 *  <img src='…' alt='John Doe' />
 * </Avatar>
 *
 * @example
 * <Avatar aria-label="John Doe">
 *  <Icon />
 * </Avatar>
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    'aria-label': ariaLabel,
    'data-tooltip': dataTooltip,
    variant = 'circle',
    className,
    children,
    initials,
    asChild,
    ...rest
  },
  ref,
) {
  const OuterComponent = asChild ? Slot : 'span';
  const useSlot = children && typeof children !== 'string';
  const textChild = children && typeof children === 'string';
  const Component = useSlot ? Slot : Fragment;

  return (
    <OuterComponent
      ref={ref}
      className={cl('ds-avatar', className)}
      data-variant={variant}
      data-initials={initials}
      role={asChild ? undefined : 'img'}
      aria-label={ariaLabel || dataTooltip}
      data-tooltip={dataTooltip}
      tabIndex={dataTooltip ? 0 : undefined} // Tooltips require focusability for accessibility
      {...rest}
    >
      <Component {...(useSlot && !asChild ? { 'aria-hidden': true } : {})}>
        {textChild ? <span>{children}</span> : children}
      </Component>
    </OuterComponent>
  );
});

/**
 * Gets initials using first and last word of a name.
 */
function _getInitials(name: string | undefined): string | null {
  // Leaving this function for perhaps later use
  if (!name) return null;
  const initials = [];
  const segments = new Intl.Segmenter(document.documentElement.lang || 'no', {
    granularity: 'word',
  }).segment(name);
  for (const segment of segments)
    if (segment.isWordLike) initials.push(segment.segment);
  return `${initials[0][0]}${initials.length > 1 ? initials[initials.length - 1][0] : ''}`;
}
