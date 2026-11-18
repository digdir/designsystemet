import { type PaginationOptions, pagination } from '@digdir/designsystemet-web';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { Pagination } from './';

const meta = preview.meta({
  title: 'Komponenter/Pagination',
  component: Pagination,
});

export const Preview = meta.story(() => {
  return (
    <Pagination aria-label='Sidenavigering'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button>Forrige</Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button>1</Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button aria-current='page'>2</Pagination.Button>
        </Pagination.Item>

        <Pagination.Item />

        <Pagination.Item>
          <Pagination.Button>9</Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button>10</Pagination.Button>
        </Pagination.Item>

        <Pagination.Item>
          <Pagination.Button>Neste</Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
});

export const WithAnchor = meta.story({
  render: (args) => {
    const { current, total, show } = args as PaginationOptions;
    const { pages, prev, next } = pagination({ current, total, show });

    return (
      <Pagination aria-label='Sidenavigering'>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button asChild inert={prev.inert}>
              <a href={`#side-${prev.value}`}>Forrige</a>
            </Pagination.Button>
          </Pagination.Item>
          {pages.map(({ value, ...props }, index) => (
            <Pagination.Item key={value || `ellipsis-${index}`}>
              <Pagination.Button asChild {...props}>
                <a href={`#side-${value}`}>{value}</a>
              </Pagination.Button>
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Button asChild inert={next.inert}>
              <a href={`#side-${next.value}`}>Neste</a>
            </Pagination.Button>
          </Pagination.Item>
        </Pagination.List>
      </Pagination>
    );
  },

  args: {
    current: 2,
    total: 10,
    show: 7,
  },
});

export const Mobile = meta.story(() => (
  <Pagination aria-label='Sidenavigering'>
    <Pagination.List>
      <Pagination.Item>
        <Pagination.Button aria-label='Forrige side' />
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button>2</Pagination.Button>
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button aria-current='page'>3</Pagination.Button>
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button>4</Pagination.Button>
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button aria-label='Neste side' />
      </Pagination.Item>
    </Pagination.List>
  </Pagination>
));

export const RTL = meta.story(() => (
  <Pagination aria-label='Sidenavigering' dir='rtl'>
    <Pagination.List>
      <Pagination.Item>
        <Pagination.Button aria-label='Forrige side' />
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button>2</Pagination.Button>
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button aria-current='page'>3</Pagination.Button>
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button>4</Pagination.Button>
      </Pagination.Item>

      <Pagination.Item>
        <Pagination.Button aria-label='Neste side' />
      </Pagination.Item>
    </Pagination.List>
  </Pagination>
));
