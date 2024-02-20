import { useEffect, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';

import { Pagination, usePagination } from '.';

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

export const ComponentApi: StoryFn<typeof Pagination> = (args) => {
  const { totalPages = 10 } = args;
  const {
    steps,
    currentPage,
    setCurrentPage,
    handleNextPage,
    handlePreviousPage,
  } = usePagination({
    currentPage: 4,
    totalPages,
  });

  return (
    <Pagination.Root>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            onClick={handlePreviousPage}
            style={{
              visibility: currentPage === 1 ? 'hidden' : undefined,
            }}
          >
            <ChevronLeftIcon aria-hidden />
            Forrige
          </Pagination.Previous>
        </Pagination.Item>

        {steps.map((step, index) => (
          <Pagination.Item key={`${step}-${index}`}>
            {step === 'ellipsis' ? (
              <Pagination.Ellipsis />
            ) : (
              <Pagination.Button
                isActive={currentPage === step}
                onClick={() => setCurrentPage(step)}
                aria-label={`Naviger til side ${step}`}
              >
                {step}
              </Pagination.Button>
            )}
          </Pagination.Item>
        ))}

        <Pagination.Item>
          <Pagination.Next
            onClick={handleNextPage}
            style={{
              visibility: currentPage === totalPages ? 'hidden' : undefined,
            }}
          >
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
            <a href='#side-forrige'>
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
            <a href='#side-1'>1</a>
          </Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Button asChild>
            <a href='#side-6'>6</a>
          </Pagination.Button>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next asChild>
            <a href='#side-neste'>
              Neste
              <ChevronRightIcon aria-hidden />
            </a>
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination.Root>
  );
};
