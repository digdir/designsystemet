import { pagination } from '@digdir/designsystemet-web';
import { useState } from 'react';
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
  render: () => {
    const { pages, prev, next } = pagination({
      current: 2,
      total: 10,
      show: 7,
    });

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

export const WithHelper = meta.story(() => {
  const [current, setCurrent] = useState(2);
  const { pages, prev, next } = pagination({
    current,
    total: 10,
    show: 2,
  });

  return (
    <Pagination aria-label='Sidenavigering'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button {...prev} onClick={() => setCurrent(prev.value)}>
            Forrige
          </Pagination.Button>
        </Pagination.Item>
        {pages.map(({ value, ...props }, index) => (
          <Pagination.Item key={value || `ellipsis-${index}`}>
            <Pagination.Button {...props} onClick={() => setCurrent(value)}>
              {value}
            </Pagination.Button>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Button {...next} onClick={() => setCurrent(next.value)}>
            Neste
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
});
