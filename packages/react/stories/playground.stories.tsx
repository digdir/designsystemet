import type { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';

import {
  Textfield,
  Switch,
  NativeSelect,
  Button,
  Checkbox,
  Radio,
} from '../src/components';

export default {
  title: 'Playground',
} as Meta;

export const Row: StoryFn = () => {
  const [value, setValue] = useState<string>();
  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 'var(--fds-spacing-2)',
          border: '1px solid red',
        }}
      >
        <Textfield
          hideLabel
          label='Kontroller meg!'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size='small'
        />
        <Switch size='small'>Switch</Switch>
        <NativeSelect size='small'>
          <option>opt1</option>
          <option>opt2</option>
          <option>opt3</option>
        </NativeSelect>
        <Button
          onClick={() => setValue('Kake')}
          size='small'
        >
          Jeg vil ha Kake
        </Button>
        <Radio
          value='radio'
          size='small'
        >
          Radio
        </Radio>
        <Checkbox
          value='checkbox'
          size='small'
        >
          Checkbox
        </Checkbox>
      </div>
    </>
  );
};
