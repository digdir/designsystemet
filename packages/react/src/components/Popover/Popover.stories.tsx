import type { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';

import { Button } from '../..';

import { Popover } from '.';

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '4rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Felles/Popover',
  component: Popover,
  decorators,
} as Meta;

export const Preview: StoryFn<typeof Popover> = () => {
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

  console.log('buttonRef', buttonRef);

  return (
    <>
      <Button ref={(ref) => setButtonRef(ref)}>My trigger</Button>
      <Popover
        anchorEl={buttonRef}
        open
      >
        <Popover.Content>popover content</Popover.Content>
      </Popover>
    </>
  );
};
