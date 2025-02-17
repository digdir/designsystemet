import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryFn } from '@storybook/react';

import { useState } from 'react';
import { Pagination } from '.';
import { type UsePaginationProps, usePagination } from '../../utilities';

export default {
  title: 'Komponenter/Pagination',
  component: Pagination,
} as Meta;

export const Preview: StoryFn<typeof Pagination> = (args) => {
  const [page, setCurrentPage] = useState(4);
  const { pages, nextButtonProps, prevButtonProps } = usePagination({
    currentPage: page,
    totalPages: 10,
    showPages: 7,
    setCurrentPage,
  });

  return (
    <Pagination aria-label='Sidenavigering' {...args}>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button aria-label='Forrige side' {...prevButtonProps}>
            Forrige
          </Pagination.Button>
        </Pagination.Item>
        {pages.map(({ page, itemKey, buttonProps }) => (
          <Pagination.Item key={itemKey}>
            {typeof page === 'number' && (
              <Pagination.Button {...buttonProps} aria-label={`Side ${page}`}>
                {page}
              </Pagination.Button>
            )}
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

export const WithAnchor: StoryFn<UsePaginationProps> = (args) => {
  const [, updateArgs] = useArgs();
  const { pages, nextButtonProps, prevButtonProps } = usePagination({
    ...args,
    setCurrentPage: (currentPage) => updateArgs({ currentPage }),
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
            {typeof page === 'number' && (
              <Pagination.Button
                asChild
                aria-label={`Side ${page}`}
                {...buttonProps}
              >
                <a href={`#side-${page}`}>{page}</a>
              </Pagination.Button>
            )}
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

WithAnchor.args = {
  currentPage: 2,
  onChange: console.log, // Open console to see this event
  totalPages: 10,
  showPages: 7,
};
