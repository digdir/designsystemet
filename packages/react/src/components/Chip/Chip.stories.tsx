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

export const Preview: StoryObj<typeof Chip.Button> = {
  args: {
    disabled: false,
    children: 'Nynorsk',
    size: 'md',
  },
};

export const Removable: StoryFn<typeof Chip.Removable> = (args) => (
  <Chip.Removable {...args}>Nynorsk</Chip.Removable>
);

Removable.args = {
  'aria-label': 'Slett Nynorsk',
};

export const Checkbox: StoryFn<typeof Chip.Checkbox> = (args) => (
  <Chip.Checkbox {...args}>Nynorsk</Chip.Checkbox>
);

export const Radio: StoryFn<typeof Chip.Radio> = (args) => (
  <>
    <Chip.Radio {...args} name='my-radio' value='nynorsk' defaultChecked>
      Nynorsk
    </Chip.Radio>
    <Chip.Radio {...args} name='my-radio' value='bokmål'>
      Bokmål
    </Chip.Radio>
  </>
);
