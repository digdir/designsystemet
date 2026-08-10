import preview from '../../../../../../../apps/storybook/.storybook/preview';

import { Paragraph } from '../../../../components';

import { useMediaQuery } from './use-media-query';

const meta = preview.meta({
  title: 'Utilities/useMediaQuery',
  parameters: { chromatic: { disableSnapshot: true } },
});

export const TestMediaQuery = meta.story(() => {
  const isBelow = useMediaQuery('(max-width: 1000px)');

  return (
    <div>
      <Paragraph>
        Er skjermen mindre enn 1000px? {isBelow ? 'Ja' : 'Nei'}
      </Paragraph>
    </div>
  );
});
