import { useState } from 'react';
import preview from '../../../../../../../apps/storybook/.storybook/preview';

import { Paragraph, Textfield } from '../../../../components';

import { useDebounceCallback } from './use-debounce-callback';

const meta = preview.meta({
  title: 'Utilities/useDebounceCallback',
  parameters: { chromatic: { disableSnapshot: true } },
});

export const Default = meta.story(() => {
  const [value, setValue] = useState('');
  const debouncedCallback = useDebounceCallback((value: string) => {
    setValue(value);
  }, 1000);

  return (
    <>
      <Textfield
        onChange={(e) => debouncedCallback(e.target.value)}
        placeholder='Type something...'
        aria-label='Type something'
      />
      <Paragraph>Debounced value: {value}</Paragraph>
    </>
  );
});
