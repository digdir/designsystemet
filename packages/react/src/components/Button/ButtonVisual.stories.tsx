import type { Meta } from '@storybook/react';
import { createSingleStory } from '../../utilities/createSingleStory';
import { Button } from './Button';
import * as ButtonStories from './Button.stories';

const meta: Meta = {
  title: 'Komponenter/Button/Visual tests',
  component: Button,
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(ButtonStories, meta);
