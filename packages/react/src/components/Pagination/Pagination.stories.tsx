import type { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';

import { Pagination, usePagination } from '.';

export default {
  title: 'Komponenter/Pagination',
  component: Pagination,
} as Meta;

export const Preview: StoryFn<typeof Pagination> = (args) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage);

  useEffect(() => {
    setCurrentPage(args.currentPage);
  }, [args.currentPage]);

  return (
    <Pagination {...args} onChange={setCurrentPage} currentPage={currentPage} />
  );
};
Preview.args = {
  'aria-label': 'Sidenavigering',
  size: 'md',
  nextLabel: 'Neste',
  previousLabel: 'Forrige',
  totalPages: 10,
  hideLabels: false,
  compact: false,
  currentPage: 1,
  itemLabel: (num) => `Side ${num}`,
};

export const UsePagination: StoryFn<typeof Pagination> = (args) => {
  const { totalPages = 10 } = args;
  const {
    pages,
    currentPage,
    setCurrentPage,
    nextPage,
    previousPage,
    showNextPage,
    showPreviousPage,
  } = usePagination({
    currentPage: 4,
    totalPages,
  });

  return (
    <Pagination.Root aria-label='Sidenavigering'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous
            onClick={previousPage}
            disabled={!showPreviousPage}
          >
            Forrige
          </Pagination.Previous>
        </Pagination.Item>

        {pages.map((page, index) => (
          <Pagination.Item key={`${page}-${index}`}>
            {page === 'ellipsis' ? (
              <Pagination.Ellipsis />
            ) : (
              <Pagination.Button
                isActive={currentPage === page}
                onClick={() => setCurrentPage(page)}
                aria-label={`Side ${page}`}
              >
                {page}
              </Pagination.Button>
            )}
          </Pagination.Item>
        ))}

        <Pagination.Item>
          <Pagination.Next onClick={nextPage} disabled={!showNextPage}>
            Neste
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
};

export const WithAnchor: StoryFn<typeof Pagination> = (args) => {
  const { totalPages = 4 } = args;
  const { pages, currentPage } = usePagination({
    currentPage: 2,
    totalPages,
  });

  return (
    <Pagination.Root aria-label='Sidenavigering'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous asChild aria-label='Naviger til forrige side'>
            <a href='#forrige-side'>Forrige</a>
          </Pagination.Previous>
        </Pagination.Item>

        {pages.map((page, index) => (
          <Pagination.Item key={`${page}-${index}`}>
            {page === 'ellipsis' ? (
              <Pagination.Ellipsis />
            ) : (
              <Pagination.Button
                asChild
                isActive={currentPage === page}
                aria-label={`Naviger til side ${page}`}
              >
                <a href={`#side-${page}`}> {page}</a>
              </Pagination.Button>
            )}
          </Pagination.Item>
        ))}

        <Pagination.Item>
          <Pagination.Next asChild aria-label='Naviger til neste side'>
            <a href='#neste-side'>Neste</a>
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
};
