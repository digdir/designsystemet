import { BriefcaseIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { cat1Img, cat3Img, cat4Img, cat5Img } from '../../../stories/constants';
import {
  Avatar,
  EXPERIMENTAL_AvatarStack as AvatarStack,
  Checkbox,
  Field,
  Label,
  Tooltip,
} from '../';

const meta = preview.meta({
  title: 'Komponenter/AvatarStack',
  component: AvatarStack,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    'aria-label': 'Test av aria label',
  },
  decorators: [
    (Story) => (
      <>
        <style>{`
          section { display: flex; flex-direction: row; gap: var(--ds-size-4); flex-wrap: wrap }
          fieldset { display: flex; gap: var(--ds-size-4); align-items: center }
          input[type="range"] { width: 100% }
          legend { font-size: 11px }
      `}</style>
        <Story />
      </>
    ),
  ],
});

export const Preview = meta.story({
  render: (args) => (
    <AvatarStack {...args}>
      <Avatar aria-label='Navn'>{cat1Img}</Avatar>
      <Avatar aria-label='Navn'>
        <BriefcaseIcon />
      </Avatar>
      <Avatar aria-label='Navn' initials='sm' />
      <Avatar aria-label='Navn'>md</Avatar>
      <Avatar aria-label='Navn' initials='ON' />
    </AvatarStack>
  ),
});

