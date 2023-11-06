import React, { useState } from 'react';
import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';

import { Button, Paragraph } from '../..';

import { Search } from '.';

type Story = StoryObj<typeof Search>;

export default {
  title: 'Felles/Search',
  component: Search,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Label',
    disabled: false,
    size: 'medium',
    error: '',
    placeholder: '',
    variant: 'primary',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Label',
    variant: 'primary',
  },
  parameters: {
    layout: 'padded',
  },
};

export const Controlled: StoryFn<typeof Search> = () => {
  const [value, setValue] = useState<string>();
  return (
    <>
      <Paragraph>Du har skrevet inn: {value}</Paragraph>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 'var(--fds-spacing-2)',
          gap: 'var(--fds-spacing-2)',
        }}
      >
        <Search
          label='Kontroller meg!'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => setValue('Pizza')}>Jeg vil ha Pizza</Button>
      </div>
    </>
  );
};

export const Landmark: StoryFn<typeof Search> = () => {
  return (
    <form
      role='search'
      onSubmit={(e) => {
        // Prevent browser navigate on submit
        e.preventDefault();
        alert('du har søkt!');
      }}
    >
      <Search
        label='Søk etter innhold'
        searchButton={
          <MagnifyingGlassIcon
            aria-hidden
            fontSize={'1.5em'}
          />
        }
        variant='primary'
        onSearchClick={(val) => {
          alert(`Du har trykkket på søk: ${val?.toString()}`);
        }}
      />
    </form>
  );
};
