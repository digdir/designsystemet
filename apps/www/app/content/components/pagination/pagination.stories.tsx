import { Pagination, usePagination } from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => {
  return (
    <Pagination>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button aria-label='Forrige side' data-variant='tertiary'>
            Forrige
          </Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Side 1' data-variant='tertiary'>
            1
          </Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Side 2' data-variant='primary'>
            2
          </Pagination.Button>
        </Pagination.Item>

        <Pagination.Item />

        <Pagination.Item>
          <Pagination.Button aria-label='Side 9' data-variant='tertiary'>
            9
          </Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Side 10' data-variant='tertiary'>
            10
          </Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Neste side' data-variant='tertiary'>
            Neste
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};

export const WithAnchor = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const { pages, nextButtonProps, prevButtonProps } = usePagination({
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

export const Mobile = () => {
  return (
    <Pagination>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button
            aria-label='Forrige side'
            data-variant='tertiary'
          />
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Side 2' data-variant='tertiary'>
            2
          </Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Side 3'>3</Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Side 4' data-variant='tertiary'>
            4
          </Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Neste side' data-variant='tertiary' />
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};
