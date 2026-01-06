import type { Meta, StoryFn } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Card } from './';
import * as CardStories from './card.stories';

const meta: Meta = {
  title: 'Chromatic/Card',
  component: Card,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryFn<typeof Card>;

/* Visual-only Chromatic story.
  Verifies rendering of nested card with link for visual
  regression snapshots. This story is intentionally kept out of the main
  `card.stories`
*/
export const Cardception: Story = () => (
  <Card>
    <Card>
      <Card>
        <h2>
          <a href="#">Nested Card Link</a>
        </h2>
      </Card>
    </Card>
    </Card>
);


export const Snapshots = createSingleStory(
  { ...CardStories, Cardception },
  meta
);
