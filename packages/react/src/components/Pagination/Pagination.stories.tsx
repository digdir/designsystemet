import type { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';

import { Pagination, usePagination } from '.';

export default {
  title: 'Komponenter/Pagination',
  component: Pagination,
} as Meta;

export const Preview: StoryFn<typeof Pagination> = () => {
  const [currentPage, setCurrentPage] = useState(4);
  const { pages, nextButtonProps, prevButtonProps } = usePagination({
    currentPage,
    setCurrentPage,
    onChange: console.log, // Open console to see this event
    totalPages: 10,
    showPages: 7,
  });

  return (
    <Pagination aria-label='Sidenavigering'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button aria-label='Forrige side' {...prevButtonProps}>
            Forrige
          </Pagination.Button>
        </Pagination.Item>
        {pages.map(({ page, itemKey, buttonProps }) => (
          <Pagination.Item key={itemKey}>
            <Pagination.Button {...buttonProps} aria-label={`Side ${page}`}>
              {page}
            </Pagination.Button>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Button aria-label='Neste side' {...nextButtonProps}>
            Neste
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};

export const WithAnchor: StoryFn<typeof Pagination> = () => {
  const { pages, prevButtonProps, nextButtonProps } = usePagination({
    currentPage: 2,
    totalPages: 10,
  });

  return (
    <Pagination aria-label='Sidenavigering'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button
            asChild
            aria-label='Forrige side'
            {...prevButtonProps}
          >
            <a href='#forrige-side'>Forrige</a>
          </Pagination.Button>
        </Pagination.Item>

        {pages.map(({ page, itemKey, buttonProps }) => (
          <Pagination.Item key={itemKey}>
            <Pagination.Button
              asChild
              aria-label={`Side ${page}`}
              {...buttonProps}
            >
              <a href={`#side-${page}`}> {page}</a>
            </Pagination.Button>
          </Pagination.Item>
        ))}

        <Pagination.Item>
          <Pagination.Button
            asChild
            aria-label='Neste side'
            {...nextButtonProps}
          >
            <a href='#neste-side'>Neste</a>
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};
