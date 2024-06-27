import type { Meta } from '@storybook/react';
import { useState } from 'react';

import { Paragraph, Textfield } from '../../../components';

import { useDebounceCallback } from './useDebounceCallback';

const meta: Meta = {
  title: 'Utilities/useDebounceCallback',
};

export default meta;

export const Default = () => {
  const [value, setValue] = useState('');
  const debouncedCallback = useDebounceCallback((value: string) => {
    setValue(value);
  }, 1000);

  return (
    <>
      <Textfield
        onChange={(e) => debouncedCallback(e.target.value)}
        placeholder='Type something...'
      />
      <Paragraph>Debounced value: {value}</Paragraph>
    </>
  );
};
