import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryFn } from '@storybook/react';
import { Pagination } from '../../../components';
import { type UsePaginationProps, usePagination } from './usePagination';

const meta: Meta = {
  title: 'Utilities/usePagination',
  parameters: { chromatic: { disableSnapshot: true } },
};

export default meta;

export const Preview: StoryFn<UsePaginationProps> = (args) => {
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

Preview.args = {
  currentPage: 2,
  totalPages: 10,
  showPages: 7,
};
