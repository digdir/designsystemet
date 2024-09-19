import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext, useEffect, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import { PaginationContext } from './Pagination';

export type PaginationListProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLUListElement>, 'size'>;

// TODO: Browsertest
export const PaginationList = forwardRef<HTMLUListElement, PaginationListProps>(
  function PaginationList({ asChild, ...rest }, ref) {
    const Component = asChild ? Slot : 'ul';
    const listRef = useRef<HTMLUListElement>(null);
    const mergedRef = useMergeRefs([listRef, ref]);

    useEffect(() => {
      const state = getState({}, listRef.current);
      const handleResize = () => {
        const { current, pages, prev, next, total } = state;
        let visible = total + 1;

        for (const page of pages) page.hidden = false; // Show all items
        while (visible && --visible) {
          const isWrapping = (prev?.offsetTop || 0) < (next?.offsetTop || 0);
          if (isWrapping) pages[visible - 1].hidden = true;
          else break; // Break when not wrapping
        }

        const offset = (visible - 1) / 2;
        const start = Math.min(
          Math.max(current - Math.floor(offset), 1),
          total - visible + 1,
        );
        const end = Math.min(
          Math.max(current + Math.ceil(offset), visible),
          total,
        );
        const startEllipsis = visible > 4 && start > 1;
        const endEllipsis = visible > 3 && end < total;
        console.log(current, start, end, visible);

        pages.forEach((page, index) => {
          page.hidden = index + 1 < start || index + 1 > end;

          // page.removeAttribute('aria-hidden');
          // if (startEllipsis && index === 0) page.hidden = false;
          // else if (startEllipsis && index === 1) {
          //   page.hidden = false;
          //   page.setAttribute('aria-hidden', 'true');
          // } else {
          //   page.hidden = index + 1 < start || index + 1 > end;
          // }
          // console.log(now, start, index, end);
        });
      };

      const resizeObserver = new ResizeObserver(handleResize);
      const mutationObserver = new MutationObserver(() => {
        getState(state, listRef.current);
        handleResize();
      });

      handleResize();
      if (state.list) {
        window.addEventListener('resize', handleResize);
        resizeObserver.observe(state.list);
        mutationObserver.observe(state.list, {
          attributeFilter: ['aria-current'],
          attributes: true,
          childList: true,
          subtree: true,
        });
      }
      return () => {
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }, []);

    return <Component ref={mergedRef} {...rest} />;
  },
);

const getState = (state = {}, list?: HTMLElement | null) => {
  const pages = Array.from(list?.children || []).slice(1, -1) as HTMLElement[];
  const current = list?.querySelector('[aria-current="page"]');

  return Object.assign(state, {
    current: pages.findIndex((page) => page.contains(current as Node)) + 1,
    pages,
    list,
    next: list?.lastElementChild as HTMLElement | null,
    prev: list?.firstElementChild as HTMLElement | null,
    total: pages.length,
  });
};
