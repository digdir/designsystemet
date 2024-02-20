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

export const UsePagination: StoryFn<typeof Pagination> = (args) => {
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
                aria-label={`Side ${step}`}
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

export const WithAnchor: StoryFn<typeof Pagination> = (args) => {
  const { totalPages = 4 } = args;
  const { steps, currentPage } = usePagination({
    currentPage: 2,
    totalPages,
  });

  return (
    <Pagination.Root>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            asChild
            aria-label='Naviger til forrige side'
            style={{
              visibility: currentPage === 1 ? 'hidden' : undefined,
            }}
          >
            <a href='#forrige-side'>
              <ChevronLeftIcon aria-hidden />
              Forrige
            </a>
          </Pagination.Previous>
        </Pagination.Item>

        {steps.map((step, index) => (
          <Pagination.Item key={`${step}-${index}`}>
            {step === 'ellipsis' ? (
              <Pagination.Ellipsis />
            ) : (
              <Pagination.Button
                asChild
                isActive={currentPage === step}
                aria-label={`Naviger til side ${step}`}
              >
                <a href={`#side-${step}`}> {step}</a>
              </Pagination.Button>
            )}
          </Pagination.Item>
        ))}

        <Pagination.Item>
          <Pagination.Next
            asChild
            aria-label='Naviger til neste side'
            style={{
              visibility: currentPage === totalPages ? 'hidden' : undefined,
            }}
          >
            <a href='#neste-side'>
              Neste
              <ChevronRightIcon aria-hidden />
            </a>
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination.Root>
  );
};
