import type { Meta, StoryFn } from '@storybook/react';

import { Checkbox, Fieldset, Radio } from '../..';

type Story = StoryFn<typeof Fieldset>;

export default {
  title: 'Komponenter/Fieldset',
  component: Fieldset,
} as Meta;

export const Preview: Story = (args) => (
  <form>
    <Fieldset {...args}>
      <Fieldset.Legend>Hvilken fjordarm bor du ved?</Fieldset.Legend>
      <Fieldset.Description>
        Valget vil hjelpe oss å forbedre innholdet vi viser deg.
      </Fieldset.Description>
      <Radio label='Barsnesfjorden' />
      <Radio label='Eidsfjorden' />
      <Radio label='Ingen av de' />
    </Fieldset>
  </form>
);

export const WithCheckbox: Story = (args) => (
  <Fieldset {...args}>
    <Fieldset.Legend>Godtar du vilkårene?</Fieldset.Legend>
    <Checkbox label='Ja, jeg godtar' />
  </Fieldset>
);

export const LegendAsHeading: Story = (args) => (
  <Fieldset {...args}>
    <Fieldset.Legend>
      <h1>Hvor skal du reise?</h1>
    </Fieldset.Legend>
  </Fieldset>
);
