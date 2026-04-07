import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fieldset } from '../fieldset';

import { Switch } from './switch';

type Story = StoryObj<typeof Switch>;

export default {
  title: 'Komponenter/Switch',
  component: Switch,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Switch',
    description: '',
    disabled: false,
    readOnly: false,
    position: 'start',
  },
};

export const Checked: Story = {
  ...Preview,
  args: { ...Preview.args, checked: true },
};

export const Group: Story = {
  render: ({ 'aria-label': a, 'aria-labelledby': b, ...args }) => (
    <Fieldset>
      <Fieldset.Legend>Skru av/på lys</Fieldset.Legend>
      <Switch label='Stue' checked {...args} />
      <Switch label='Kjøkken' {...args} />
      <Switch label='Bad' {...args} />
      <Switch
        label='Soverom'
        description='Får ikke kontakt med lyspærene'
        readOnly
        {...args}
      />
    </Fieldset>
  ),
};

export const RigthAligned: Story = {
  render: ({ 'aria-label': a, 'aria-labelledby': b, ...args }) => (
    <Switch label='Flymodus' position='end' checked {...args} />
  ),
};

export const Secondary: Story = {
  render: () => (
    <>
      <Fieldset>
        <Fieldset.Legend>Using data-variant="secondary</Fieldset.Legend>
        <Switch
          data-variant='secondary'
          label='with description'
          description='description text'
          value='description'
        />
        <Switch
          data-variant='secondary'
          label='Checked'
          value='checked'
          checked
        />
        <Switch
          data-variant='secondary'
          disabled
          label='disabled'
          value='disabled'
        />
        <Switch
          data-variant='secondary'
          readOnly
          label='readonly checked'
          value='readonly'
          checked
        />
      </Fieldset>
    </>
  ),
};
