import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type BreadcrumbsProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLElement>,
  {
    /**
     * Sets the screen reader label for the Breadcrumbs area
     * @default 'Du er her'
     */
    'aria-label'?: string;
  }
>;

/**
 * `Breadcrumbs` is a component that displays a list of breadcrumbs.
 *
 * @example
 * <Breadcrumbs aria-label='Du er her:' {...args}>
 *  <Breadcrumbs.Link href='#' aria-label='Tilbake til Nivå 1'>
 *    Nivå 1
 *  </Breadcrumbs.Link>
 *  <Breadcrumbs.List>
 *    <Breadcrumbs.Item>
 *      <Breadcrumbs.Link href='#'>Nivå 1</Breadcrumbs.Link>
 *    </Breadcrumbs.Item>
 *    <Breadcrumbs.Item>
 *      <Breadcrumbs.Link href='#'>Nivå 2</Breadcrumbs.Link>
 *    </Breadcrumbs.Item>
 *  </Breadcrumbs.List>
 * </Breadcrumbs>
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ 'aria-label': ariaLabel = 'Du er her:', className, ...rest }, ref) => (
    <nav
      aria-label={ariaLabel}
      className={cl('ds-breadcrumbs', className)}
      ref={ref}
      {...rest}
    />
  ),
);
