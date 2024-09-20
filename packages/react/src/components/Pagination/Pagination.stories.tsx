import type { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';

import { Pagination, usePagination } from '.';

export default {
  title: 'Komponenter/Pagination',
  component: Pagination,
} as Meta;

export const Preview: StoryFn<typeof Pagination> = () => {
  const [currentPage, setCurrentPage] = useState(4);
  const { pages, goNext, goPrevious, hasNext, hasPrevious } = usePagination({
    currentPage,
    setCurrentPage,
    totalPages: 10,
    showPages: 7,
  });

  return (
    <Pagination aria-label='Sidenavigering'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button
            aria-label='Forrige side'
            disabled={!hasPrevious}
            onClick={goPrevious}
          >
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
          <Pagination.Button
            aria-label='Neste side'
            disabled={!hasNext}
            onClick={goNext}
          >
            Neste
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};

export const WithAnchor: StoryFn<typeof Pagination> = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const { pages } = usePagination({
    currentPage,
    setCurrentPage,
    totalPages: 10,
  });

  return (
    <Pagination aria-label='Sidenavigering'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button asChild aria-label='Forrige side'>
            <a href='#forrige-side'>Forrige</a>
          </Pagination.Button>
        </Pagination.Item>

        {pages.map(({ page, itemKey, buttonProps }) => (
          <Pagination.Item key={itemKey}>
            <Pagination.Button
              asChild
              {...buttonProps}
              aria-label={`Side ${page}`}
            >
              <a href={`#side-${page}`}> {page}</a>
            </Pagination.Button>
          </Pagination.Item>
        ))}

        <Pagination.Item>
          <Pagination.Button asChild aria-label='Neste side'>
            <a href='#neste-side'>Neste</a>
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};