/* export const Expandable = meta.story({
  render: (args) => (
    <section>
      <fieldset>
        <legend>expandable</legend>
        <AvatarStack {...args} expandable>
          <Avatar aria-label='profile picture a'>{cat1Img}</Avatar>
          <Avatar aria-label='profile picture b'>{cat1Img}</Avatar>
          <Avatar aria-label='profile picture c'>{cat3Img}</Avatar>
          <Avatar aria-label='profile picture d'>{cat4Img}</Avatar>
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>expandable="fixed"</legend>
        <AvatarStack {...args} expandable='fixed'>
          <Avatar aria-label='profile picture a'>{cat1Img}</Avatar>
          <Avatar aria-label='profile picture b'>{cat1Img}</Avatar>
          <Avatar aria-label='profile picture c'>{cat3Img}</Avatar>
          <Avatar aria-label='profile picture d'>{cat4Img}</Avatar>
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>default</legend>
        <AvatarStack {...args}>
          <Avatar aria-label='Navn'>{cat1Img}</Avatar>
          <Avatar aria-label='Navn'>{cat1Img}</Avatar>
          <Avatar aria-label='Navn'>{cat3Img}</Avatar>
        </AvatarStack>
      </fieldset>
    </section>
  ),
});

export const DataSize = meta.story({
  render: (args) => (
    <>
      <fieldset>
        <legend>avatarSize='var(--ds-size-12)'</legend>
        <AvatarStack data-size='sm' {...args}>
          <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          <Avatar aria-label='Navn'>
            <BriefcaseIcon />
          </Avatar>
          <Avatar aria-label='Navn'>sm</Avatar>
          <Avatar aria-label='Navn' initials='sm' />
        </AvatarStack>
        <AvatarStack data-size='md' {...args}>
          <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          <Avatar aria-label='Navn'>
            <BriefcaseIcon />
          </Avatar>
          <Avatar aria-label='Navn'>md</Avatar>
          <Avatar aria-label='Navn' initials='md' />
        </AvatarStack>
        <AvatarStack data-size='lg' {...args}>
          <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          <Avatar aria-label='Navn'>
            <BriefcaseIcon />
          </Avatar>
          <Avatar aria-label='Navn'>lg</Avatar>
          <Avatar aria-label='Navn' initials='lg' />
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>avatarSize='3em'</legend>
        <AvatarStack
          {...args}
          data-size='sm'
          style={
            {
              '--dsc-avatar-stack-size': '3em',
            } as React.CSSProperties
          }
        >
          <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          <Avatar aria-label='Navn'>
            <BriefcaseIcon />
          </Avatar>
          <Avatar aria-label='Navn'>sm</Avatar>
          <Avatar aria-label='Navn' initials='sm' />
        </AvatarStack>
        <AvatarStack
          data-size='md'
          {...args}
          style={
            {
              '--dsc-avatar-stack-size': '3em',
            } as React.CSSProperties
          }
        >
          <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          <Avatar aria-label='Navn'>
            <BriefcaseIcon />
          </Avatar>
          <Avatar aria-label='Navn'>md</Avatar>
          <Avatar aria-label='Navn' initials='md' />
        </AvatarStack>
        <AvatarStack
          data-size='lg'
          {...args}
          style={
            {
              '--dsc-avatar-stack-size': '3em',
            } as React.CSSProperties
          }
        >
          <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          <Avatar aria-label='Navn'>
            <BriefcaseIcon />
          </Avatar>
          <Avatar aria-label='Navn'>lg</Avatar>
          <Avatar aria-label='Navn' initials='lg' />
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>avatarSize='3rem'</legend>
        <AvatarStack
          data-size='sm'
          {...args}
          style={
            {
              '--dsc-avatar-stack-size': '3rem',
            } as React.CSSProperties
          }
        >
          <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          <Avatar aria-label='Navn'>
            <BriefcaseIcon />
          </Avatar>
          <Avatar aria-label='Navn'>sm</Avatar>
          <Avatar aria-label='Navn' initials='sm' />
        </AvatarStack>
        <AvatarStack
          data-size='md'
          {...args}
          style={
            {
              '--dsc-avatar-stack-size': '3rem',
            } as React.CSSProperties
          }
        >
          <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          <Avatar aria-label='Navn'>
            <BriefcaseIcon />
          </Avatar>
          <Avatar aria-label='Navn'>md</Avatar>
          <Avatar aria-label='Navn' initials='md' />
        </AvatarStack>
        <AvatarStack
          data-size='lg'
          {...args}
          style={
            {
              '--dsc-avatar-stack-size': '3rem',
            } as React.CSSProperties
          }
        >
          <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          <Avatar aria-label='Navn'>
            <BriefcaseIcon />
          </Avatar>
          <Avatar aria-label='Navn'>lg</Avatar>
          <Avatar aria-label='Navn' initials='lg' />
        </AvatarStack>
      </fieldset>
    </>
  ),
});

export const ShapeVariants = meta.story({
  render: (args) => (
    <AvatarStack {...args}>
      <Avatar variant='square' aria-label='variant square' />
      <Avatar variant='square' aria-label='Ola Nordmann'>
        {cat5Img}
      </Avatar>
      <Avatar variant='square' aria-label='Ola Nordmann'>
        {cat1Img}
      </Avatar>
      <Avatar variant='square' aria-label='Ola Nordmann'>
        {cat5Img}
      </Avatar>
      <Avatar variant='square' aria-label='Ola Nordmann'>
        {cat5Img}
      </Avatar>
    </AvatarStack>
  ),

  args: {
    expandable: 'fixed',
  },
});

export const WithTooltip = meta.story({
  render: (args) => (
    <section>
      <fieldset>
        <legend>expandable</legend>
        <AvatarStack {...args} expandable='fixed'>
          <Avatar data-tooltip='Ola Nordmann'>{cat1Img}</Avatar>
          <Avatar data-tooltip='Kari Nordmann'>{cat5Img}</Avatar>
          <Avatar data-tooltip='Person 2'>Hei</Avatar>
          <Avatar data-tooltip='Person 3'>{cat5Img}</Avatar>
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>not expandable</legend>
        <AvatarStack {...args}>
          <Tooltip content='Ola Nordmann'>
            <Avatar aria-label='Navn'>{cat1Img}</Avatar>
          </Tooltip>
          <Tooltip content='Kari Nordmann'>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </Tooltip>
          <Tooltip content='Person 2'>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </Tooltip>
          <Tooltip content='Person 3'>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </Tooltip>
        </AvatarStack>
      </fieldset>
    </section>
  ),
});

export const WithTooltipAndLink = meta.story({
  render: (args) => (
    <section>
      <fieldset>
        <legend>Link expandable</legend>
        <AvatarStack {...args} expandable='fixed'>
          <Avatar aria-label='profile picture a' asChild>
            <a href='#'>{cat1Img}</a>
          </Avatar>
          <Avatar aria-label='profile picture b' asChild>
            <a href='#'>{cat1Img}</a>
          </Avatar>
          <Avatar aria-label='profile picture c' asChild>
            <a href='#'>{cat3Img}</a>
          </Avatar>
          <Avatar aria-label='profile picture d' asChild>
            <a href='#'>{cat4Img}</a>
          </Avatar>
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>Link + Tooltip</legend>
        <AvatarStack {...args}>
          <Tooltip content='Ola Nordmann'>
            <Avatar aria-label='profile picture a' asChild>
              <a href='#'>{cat1Img}</a>
            </Avatar>
          </Tooltip>
          <Tooltip content='Kari Nordmann'>
            <Avatar aria-label='profile picture b' asChild>
              <a href='#'>{cat4Img}</a>
            </Avatar>
          </Tooltip>
          <Tooltip content='Person 2'>
            <Avatar aria-label='profile picture c' asChild>
              <a href='#'>{cat3Img}</a>
            </Avatar>
          </Tooltip>
          <Tooltip content='Person 3'>
            <Avatar aria-label='profile picture d' asChild>
              <a href='#'>BR</a>
            </Avatar>
          </Tooltip>
        </AvatarStack>
      </fieldset>
    </section>
  ),
}); */

