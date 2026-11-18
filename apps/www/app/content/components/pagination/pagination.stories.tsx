import { Pagination, pagination } from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => {
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
};

export const PreviewEn = () => {
  return (
    <Pagination aria-label='Page navigation'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button>Previous</Pagination.Button>
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
          <Pagination.Button>Next</Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};

export const WithButton = () => {
  const [current, setCurrent] = useState(2);
  const { pages, prev, next } = pagination({
    current,
    total: 10,
    show: 7,
  });

  return (
    <Pagination aria-label='Sidenavigering'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button
            inert={prev.inert}
            onClick={() => setCurrent(prev.value)}
          >
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
          <Pagination.Button
            inert={next.inert}
            onClick={() => setCurrent(next.value)}
          >
            Neste
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};

export const WithButtonEn = () => {
  const [current, setCurrent] = useState(2);
  const { pages, prev, next } = pagination({
    current,
    total: 10,
    show: 7,
  });

  return (
    <Pagination aria-label='Page navigation'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button
            inert={prev.inert}
            onClick={() => setCurrent(prev.value)}
          >
            Previous
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
          <Pagination.Button
            inert={next.inert}
            onClick={() => setCurrent(next.value)}
          >
            Next
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};

export const WithAnchor = () => {
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
};

export const WithAnchorEn = () => {
  const { pages, prev, next } = pagination({
    current: 2,
    total: 10,
    show: 7,
  });
  return (
    <Pagination aria-label='Page navigation'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button asChild inert={prev.inert}>
            <a href={`#page-${prev.value}`}>Previous</a>
          </Pagination.Button>
        </Pagination.Item>
        {pages.map(({ value, ...props }, index) => (
          <Pagination.Item key={value || `ellipsis-${index}`}>
            <Pagination.Button asChild {...props}>
              <a href={`#page-${value}`}>{value}</a>
            </Pagination.Button>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Button asChild inert={next.inert}>
            <a href={`#page-${next.value}`}>Next</a>
          </Pagination.Button>
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};

export const Mobile = () => {
  return (
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
  );
};

export const MobileEn = () => {
  return (
    <Pagination aria-label='Page navigation'>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button aria-label='Previous page' />
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
          <Pagination.Button aria-label='Next page' />
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};
