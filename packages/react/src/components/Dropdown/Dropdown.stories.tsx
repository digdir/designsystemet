import type { StoryFn, Meta } from '@storybook/react';
import React, { useRef } from 'react';

import { Button } from '../..';

import { Dropdown } from '.';
import { ChevronRightIcon } from '@navikt/aksel-icons';

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '20rem', marginTop: '0' }}>
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

  const subButtonRef = useRef<HTMLButtonElement | null>(null);
  const [subOpen, setSubOpen] = React.useState(false);

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
        onClose={() => {
          setOpen(false);
          setSubOpen(false);
        }}
      >
        <Dropdown.List>
          <Dropdown.Header>Links</Dropdown.Header>
          <Dropdown.Item
            as='a'
            href='https://github.com/digdir/designsystem'
            target='_black'
          >
            Github
          </Dropdown.Item>
          <Dropdown.Item
            as='a'
            href='https://designsystemet.no'
            target='_blank'
          >
            This is a link!
          </Dropdown.Item>
        </Dropdown.List>
        <Dropdown.Divider />
        <Dropdown.List>
          <Dropdown.Item
            ref={subButtonRef}
            icon={<ChevronRightIcon />}
            iconPlacement='right'
            onClick={() => setSubOpen(!subOpen)}
          >
            Open another
          </Dropdown.Item>
          <Dropdown
            anchorEl={subButtonRef.current}
            open={open && subOpen}
            placement='right'
          >
            <Dropdown.List>
              <Dropdown.Item>Sub button 1</Dropdown.Item>
              <Dropdown.Item>Sub button 2</Dropdown.Item>
              <Dropdown.Item>Sub button 3</Dropdown.Item>
            </Dropdown.List>
          </Dropdown>
          <Dropdown.Item>Button 3</Dropdown.Item>
          <Dropdown.Item>Button 4</Dropdown.Item>
        </Dropdown.List>
      </Dropdown>
    </>
  );
};
