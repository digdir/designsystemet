import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import {
  Fragment,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useMemo,
} from 'react';

export type AvatarProps = {
  /**
   * The name of the person the avatar represents.
   * Will be used to generate initials if no image is provided.
   */
  name?: string;
  /**
   * The color of the avatar.
   *
   * @default 'accent'
   */
  color?: 'accent' | 'neutral' | 'brand1' | 'brand2' | 'brand3';
  /**
   * The size of the avatar.
   *
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /**
   * The shape of the avatar.
   *
   * @default 'circle'
   */
  variant?: 'circle' | 'square';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
  /**
   * Image or icon to display inside the avatar.
   *
   * Gets `aria-hidden="true"`
   */
  children?: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

const fontSizeMap = {
  xs: 'ds-paragraph--xs',
  sm: 'ds-heading--2xs',
  md: 'ds-heading--sm',
  lg: 'ds-heading--md',
};

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    name,
    color = 'accent',
    size = 'md',
    variant = 'circle',
    asChild,
    className,
    children,
    ...rest
  },
  ref,
) {
  const Component = asChild ? Slot : 'span';
  const InternalComponent = children ? Slot : Fragment;

  const initials = useMemo(() => {
    return getInitials(name);
  }, [name]);

  return (
    <Component
      ref={ref}
      className={cl('ds-avatar', fontSizeMap[size], className)}
      data-ds-variant={variant}
      data-ds-color={color}
      data-ds-size={size}
      {...rest}
      role='img'
      aria-label={name}
    >
      <InternalComponent {...(children ? { 'aria-hidden': true } : {})}>
        {children || initials}
      </InternalComponent>
    </Component>
  );
});

/**
 * Gets initials using first and last word of a name.
 */
function getInitials(name: string | undefined): string | null {
  if (!name) return null;
  const splitName = name.trim().split(' ');
  return `${splitName[0][0]}${splitName.length > 1 ? splitName[splitName.length - 1][0] : ''}`.toUpperCase();
}
