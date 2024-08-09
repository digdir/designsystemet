import type { Meta, StoryFn } from '@storybook/react';

import { CogIcon } from '@navikt/aksel-icons';
import { Badge } from './Badge';

type Story = StoryFn<typeof Badge>;

const meta: Meta<typeof Badge> = {
  title: 'Komponenter/Badge',
  component: Badge,
};

export default meta;

export const Preview: Story = (args) => <Badge {...args}></Badge>;

Preview.args = {
  size: 'md',
  /* children: <CogIcon fontSize='2rem' />, */
  count: 10,
  maxCount: 9,
};
