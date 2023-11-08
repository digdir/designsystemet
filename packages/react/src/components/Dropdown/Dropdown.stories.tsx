import type { StoryFn, Meta } from '@storybook/react';
import React, { useRef } from 'react';

import { Button } from '../..';

import { Dropdown } from '.';

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '10rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Felles/Dropdown',
  component: Dropdown,
  decorators,
} as Meta;

export const Preview: StoryFn<typeof Dropdown> = (args) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
      >
        Dropdown
      </Button>
      <Dropdown
        {...args}
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Dropdown.Header>Header</Dropdown.Header>
        <Dropdown.Divider />
        <Dropdown.List>
          <Dropdown.Item>Item 1</Dropdown.Item>
          <Dropdown.Item>Item 2</Dropdown.Item>
          <Dropdown.Item>Item 3</Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </>
  );
};
