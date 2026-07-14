import preview from '../../../../../apps/storybook/.storybook/preview';

import { Checkbox, Fieldset, Radio } from '../';

const meta = preview.meta({
  title: 'Komponenter/Fieldset',
  component: Fieldset,
});

export const Preview = meta.story({
  render: (args) => (
    <Fieldset {...args}>
      <Fieldset.Legend>Hvilken fjordarm bor du ved?</Fieldset.Legend>
      <Fieldset.Description>
        Valget vil hjelpe oss å forbedre innholdet vi viser deg.
      </Fieldset.Description>
      <Radio label='Barsnesfjorden' name='radio' value='barsnesfjorden' />
      <Radio label='Eidsfjorden' name='radio' value='eidsfjorden' />
      <Radio label='Ingen av de' name='radio' value='ingen-av-de' />
    </Fieldset>
  ),
});

export const WithCheckbox = meta.story({
  render: (args) => (
    <Fieldset {...args}>
      <Fieldset.Legend>Godtar du vilkårene?</Fieldset.Legend>
      <Checkbox label='Ja, jeg godtar' />
    </Fieldset>
  ),
});

export const LegendAsHeading = meta.story({
  render: (args) => (
    <Fieldset {...args}>
      <Fieldset.Legend>
        <h1>Hvor skal du reise?</h1>
      </Fieldset.Legend>
    </Fieldset>
  ),
});
