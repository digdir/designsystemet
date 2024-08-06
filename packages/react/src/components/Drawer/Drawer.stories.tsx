import { useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';
import { Textfield } from '../form/Textfield';
import { Paragraph } from '../Typography';
import { Divider } from '../Divider';
import { Combobox } from '..';

import { Drawer, type DrawerRef } from './Drawer';

export default {
  title: 'Komponenter/Drawer',
  component: Drawer,
} as Meta;

export const Preview: StoryFn<typeof Drawer> = (args) => {
  const drawerRef = useRef<DrawerRef>(null);

  return (
    <>
      <Button onClick={() => drawerRef.current?.open()}>Open Drawer</Button>
      <Drawer
        ref={drawerRef}
        {...args}
      >
        <h2>Drawer Content</h2>
        <Paragraph>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis
          doloremque obcaecati assumenda odio ducimus sunt et.
        </Paragraph>
      </Drawer>
    </>
  );
};

export const WithBuiltInTrigger: StoryFn<typeof Drawer> = (args) => {
  return (
    <Drawer
      trigger={<Button>Open Drawer</Button>}
      {...args}
    >
      <h2>Drawer with Built-in Trigger</h2>
      <Paragraph>This drawer uses the built-in trigger prop.</Paragraph>
    </Drawer>
  );
};

export const DifferentPositions: StoryFn<typeof Drawer> = () => {
  const drawerRef = useRef<DrawerRef>(null);
  const [position, setPosition] = useState<'left' | 'right' | 'top' | 'bottom'>(
    'right',
  );

  return (
    <>
      <Button onClick={() => drawerRef.current?.open()}>Open Drawer</Button>
      <select
        onChange={(e) => setPosition(e.target.value as typeof position)}
        value={position}
        style={{ marginLeft: '10px' }}
      >
        <option value='left'>Left</option>
        <option value='right'>Right</option>
        <option value='top'>Top</option>
        <option value='bottom'>Bottom</option>
      </select>
      <Drawer
        ref={drawerRef}
        position={position}
      >
        <h2>Drawer from {position}</h2>
        <Paragraph>This drawer opens from the {position}.</Paragraph>
      </Drawer>
    </>
  );
};

export const DrawerWithForm: StoryFn<typeof Drawer> = () => {
  const drawerRef = useRef<DrawerRef>(null);
  const [input, setInput] = useState('');

  return (
    <>
      <Button onClick={() => drawerRef.current?.open()}>
        Open Drawer with Form
      </Button>
      <Drawer ref={drawerRef}>
        <h2>Drawer with Form</h2>
        <Textfield
          label='Name'
          placeholder='John Doe'
          value={input}
          autoFocus
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          onClick={() => {
            window.alert(`You submitted the form with name: ${input}`);
            setInput('');
            drawerRef.current?.close();
          }}
        >
          Submit Form
        </Button>
      </Drawer>
    </>
  );
};

export const DrawerWithDivider: StoryFn<typeof Drawer> = () => (
  <Drawer trigger={<Button>Open Drawer with Divider</Button>}>
    <h2>Drawer with Divider</h2>
    <Divider color='subtle' />
    <Paragraph>Content between dividers</Paragraph>
    <Divider color='subtle' />
  </Drawer>
);

export const DrawerWithSelect: StoryFn<typeof Drawer> = () => {
  const drawerRef = useRef<DrawerRef>(null);

  return (
    <>
      <Button onClick={() => drawerRef.current?.open()}>
        Open Drawer with Select
      </Button>
      <Drawer
        ref={drawerRef}
        style={{ overflow: 'visible' }}
      >
        <h2>Drawer with Select</h2>
        <Combobox portal={false}>
          <Combobox.Empty>No results found</Combobox.Empty>
          <Combobox.Option value='oslo'>Oslo</Combobox.Option>
          <Combobox.Option value='bergen'>Bergen</Combobox.Option>
          <Combobox.Option value='trondheim'>Trondheim</Combobox.Option>
          <Combobox.Option value='stavanger'>Stavanger</Combobox.Option>
        </Combobox>
      </Drawer>
    </>
  );
};
