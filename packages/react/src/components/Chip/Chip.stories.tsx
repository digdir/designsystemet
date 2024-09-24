import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Chip } from '.';

export default {
  title: 'Komponenter/Chip',
  component: Chip.Button,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: 'var(--ds-spacing-2)' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

export const Preview: StoryFn<typeof Chip.Radio> = (args) => (
  <>
    <Chip.Radio {...args} name='my-radio' value='nynorsk' defaultChecked>
      Nynorsk
    </Chip.Radio>
    <Chip.Radio {...args} name='my-radio' value='bokmål'>
      Bokmål
    </Chip.Radio>
  </>
);

export const Checkbox: StoryFn<typeof Chip.Checkbox> = (args) => (
  <Chip.Checkbox {...args}>Nynorsk</Chip.Checkbox>
);

export const Removable: StoryFn<typeof Chip.Removable> = (args) => (
  <Chip.Removable {...args}>Norge</Chip.Removable>
);

Removable.args = {
  'aria-label': 'Slett Norge',
};

export const Button: StoryFn<typeof Chip.Button> = (args) => (
  <>
    <Chip.Button {...args}>Søk etter nynorsk</Chip.Button>
    <Chip.Button {...args}>Søk etter bokmål</Chip.Button>
    <Chip.Button {...args}>Søk etter engelsk</Chip.Button>
  </>
);
