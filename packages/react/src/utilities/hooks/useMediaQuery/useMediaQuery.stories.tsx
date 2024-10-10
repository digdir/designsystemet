import type { Meta } from '@storybook/react';

import { Paragraph } from '../../../components';

import { useMediaQuery } from './useMediaQuery';

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
