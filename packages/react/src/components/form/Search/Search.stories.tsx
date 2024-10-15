import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button, Divider, Heading, Paragraph } from '../..';

import { Search } from '.';

type Story = StoryObj<typeof Search>;

export default {
  title: 'Komponenter/Search',
  component: Search,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Label',
    disabled: false,
    size: 'md',
    placeholder: '',
    variant: 'simple',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Label',
  },
  parameters: {
    layout: 'padded',
  },
};

export const Controlled: StoryFn<typeof Search> = () => {
  const [value, setValue] = useState<string>();
  return (
    <>
      <Search
        label='Kontroller meg!'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
      />

      <Divider />

      <Paragraph>Du har skrevet inn: {value}</Paragraph>
      <Button onClick={() => setValue('Pizza')}>Jeg vil ha Pizza</Button>
    </>
  );
};

export const OnlyIcon: StoryFn<typeof Search> = () => {
  return (
    <Search
      label='Search for content'
      clearButtonLabel='Empty'
      searchButtonLabel={
        <MagnifyingGlassIcon fontSize={'1.5em'} title='Search' />
      }
      variant='primary'
    />
  );
};

export const Form: StoryFn<typeof Search> = () => {
  const [value, setValue] = useState<string>();
  const [submittedValue, setSubmittedValue] = useState<string>();

  return (
    <>
      <Heading
        level={3}
        size='2xs'
        style={{ marginBottom: 'var(--ds-spacing-2)' }}
      >
        Submitted value: {submittedValue}
      </Heading>
      <form
        onSubmit={(e) => {
          // Prevent navigation from Storybook
          e.preventDefault();
          setSubmittedValue(value);
        }}
      >
        <Search
          label='Search for content'
          clearButtonLabel='Empty'
          onChange={(e) => setValue(e.target.value)}
          searchButtonLabel={
            <MagnifyingGlassIcon fontSize={'1.5em'} title='Search' />
          }
          variant='primary'
        />
      </form>
    </>
  );
};
