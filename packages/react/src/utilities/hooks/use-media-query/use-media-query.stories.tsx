import type { Meta } from '@storybook/react-vite';

import { Paragraph } from '../../../components';

import { useMediaQuery } from './use-media-query';

const meta: Meta = {
  title: 'Utilities/useMediaQuery',
  parameters: { chromatic: { disableSnapshot: true } },
};

export default meta;

export const TestMediaQuery = () => {
  const isBelow = useMediaQuery('(max-width: 1000px)');

  return (
    <div>
      <Paragraph>
        Er skjermen mindre enn 1000px? {isBelow ? 'Ja' : 'Nei'}
      </Paragraph>
    </div>
  );
};
