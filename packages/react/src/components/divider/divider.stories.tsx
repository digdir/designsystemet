import preview from '../../../../../apps/storybook/.storybook/preview';
import { Paragraph } from '../paragraph/paragraph';
import { Divider } from './divider';

const meta = preview.meta({
  title: 'Komponenter/Divider',
  component: Divider,
});

export const Preview = meta.story({
  render: (args) => (
    <>
      <Paragraph>
        Divider er brukt for å dele opp innhold i mindre deler.
      </Paragraph>
      <Divider {...args} />
      <Paragraph>
        Den kan også brukes for å skille innhold som er relatert til hverandre.
      </Paragraph>
    </>
  ),
});
