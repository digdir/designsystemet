import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryFn } from '@storybook/react';
import { Pagination } from '../../../components';
import { type UsePaginationProps, usePagination } from './usePagination';

const meta: Meta = {
  title: 'Utilities/usePagination',
  parameters: { chromatic: { disableSnapshot: true } },
  argTypes: {
    currentPage: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
      description: 'The current page number',
      type: { name: 'number' },
    },
    totalPages: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
      description: 'The total number of pages',
      type: { name: 'number' },
    },
    showPages: {
      control: {
        type: 'number',
      },
      defaultValue: 7,
      description: 'The maximum number of pages to show',
      type: { name: 'number' },
    },
    setCurrentPage: {
      description: 'Callback to set the current page',
      type: { name: 'function' },
    },
    onChange: {
      description: 'Callback when the page changes',
      type: { name: 'function' },
    },
  },
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
          <Pagination.Button aria-label='Forrige side' {...prevButtonProps}>
            Forrige
          </Pagination.Button>
        </Pagination.Item>
        {pages.map(({ page, itemKey, buttonProps }) => (
          <Pagination.Item key={itemKey}>
            {typeof page === 'number' && (
              <Pagination.Button aria-label={`Side ${page}`} {...buttonProps}>
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

Preview.args = {
  currentPage: 2,
  totalPages: 10,
  showPages: 7,
};
