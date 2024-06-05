import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Textfield } from '../form/Textfield';
import { Button } from '../Button';

import { ErrorSummary } from './';

type Story = StoryFn<typeof ErrorSummary.Root>;

export default {
  title: 'Komponenter/ErrorSummary',
  component: ErrorSummary.Root,
} as Meta;

export const Preview: Story = (args) => (
  <>
    <ErrorSummary.Root {...args}>
      <ErrorSummary.Heading>
        For å gå videre må du rette opp følgende feil:
      </ErrorSummary.Heading>
      <ErrorSummary.List>
        <ErrorSummary.Item href='#'>
          Fødselsdato kan ikke være etter år 2005
        </ErrorSummary.Item>
        <ErrorSummary.Item href='#'>
          Telefonnummer kan kun inneholde siffer
        </ErrorSummary.Item>
        <ErrorSummary.Item href='#'>E-post må være gyldig</ErrorSummary.Item>
      </ErrorSummary.List>
    </ErrorSummary.Root>
  </>
);
Preview.args = {
  size: 'md',
};

export const WithForm: Story = () => (
  <div
    style={{
      display: 'grid',
      gap: 'var(--ds-spacing-4)',
    }}
  >
    <Textfield
      label='Fornavn'
      id='fornavn'
      error='Fornavn må være minst 2 tegn'
    />

    <Textfield
      label='Telefon'
      id='telefon'
      error='Telefonnummer kan kun inneholde siffer'
    />

    <ErrorSummary.Root>
      <ErrorSummary.Heading>
        For å gå videre må du rette opp følgende feil:
      </ErrorSummary.Heading>
      <ErrorSummary.List>
        <ErrorSummary.Item href='#fornavn'>
          Fornavn må være minst 2 tegn
        </ErrorSummary.Item>
        <ErrorSummary.Item href='#telefon'>
          Telefonnummer kan kun inneholde siffer
        </ErrorSummary.Item>
      </ErrorSummary.List>
    </ErrorSummary.Root>
  </div>
);

export const ShowHide: Story = () => {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <Button onClick={() => setShow(!show)}>{show ? 'Skjul' : 'Vis'}</Button>
      {show && (
        <ErrorSummary.Root>
          <ErrorSummary.Heading>
            For å gå videre må du rette opp følgende feil:
          </ErrorSummary.Heading>
          <ErrorSummary.List>
            <ErrorSummary.Item href='#fornavn'>
              Fornavn må være minst 2 tegn
            </ErrorSummary.Item>
            <ErrorSummary.Item href='#telefon'>
              Telefonnummer kan kun inneholde siffer
            </ErrorSummary.Item>
          </ErrorSummary.List>
        </ErrorSummary.Root>
      )}
    </>
  );
};
