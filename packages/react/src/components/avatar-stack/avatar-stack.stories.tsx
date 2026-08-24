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
      <li>
        <Avatar aria-label='Navn'>{cat1Img}</Avatar>
      </li>
      <li>
        <Avatar aria-label='Navn'>
          <BriefcaseIcon />
        </Avatar>
      </li>
      <li>
        <Avatar aria-label='Navn' initials='sm' />
      </li>
      <li>
        <Avatar aria-label='Navn'>md</Avatar>
      </li>
      <li>
        <Avatar aria-label='Navn' initials='ON' />
      </li>
    </AvatarStack>
  ),
});

export const Expandable = meta.story({
  render: (args) => (
    <section>
      <fieldset>
        <legend>expandable</legend>
        <AvatarStack {...args} expandable>
          <li>
            <Avatar aria-label='profile picture a'>{cat1Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='profile picture b'>{cat1Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='profile picture c'>{cat3Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='profile picture d'>{cat4Img}</Avatar>
          </li>
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>expandable="fixed"</legend>
        <AvatarStack {...args} expandable='fixed'>
          <li>
            <Avatar aria-label='profile picture a'>{cat1Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='profile picture b'>{cat1Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='profile picture c'>{cat3Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='profile picture d'>{cat4Img}</Avatar>
          </li>
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>default</legend>
        <AvatarStack {...args}>
          <li>
            <Avatar aria-label='Navn'>{cat1Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>{cat1Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>{cat3Img}</Avatar>
          </li>
        </AvatarStack>
      </fieldset>
    </section>
  ),
});

export const DataSize = meta.story({
  render: (args) => (
    <>
      <fieldset>
        <legend>Avatar size default</legend>
        <AvatarStack data-size='sm' {...args}>
          <li>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>
              <BriefcaseIcon />
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>sm</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn' initials='sm' />
          </li>
        </AvatarStack>
        <AvatarStack data-size='md' {...args}>
          <li>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>
              <BriefcaseIcon />
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>md</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn' initials='md' />
          </li>
        </AvatarStack>
        <AvatarStack data-size='lg' {...args}>
          <li>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>
              <BriefcaseIcon />
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>lg</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn' initials='lg' />
          </li>
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>Avatar size 3em</legend>
        <AvatarStack
          {...args}
          data-size='sm'
          style={
            {
              '--dsc-avatar-stack-size': '3em',
            } as React.CSSProperties
          }
        >
          <li>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>
              <BriefcaseIcon />
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>sm</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn' initials='sm' />
          </li>
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
          <li>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>
              <BriefcaseIcon />
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>md</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn' initials='md' />
          </li>
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
          <li>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>
              <BriefcaseIcon />
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>lg</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn' initials='lg' />
          </li>
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>Avatar size 3rem</legend>
        <AvatarStack
          data-size='sm'
          {...args}
          style={
            {
              '--dsc-avatar-stack-size': '3rem',
            } as React.CSSProperties
          }
        >
          <li>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>
              <BriefcaseIcon />
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>sm</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn' initials='sm' />
          </li>
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
          <li>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>
              <BriefcaseIcon />
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>md</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn' initials='md' />
          </li>
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
          <li>
            <Avatar aria-label='Navn'>{cat5Img}</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>
              <BriefcaseIcon />
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn'>lg</Avatar>
          </li>
          <li>
            <Avatar aria-label='Navn' initials='lg' />
          </li>
        </AvatarStack>
      </fieldset>
    </>
  ),
});

export const ShapeVariants = meta.story({
  render: (args) => (
    <AvatarStack
      {...args}
      style={
        {
          '--dsc-avatar-stack-radius': 'var(--ds-border-radius-sm)',
        } as React.CSSProperties
      }
    >
      <li>
        <Avatar aria-label='variant square' />
      </li>
      <li>
        <Avatar aria-label='Ola Nordmann'>{cat5Img}</Avatar>
      </li>
      <li>
        <Avatar aria-label='Ola Nordmann'>{cat1Img}</Avatar>
      </li>
      <li>
        <Avatar aria-label='Ola Nordmann'>{cat5Img}</Avatar>
      </li>
      <li>
        <Avatar aria-label='Ola Nordmann'>{cat5Img}</Avatar>
      </li>
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
          <li>
            <Avatar data-tooltip='Ola Nordmann'>{cat1Img}</Avatar>
          </li>
          <li>
            <Avatar data-tooltip='Kari Nordmann'>{cat5Img}</Avatar>
          </li>
          <li>
            <Avatar data-tooltip='Person 2'>Hei</Avatar>
          </li>
          <li>
            <Avatar data-tooltip='Person 3'>{cat5Img}</Avatar>
          </li>
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>not expandable</legend>
        <AvatarStack {...args}>
          <li>
            <Tooltip content='Ola Nordmann'>
              <Avatar aria-label='Navn'>{cat1Img}</Avatar>
            </Tooltip>
          </li>
          <li>
            <Tooltip content='Kari Nordmann'>
              <Avatar aria-label='Navn'>{cat5Img}</Avatar>
            </Tooltip>
          </li>
          <li>
            <Tooltip content='Person 2'>
              <Avatar aria-label='Navn'>{cat5Img}</Avatar>
            </Tooltip>
          </li>
          <li>
            <Tooltip content='Person 3'>
              <Avatar aria-label='Navn'>{cat5Img}</Avatar>
            </Tooltip>
          </li>
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
          <li>
            <Avatar aria-label='profile picture a' asChild>
              <a href='#'>{cat1Img}</a>
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='profile picture b' asChild>
              <a href='#'>{cat1Img}</a>
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='profile picture c' asChild>
              <a href='#'>{cat3Img}</a>
            </Avatar>
          </li>
          <li>
            <Avatar aria-label='profile picture d' asChild>
              <a href='#'>{cat4Img}</a>
            </Avatar>
          </li>
        </AvatarStack>
      </fieldset>
      <fieldset>
        <legend>Link + Tooltip</legend>
        <AvatarStack {...args}>
          <li>
            <Tooltip content='Ola Nordmann'>
              <Avatar aria-label='profile picture a' asChild>
                <a href='#'>{cat1Img}</a>
              </Avatar>
            </Tooltip>
          </li>
          <li>
            <Tooltip content='Kari Nordmann'>
              <Avatar aria-label='profile picture b' asChild>
                <a href='#'>{cat4Img}</a>
              </Avatar>
            </Tooltip>
          </li>
          <li>
            <Tooltip content='Person 2'>
              <Avatar aria-label='profile picture c' asChild>
                <a href='#'>{cat3Img}</a>
              </Avatar>
            </Tooltip>
          </li>
          <li>
            <Tooltip content='Person 3'>
              <Avatar aria-label='profile picture d' asChild>
                <a href='#'>BR</a>
              </Avatar>
            </Tooltip>
          </li>
        </AvatarStack>
      </fieldset>
    </section>
  ),
});

export const Playground = meta.story(() => {
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
            step='1'
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
            step='1'
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
        <li>
          <Avatar aria-label='profile a'>{cat1Img}</Avatar>
        </li>
        <li>
          <Avatar aria-label='profile b'>{cat5Img}</Avatar>
        </li>
        <li>
          <Avatar aria-label='profile c'>md</Avatar>
        </li>
        <li>
          <Avatar aria-label='profile d'>{cat5Img}</Avatar>
        </li>
        <li>
          <Avatar aria-label='profile e'>{cat1Img}</Avatar>
        </li>
        <li>+10</li>
      </AvatarStack>
    </>
  );
});
