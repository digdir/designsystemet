import type { DSPaginationElement } from '@digdir/designsystemet-web';
import '@digdir/designsystemet-web'; // Import ds-breadcrumbs custom element
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type PaginationProps = MergeRight<
  DefaultProps & HTMLAttributes<DSPaginationElement>,
  {
    /**
     * Sets the screen reader label for the Pagination area
     * @default 'Bla i sider'
     */
    'aria-label'?: string;
    /**
     * Current page number
     */
    'data-current'?: string;
    /**
     * Total number of pages
     */
    'data-total'?: string;
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     *
     * @deprecated This is not supported anymore, as the element needs to be `ds-pagination`
     */
    asChild?: boolean;
  }
>;

/**
 * Pagination component, used to navigate through a list of items.
 *
 * @example
 * <Pagination>
 *   <Pagination.List>
 *     <Pagination.Item>
 *       <Pagination.Button aria-label='Forrige side'>Forrige</Pagination.Button>
 *     </Pagination.Item>
 *     <Pagination.Item>
 *       <Pagination.Button aria-label='Side 1'>1</Pagination.Button>
 *     </Pagination.Item>
 *     <Pagination.Item>
 *       <Pagination.Button aria-label='Side 2'>2</Pagination.Button>
 *     </Pagination.Item>
 *   </Pagination.List>
 * </Pagination>
 */
export const Pagination = forwardRef<DSPaginationElement, PaginationProps>(
  function Pagination({ asChild, className, ...rest }, ref) {
    const Component = asChild ? Slot : 'ds-pagination';

    return (
      <Component
        {...(asChild
          ? { className: cl('ds-pagination', className) }
          : { class: cl('ds-pagination', className) })}
        ref={ref}
        {...rest}
      />
    );
  },
);
