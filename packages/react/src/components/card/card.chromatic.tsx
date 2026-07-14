import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Card } from './';
import * as CardStories from './card.stories';

const meta = preview.meta({
  title: 'Chromatic/Card',
  component: Card,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

/* Visual-only Chromatic story.
  Verifies rendering of nested card with link for visual
  regression snapshots. This story is intentionally kept out of the main
  `card.stories`
*/
export const Cardception = meta.story({
  render: () => (
    <Card>
      <Card>
        <h2>
          <a href='#'>Nested Card Link</a>
        </h2>
      </Card>
    </Card>
  ),
});

export const Snapshots = meta.story(
  createSingleStory({ ...CardStories, Cardception }),
);
