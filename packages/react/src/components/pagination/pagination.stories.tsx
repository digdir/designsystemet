import { useArgs } from 'storybook/preview-api';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { type UsePaginationProps, usePagination } from '../../utilities';
import { Pagination } from './';

const meta = preview.meta({
  title: 'Komponenter/Pagination',
  component: Pagination,
});

export const Preview = meta.story(() => {
  return (
    <Pagination>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button aria-label='Forrige side'>
            Forrige
          </Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Side 1'>1</Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Side 2' aria-current='true'>
            2
          </Pagination.Button>
        </Pagination.Item>

        <Pagination.Item />

        <Pagination.Item>
          <Pagination.Button aria-label='Side 9'>9</Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Side 10'>10</Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-label='Neste side'>Neste</Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
});

export const WithAnchor = meta.story({
  render: (args) => {
    const [, updateArgs] = useArgs();
    const { pages, nextButtonProps, prevButtonProps } = usePagination({
      ...(args as UsePaginationProps),
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
  },

  args: {
    currentPage: 2,
    onChange: console.log, // Open console to see this event
    totalPages: 10,
    showPages: 7,
  },
});

export const Mobile = meta.story(() => (
  <Pagination>
    <Pagination.List>
      <Pagination.Item>
        <Pagination.Button aria-label='Forrige side' />
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button aria-label='Side 2'>2</Pagination.Button>
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button aria-label='Side 3' aria-current='true'>
          3
        </Pagination.Button>
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button aria-label='Side 4'>4</Pagination.Button>
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button aria-label='Neste side' />
      </Pagination.Item>
    </Pagination.List>
  </Pagination>
));
