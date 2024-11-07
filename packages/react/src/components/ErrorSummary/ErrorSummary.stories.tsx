import type { Meta, StoryFn } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { Button } from '../Button';
import { Textfield } from '../form/Textfield';

import { ErrorSummary } from './';

type Story = StoryFn<typeof ErrorSummary>;

export default {
  title: 'Komponenter/ErrorSummary',
  component: ErrorSummary,
} as Meta;

export const Preview: Story = (args) => (
  <ErrorSummary {...args}>
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
  </ErrorSummary>
);
Preview.args = {
  'data-size': 'md',
};

export const WithForm: Story = () => (
  <>
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

    <ErrorSummary>
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
    </ErrorSummary>
  </>
);

WithForm.parameters = {
  customStyles: { display: 'grid', gap: 'var(--ds-spacing-4)' },
};

export const ShowHide: Story = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          marginBottom: 'var(--ds-spacing-4)',
        }}
      >
        <Button onClick={() => setShow(!show)}>{show ? 'Skjul' : 'Vis'}</Button>
      </div>
      {show && (
        <ErrorSummary>
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
        </ErrorSummary>
      )}
    </>
  );
};
ShowHide.play = async (ctx) => {
  const canvas = within(ctx.canvasElement);
  const button = canvas.getByRole('button');
  await userEvent.click(button);
  const errorSummary = canvas.getByRole('alert');
  await expect(errorSummary).toBeVisible();
};
