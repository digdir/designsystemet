import { Pagination, usePagination } from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const { pages, nextButtonProps, prevButtonProps } = usePagination({
    totalPages: 10,
    currentPage,
    setCurrentPage: setCurrentPage,
    showPages: 5,
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
