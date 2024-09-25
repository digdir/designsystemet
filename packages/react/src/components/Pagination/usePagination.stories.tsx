import type { Meta } from '@storybook/react';

export default {} as Meta;

export const UsePaginationArgs = {
  argTypes: {
    currentPage: {
      description: 'The current page number',
      defaultValue: {
        summary: 1,
      },
      table: {
        type: {
          summary: 'number',
        },
      },
    },
    setCurrentPage: {
      description:
        'Function to change currentPage - typically returned from useState',
      table: {
        type: {
          summary: '(page: number) => void',
        },
      },
    },
    onChange: {
      table: {
        type: {
          summary: '(event: MouseEvent<HTMLElement>, page: number) => void',
        },
      },
    },
    totalPages: {
      table: {
        type: {
          summary: 'number',
        },
      },
    },
    showPages: {
      description: 'The maximum number of pages to render',
      defaultValue: {
        summary: 7,
      },
      table: {
        type: {
          summary: 'number',
        },
      },
    },
  },
};
