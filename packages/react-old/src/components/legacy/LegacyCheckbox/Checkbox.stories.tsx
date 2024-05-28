import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { LegacyCheckbox } from './Checkbox';

type Story = StoryObj<typeof LegacyCheckbox>;

export default {
  title: 'Avviklet/LegacyCheckbox',
  component: LegacyCheckbox,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Dette er en checkbox',
    helpText:
      'Checkbox er en boks som brukeren kan krysse av i for bolske verdier',
    checkboxId: 'checkbox-id',
    checked: false,
    compact: false,
    description: 'Dette er en beskrivelse',
    disabled: false,
    error: false,
    hideLabel: false,
    name: 'checkbox-name',
    presentation: false,
    readOnly: false,
  },
};

export const Normal: StoryFn<typeof LegacyCheckbox> = (args) => (
  <LegacyCheckbox {...args} />
);

Normal.args = {
  label: 'Normal',
};

export const Avkrysset: StoryFn<typeof LegacyCheckbox> = (args) => (
  <LegacyCheckbox {...args} />
);

Avkrysset.args = {
  checked: true,
  label: 'Avkrysset',
};

export const MedHjelpetekst: StoryFn<typeof LegacyCheckbox> = (args) => (
  <LegacyCheckbox {...args} />
);

MedHjelpetekst.args = {
  helpText: 'Hjelp',
  label: 'Med hjelpetekst',
};

export const Feil: StoryFn<typeof LegacyCheckbox> = (args) => (
  <LegacyCheckbox {...args} />
);

Feil.args = {
  checked: false,
  error: true,
  label: 'Normal',
};

export const Kompakt: StoryFn<typeof LegacyCheckbox> = (args) => (
  <LegacyCheckbox {...args} />
);

Kompakt.args = {
  compact: true,
  label: 'Kompakt',
};

export const Deaktivert: StoryFn<typeof LegacyCheckbox> = (args) => (
  <LegacyCheckbox {...args} />
);

Deaktivert.args = {
  disabled: true,
  label: 'Deaktivert',
};

export const MedBeskrivelse: StoryFn<typeof LegacyCheckbox> = (args) => (
  <LegacyCheckbox {...args} />
);

MedBeskrivelse.args = {
  description: 'Med beskrivelse',
  label: 'Tekst',
};

export const MedLangTekst: StoryFn<typeof LegacyCheckbox> = (args) => (
  <LegacyCheckbox {...args} />
);

MedLangTekst.args = {
  label:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lectus dolor, consectetur nec finibus quis, varius et risus. Nullam sodales enim viverra metus finibus, id pellentesque erat sagittis. Curabitur mattis eleifend nunc, eget fringilla odio viverra et. Nullam pretium vel tortor quis varius. Sed dui justo, placerat eu lorem vestibulum, condimentum fringilla ante. Curabitur egestas, ante a pharetra rhoncus, velit lorem luctus lectus, sit amet finibus est sem a ante. Mauris tristique aliquam libero ut commodo. Mauris vel justo et nulla rutrum commodo eu sit amet est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hac habitasse platea dictumst. Sed aliquet egestas augue in placerat. Quisque malesuada elementum dolor, in ultricies est sodales varius.',
};

export const MedSkjultTekst: StoryFn<typeof LegacyCheckbox> = (args) => (
  <LegacyCheckbox {...args} />
);

MedSkjultTekst.args = {
  hideLabel: true,
  label: 'Skjult tekst',
};
