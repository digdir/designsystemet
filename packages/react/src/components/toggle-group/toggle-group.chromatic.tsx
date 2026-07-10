import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { ToggleGroup } from './';
import * as ToggleGroupStories from './toggle-group.stories';

const meta = preview.meta({
  title: 'Chromatic/ToggleGroup',
  component: ToggleGroup,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      /* 80vw since storybook has padding, and does not stop elements from overflowing the x-axis */
      <div style={{ maxWidth: '80vw' }}>
        <Story />
      </div>
    ),
  ],
});

export const Snapshots = meta.story(createSingleStory(ToggleGroupStories));
