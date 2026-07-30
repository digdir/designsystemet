import type { DSErrorSummaryElement } from '@digdir/designsystemet-web';
import { useEffect, useRef, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { Button, Textfield } from '../';
import { ErrorSummary } from './';

const meta = preview.meta({
  title: 'Komponenter/ErrorSummary',
  component: ErrorSummary,
});

export const Preview = meta.story({
  render: (args) => (
    <ErrorSummary {...args}>
      <ErrorSummary.Heading>
        For å gå videre må du rette opp følgende feil:
      </ErrorSummary.Heading>
      <ErrorSummary.List>
        <ErrorSummary.Item>
          <ErrorSummary.Link href='#'>
            Fødselsdato kan ikke være etter år 2005
          </ErrorSummary.Link>
        </ErrorSummary.Item>
        <ErrorSummary.Item>
          <ErrorSummary.Link href='#'>
            Telefonnummer kan kun inneholde siffer
          </ErrorSummary.Link>
        </ErrorSummary.Item>
        <ErrorSummary.Item>
          <ErrorSummary.Link href='#'>E-post må være gyldig</ErrorSummary.Link>
        </ErrorSummary.Item>
      </ErrorSummary.List>
    </ErrorSummary>
  ),
});

export const WithForm = meta.story({
  render: () => (
    <>
      <Textfield
        label='Fornavn'
        id='fornavn'
        error='Fornavn må være minst 2 tegn'
      />

      <Textfield
        label='Telefon'
        id='telefon'
        type='tel'
        error='Telefonnummer kan kun inneholde siffer'
      />

      <ErrorSummary>
        <ErrorSummary.Heading>
          For å gå videre må du rette opp følgende feil:
        </ErrorSummary.Heading>
        <ErrorSummary.List>
          <ErrorSummary.Item>
            <ErrorSummary.Link href='#fornavn'>
              Fornavn må være minst 2 tegn
            </ErrorSummary.Link>
          </ErrorSummary.Item>
          <ErrorSummary.Item>
            <ErrorSummary.Link href='#telefon'>
              Telefonnummer kan kun inneholde siffer
            </ErrorSummary.Link>
          </ErrorSummary.Item>
        </ErrorSummary.List>
      </ErrorSummary>
    </>
  ),

  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          alignItems: 'stretch',
          gap: 'var(--ds-size-4)',
        }}
      >
        <Story />
      </div>
    ),
  ],
});

export const ShowHideReact = meta.story({
  render: () => {
    const [show, setShow] = useState(false);
    const summaryRef = useRef<DSErrorSummaryElement>(null);
    useEffect(() => {
      if (show) {
        summaryRef.current?.focus();
      }
    }, [show]);

    return (
      <>
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            marginBottom: 'var(--ds-size-4)',
          }}
        >
          <Button onClick={() => setShow(!show)}>
            {show ? 'Skjul' : 'Send inn skjema'}
          </Button>
        </div>
        {show && (
          <ErrorSummary data-testid='show-hide' ref={summaryRef}>
            <ErrorSummary.Heading>
              For å gå videre må du rette opp følgende feil:
            </ErrorSummary.Heading>
            <ErrorSummary.List>
              <ErrorSummary.Item>
                <ErrorSummary.Link href='#fornavn'>
                  Fornavn må være minst 2 tegn
                </ErrorSummary.Link>
              </ErrorSummary.Item>
              <ErrorSummary.Item>
                <ErrorSummary.Link href='#telefon'>
                  Telefonnummer kan kun inneholde siffer
                </ErrorSummary.Link>
              </ErrorSummary.Item>
            </ErrorSummary.List>
          </ErrorSummary>
        )}
      </>
    );
  },

  play: async (ctx) => {
    const canvas = within(ctx.canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    const errorSummary = canvas.getByTestId('show-hide');
    await expect(errorSummary).toBeVisible();
  },

  parameters: {
    docs: { source: { type: 'code' } },
  },
});
