import { useEffect, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';

import { Link } from '../Link';

import { Pagination } from '.';

export default {
  title: 'Felles/Pagination',
  component: Pagination,
} as Meta;

export const Preview: StoryFn<typeof Pagination> = (args) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage);

  useEffect(() => {
    setCurrentPage(args.currentPage);
  }, [args.currentPage]);

  return (
    <>
      <Pagination
        {...args}
        onChange={setCurrentPage}
        currentPage={currentPage}
      ></Pagination>
    </>
  );
};

Preview.args = {
  size: 'medium',
  nextLabel: 'Neste',
  previousLabel: 'Forrige',
  totalPages: 10,
  hideLabels: false,
  compact: false,
  currentPage: 1,
  itemLabel: (num) => `Side ${num}`,
};

export const ComponentApi = () => {
  return (
    <Pagination.Root>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous>
            <ChevronLeftIcon aria-hidden />
            Forrige
          </Pagination.Previous>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link isActive>1</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link>2</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link>3</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link>6</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link>7</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next>
            Neste
            <ChevronRightIcon aria-hidden />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination.Root>
  );
};

export const WithAnchor = () => {
  return (
    <Pagination.Root>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous asChild>
            <Link
              href='#'
              style={{ textDecoration: 'none' }}
            >
              <ChevronLeftIcon aria-hidden />
              Forrige
            </Link>
          </Pagination.Previous>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link
            isActive
            asChild
          >
            <Link
              href='#'
              style={{ color: 'white', textDecoration: 'none' }}
            >
              1
            </Link>
          </Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link asChild>
            <Link
              href='#'
              style={{ textDecoration: 'none' }}
            >
              6
            </Link>
          </Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next asChild>
            <Link
              href='#'
              style={{ textDecoration: 'none' }}
            >
              Neste
              <ChevronRightIcon aria-hidden />
            </Link>
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination.Root>
  );
};
