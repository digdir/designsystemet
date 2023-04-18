import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from '../Spinner';

import type { ButtonProps } from './';
import { Button } from './';

type Story = StoryObj<typeof Button>;

const meta: Meta<typeof Button> = {
  title: 'Kjernekomponenter/Button',
  component: Button,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
};

export default meta;

const icon = (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm5.047 5.671 1.399 1.43-8.728 8.398L6 14.02l1.395-1.434 2.319 2.118 7.333-7.032Z'
      fill='currentColor'
    />
  </svg>
);

const LoadingTemplate = (args: ButtonProps) => {
  return (
    <Button {...args}>
      <Spinner
        size={args.size}
        variant='interaction'
        title='loading'
      />
      Laster...
    </Button>
  );
};

export const props: Story = {
  args: {
    children: 'Knapp',
  },
};

export const filled: Story = {
  name: 'Fylt med tekst',
  args: {
    children: 'Fylt',
    variant: 'filled',
  },
};

export const outline: Story = {
  name: 'Omriss med tekst',
  args: {
    children: 'Omriss',
    variant: 'outline',
  },
};

export const quiet: Story = {
  name: 'Gjennomsiktig med tekst',
  args: {
    children: 'Gjennomsiktig',
    variant: 'quiet',
  },
};

export const FyltMedIkon: Story = {
  name: 'Fylt med ikon',
  args: {
    icon,
    variant: 'filled',
  },
};

export const OmrissMedIkon: Story = {
  name: 'Omriss med ikon',
  args: {
    icon,
    variant: 'outline',
  },
};

export const GjennomsiktigMedIkon: Story = {
  name: 'Gjennomsiktig med ikon',

  args: {
    icon,
    variant: 'quiet',
  },
};

export const FyltMedTekstOgIkon: Story = {
  name: 'Fylt med tekst og ikon',

  args: {
    children: 'Fylt',
    icon,
    variant: 'filled',
  },
};

export const OmrissMedTekstOgIkon: Story = {
  name: 'Omriss med tekst og ikon',

  args: {
    children: 'Med omriss',
    icon,
    variant: 'outline',
  },
};

export const GjennomsiktigMedTekstOgIkon: Story = {
  name: 'Gjennomsiktig med tekst og ikon',

  args: {
    children: 'Gjennomsiktig',
    icon,
    variant: 'quiet',
  },
};

export const FyltMedTekstOgSpinner: Story = {
  render: LoadingTemplate,
  name: 'Fylt med tekst og spinner',

  args: {
    variant: 'filled',
    'aria-disabled': true,
  },
};

export const OmrissMedTekstOgSpinner: Story = {
  render: LoadingTemplate,
  name: 'Omriss med tekst og spinner',

  args: {
    children: 'Med omriss',
    icon,
    variant: 'outline',
    'aria-disabled': true,
  },
};

export const GjennomsiktigMedTekstOgSpinner: Story = {
  render: LoadingTemplate,
  name: 'Gjennomsiktig med tekst og spinner',

  args: {
    children: 'Gjennomsiktig',
    icon,
    variant: 'quiet',
    'aria-disabled': true,
  },
};
