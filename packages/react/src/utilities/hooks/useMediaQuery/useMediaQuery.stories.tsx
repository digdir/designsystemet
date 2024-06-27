import type { Meta } from '@storybook/react';

import { useMediaQuery } from './useMediaQuery';

const meta: Meta = {
  title: 'Utilities/useMediaQuery',
};

export default meta;

export const TestMediaQuery = () => {
  const isBelow = useMediaQuery('(max-width: 1000px)');

  return (
    <div>
      <div>Er skjermen mindre enn 1000px? {isBelow ? 'Ja' : 'Nei'}</div>
    </div>
  );
};
