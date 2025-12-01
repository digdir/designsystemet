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
    <Pagination aria-label='Page navigation'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button aria-label='Previous page' {...prevButtonProps}>
            Previous
          </Pagination.Button>
        </Pagination.Item>
        {pages.map(({ page, itemKey, buttonProps }) => (
          <Pagination.Item key={itemKey}>
            {typeof page === 'number' && (
              <Pagination.Button aria-label={`Page ${page}`} {...buttonProps}>
                {page}
              </Pagination.Button>
            )}
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Button aria-label='Next page' {...nextButtonProps}>
            Next
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};
