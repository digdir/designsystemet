import type { Meta, StoryObj } from '@storybook/react';

import { Ingress } from './';

const meta: Meta<typeof Ingress> = {
  title: 'Komponenter/Typography/Ingress',
  component: Ingress,
};

export default meta;

type Story = StoryObj<typeof Ingress>;

export const Preview: Story = {
  args: {
    children:
      'Her kan du registrere nye virksomheter, som for eksempel enkeltpersonforetak, foreninger, aksjeselskap, ansvarlige selskap, samvirkeforetak og stiftelser. De aller fleste organisasjonsformene kan bruke denne tjenesten.',
    spacing: false,
    size: 'md',
  },
};
