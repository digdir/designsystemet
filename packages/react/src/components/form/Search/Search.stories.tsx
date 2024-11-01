import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button, Divider, Field, Label, Paragraph } from '../..';

import { Search } from '.';

type Story = StoryObj<typeof Search>;

export default {
  title: 'Komponenter/Search',
  component: Search,
} as Meta;

export const Preview: Story = {
  args: {
    'aria-label': 'Label',
    disabled: false,
    'data-size': 'md',
    placeholder: '',
    variant: 'simple',
  },
};

export const FullWidth: Story = {
  args: {
    'aria-label': 'Label',
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
        aria-label='Kontroller meg!'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Divider style={{ marginTop: 'var(--ds-spacing-4)' }} />

      <Paragraph style={{ margin: 'var(--ds-spacing-2) 0' }}>
        Du har skrevet inn: {value}
      </Paragraph>
      <Button onClick={() => setValue('Pizza')}>Jeg vil ha Pizza</Button>
    </>
  );
};

export const OnlyIcon: StoryFn<typeof Search> = () => {
  return (
    <Search
      aria-label='Search for content'
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
      <form
        onSubmit={(e) => {
          // Prevent navigation from Storybook
          e.preventDefault();
          setSubmittedValue(value);
        }}
      >
        <Search
          aria-label='Search for content'
          clearButtonLabel='Empty'
          onChange={(e) => setValue(e.target.value)}
          searchButtonLabel={
            <MagnifyingGlassIcon fontSize={'1.5em'} title='Search' />
          }
          variant='primary'
        />
      </form>
      <Paragraph data-size='md' style={{ marginTop: 'var(--ds-spacing-2)' }}>
        Submitted value: {submittedValue}
      </Paragraph>
    </>
  );
};

export const WithLabel: StoryFn<typeof Search> = (args) => {
  return (
    <Field>
      <Label htmlFor='search' id='search-label'>
        Search
      </Label>
      <Search
        {...args}
        id='search'
        name='search'
        aria-labelledby='search-label'
        aria-label={undefined}
      />
    </Field>
  );
};
