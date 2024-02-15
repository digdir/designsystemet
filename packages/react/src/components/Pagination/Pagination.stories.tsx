import { useEffect, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';

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
          <Pagination.Button isActive>1</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>2</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>3</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>6</Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button>7</Pagination.Button>
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
            <a href='#som-anchor'>
              <ChevronLeftIcon aria-hidden />
              Forrige
            </a>
          </Pagination.Previous>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button
            isActive
            asChild
          >
            <a href='#som-anchor'>1</a>
          </Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button asChild>
            <a href='#som-anchor'>6</a>
          </Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next asChild>
            <a href='#som-anchor'>
              Neste
              <ChevronRightIcon aria-hidden />
            </a>
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination.Root>
  );
};