/* export const Playground = meta.story(() => {
  const [expandable, setExpandable] = useState<undefined | true>(undefined);
  const [size, setSize] = useState(64);
  const [radius, setRadius] = useState(150);
  const [overlap, setOverlap] = useState(32);
  const [gap, setGap] = useState(2);

  return (
    <>
      <fieldset>
        <Checkbox
          label='Expandable'
          checked={expandable !== undefined}
          onChange={() => setExpandable((prev) => (prev ? undefined : true))}
        />

        <Field>
          <Label>Radius {`${radius}px`}</Label>
          <input
            min='0'
            max='150'
            step='0.1'
            type='range'
            value={radius}
            onChange={(e) =>
              setRadius(Number((e.target as HTMLInputElement).value))
            }
          />
        </Field>
        <Field>
          <Label>Size {`${size}px`}</Label>
          <input
            min='24'
            max='150'
            step='0.1'
            type='range'
            value={size}
            onChange={(e) =>
              setSize(Number((e.target as HTMLInputElement).value))
            }
          />
        </Field>
        <Field>
          <Label>Overlap {`${overlap}px`}</Label>
          <input
            min='0'
            max='150'
            step='1'
            type='range'
            value={overlap}
            onChange={(e) =>
              setOverlap(Number((e.target as HTMLInputElement).value))
            }
          />
        </Field>
        <Field>
          <Label>Gap {`${gap}px`}</Label>
          <input
            min='0'
            max='15'
            step='1'
            type='range'
            value={gap}
            onChange={(e) =>
              setGap(Number((e.target as HTMLInputElement).value))
            }
          />
        </Field>
      </fieldset>
      <br />

      <AvatarStack
        expandable={expandable}
        style={
          {
            '--dsc-avatar-stack-gap': `${gap}px`,
            '--dsc-avatar-stack-overlap': `${overlap}px`,
            '--dsc-avatar-stack-radius': `${radius}px`,
            '--dsc-avatar-stack-size': `${size}px`,
          } as React.CSSProperties
        }
      >
        <Avatar aria-label='profile a'>{cat1Img}</Avatar>
        <Avatar aria-label='profile b'>{cat5Img}</Avatar>
        <Avatar aria-label='profile c'>md</Avatar>
        <Avatar aria-label='profile d'>{cat5Img}</Avatar>
        <Avatar aria-label='profile e'>{cat1Img}</Avatar>
        +10
      </AvatarStack>
    </>
  );
}); */
