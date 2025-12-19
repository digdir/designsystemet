import { BriefcaseIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Avatar, AvatarStack, Tooltip } from '../';

type Story = StoryFn<typeof AvatarStack>;

const meta: Meta<typeof AvatarStack> = {
  title: 'Komponenter/AvatarStack',
  component: AvatarStack,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    'aria-label': 'Test av aria label',
  },
};

export default meta;

export const Preview: Story = (args) => (
  <AvatarStack {...args}>
    <Avatar aria-label=''>
      <img src='https://placebeard.it/100x100' alt='' />
    </Avatar>
    <Avatar aria-label=''>
      <BriefcaseIcon />
    </Avatar>
    <Avatar aria-label='' initials='sm' />
    <Avatar aria-label=''>md</Avatar>
    <Avatar aria-label='' initials='lg' />
  </AvatarStack>
);

export const Expandable: Story = (args) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      gap: 'var(--ds-size-4)',
      flexWrap: 'wrap',
    }}
  >
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>expandable</legend>
      <AvatarStack {...args} expandable>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
      </AvatarStack>
    </fieldset>
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>expandable="fixed"</legend>
      <AvatarStack {...args} expandable='fixed'>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
      </AvatarStack>
    </fieldset>
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>not expandable</legend>
      <AvatarStack {...args}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
      </AvatarStack>
    </fieldset>
  </div>
);
Expandable.args = {
  gap: 4,
};

export const DataSize: Story = (args) => (
  <>
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>avatarSize='var(--ds-size-12)'</legend>
      <AvatarStack avatarSize='var(--ds-size-12)' data-size='sm' {...args}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <BriefcaseIcon />
        </Avatar>
        <Avatar aria-label=''>sm</Avatar>
        <Avatar aria-label='' initials='sm' />
      </AvatarStack>
      <AvatarStack avatarSize={'var(--ds-size-12)'} data-size='md' {...args}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <BriefcaseIcon />
        </Avatar>
        <Avatar aria-label=''>md</Avatar>
        <Avatar aria-label='' initials='md' />
      </AvatarStack>
      <AvatarStack avatarSize={'var(--ds-size-12)'} data-size='lg' {...args}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <BriefcaseIcon />
        </Avatar>
        <Avatar aria-label=''>lg</Avatar>
        <Avatar aria-label='' initials='lg' />
      </AvatarStack>
    </fieldset>
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>avatarSize='3em'</legend>
      <AvatarStack avatarSize='3em' data-size='sm' {...args}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <BriefcaseIcon />
        </Avatar>
        <Avatar aria-label=''>sm</Avatar>
        <Avatar aria-label='' initials='sm' />
      </AvatarStack>
      <AvatarStack avatarSize='3em' data-size='md' {...args}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <BriefcaseIcon />
        </Avatar>
        <Avatar aria-label=''>md</Avatar>
        <Avatar aria-label='' initials='md' />
      </AvatarStack>
      <AvatarStack avatarSize='3em' data-size='lg' {...args}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <BriefcaseIcon />
        </Avatar>
        <Avatar aria-label=''>lg</Avatar>
        <Avatar aria-label='' initials='lg' />
      </AvatarStack>
    </fieldset>
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>avatarSize='3rem'</legend>
      <AvatarStack avatarSize='3rem' data-size='sm' {...args}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <BriefcaseIcon />
        </Avatar>
        <Avatar aria-label=''>sm</Avatar>
        <Avatar aria-label='' initials='sm' />
      </AvatarStack>
      <AvatarStack avatarSize='3rem' data-size='md' {...args}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <BriefcaseIcon />
        </Avatar>
        <Avatar aria-label=''>md</Avatar>
        <Avatar aria-label='' initials='md' />
      </AvatarStack>
      <AvatarStack avatarSize='3rem' data-size='lg' {...args}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <BriefcaseIcon />
        </Avatar>
        <Avatar aria-label=''>lg</Avatar>
        <Avatar aria-label='' initials='lg' />
      </AvatarStack>
    </fieldset>
  </>
);
DataSize.args = {
  expandable: 'fixed',
  gap: 3,
  max: 3,
};

export const ShapeVariants: Story = (args) => (
  <AvatarStack {...args}>
    <Avatar variant='square' aria-label='variant square' />
    <Avatar variant='square' aria-label='Ola Nordmann'>
      <img src='https://i.pravatar.cc/100' alt='' />
    </Avatar>
    <Avatar variant='square' aria-label='Ola Nordmann'>
      <img src='https://placebeard.it/100x100' alt='' />
    </Avatar>
    <Avatar variant='square' aria-label='Ola Nordmann'>
      <img src='https://i.pravatar.cc/100' alt='' />
    </Avatar>
    <Avatar variant='square' aria-label='Ola Nordmann'>
      <img src='https://i.pravatar.cc/100' alt='' />
    </Avatar>
  </AvatarStack>
);
ShapeVariants.args = {
  overlap: 50,
  expandable: 'fixed',
  max: 4,
};

export const WithTooltip: Story = (args) => (
  <div
    style={{ display: 'flex', flexDirection: 'row', gap: 'var(--ds-size-4)' }}
  >
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>expandable</legend>
      <AvatarStack {...args} expandable='fixed'>
        <Tooltip content='Ola Nordmann'>
          <Avatar aria-label=''>
            <img src='https://placebeard.it/100x100' alt='' />
          </Avatar>
        </Tooltip>
        <Tooltip content='Kari Nordmann'>
          <Avatar aria-label=''>
            <img src='https://i.pravatar.cc/100' alt='' />
          </Avatar>
        </Tooltip>
        <Tooltip content='Person 2'>
          <Avatar aria-label=''>
            <img src='https://i.pravatar.cc/100' alt='' />
          </Avatar>
        </Tooltip>
        <Tooltip content='Person 3'>
          <Avatar aria-label=''>
            <img src='https://i.pravatar.cc/100' alt='' />
          </Avatar>
        </Tooltip>
      </AvatarStack>
    </fieldset>
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>not expandable</legend>
      <AvatarStack {...args}>
        <Tooltip content='Ola Nordmann'>
          <Avatar aria-label=''>
            <img src='https://placebeard.it/100x100' alt='' />
          </Avatar>
        </Tooltip>
        <Tooltip content='Kari Nordmann'>
          <Avatar aria-label=''>
            <img src='https://i.pravatar.cc/100' alt='' />
          </Avatar>
        </Tooltip>
        <Tooltip content='Person 2'>
          <Avatar aria-label=''>
            <img src='https://i.pravatar.cc/100' alt='' />
          </Avatar>
        </Tooltip>
        <Tooltip content='Person 3'>
          <Avatar aria-label=''>
            <img src='https://i.pravatar.cc/100' alt='' />
          </Avatar>
        </Tooltip>
      </AvatarStack>
    </fieldset>
  </div>
);
WithTooltip.args = {
  max: 4,
};

export const WithTooltipAndLink: Story = (args) => (
  <div
    style={{ display: 'flex', flexDirection: 'row', gap: 'var(--ds-size-4)' }}
  >
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>Link expandable</legend>
      <AvatarStack {...args} expandable='fixed'>
        <Avatar aria-label=''>
          <a href='#'>
            <img src='https://placebeard.it/100x100' alt='' />
          </a>
        </Avatar>
        <Avatar aria-label=''>
          <a href='#'>
            <img src='https://i.pravatar.cc/100' alt='' />
          </a>
        </Avatar>
        <Avatar aria-label=''>
          <a href='#'>
            <img src='https://i.pravatar.cc/100' alt='' />
          </a>
        </Avatar>
        <Avatar aria-label=''>
          <a href='#'>
            <img src='https://i.pravatar.cc/100' alt='' />
          </a>
        </Avatar>
      </AvatarStack>
    </fieldset>
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>Link + Tooltip</legend>
      <AvatarStack {...args} overlap={20}>
        <Tooltip content='Ola Nordmann'>
          <Avatar aria-label=''>
            <a href='#'>
              <img src='https://placebeard.it/100x100' alt='' />
            </a>
          </Avatar>
        </Tooltip>
        <Tooltip content='Kari Nordmann'>
          <Avatar aria-label=''>
            <a href='#'>
              <img src='https://i.pravatar.cc/100' alt='' />
            </a>
          </Avatar>
        </Tooltip>
        <Tooltip content='Person 2'>
          <Avatar aria-label=''>
            <a href='#'>
              <img src='https://i.pravatar.cc/100' alt='' />
            </a>
          </Avatar>
        </Tooltip>
        <Tooltip content='Person 3'>
          <Avatar aria-label=''>
            <a href='#'>
              <img src='https://i.pravatar.cc/100' alt='' />
            </a>
          </Avatar>
        </Tooltip>
      </AvatarStack>
    </fieldset>
  </div>
);
WithTooltipAndLink.args = {
  max: 4,
};

export const Overlaps: Story = (args) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      gap: 'var(--ds-size-4)',
      flexWrap: 'wrap',
    }}
  >
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>overlap: 100</legend>
      <AvatarStack {...args} overlap={100}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
      </AvatarStack>
    </fieldset>
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>overlap: 70</legend>
      <AvatarStack {...args} overlap={70}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
      </AvatarStack>
    </fieldset>
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>overlap: 50</legend>
      <AvatarStack {...args} overlap={50}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
      </AvatarStack>
    </fieldset>
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>overlap: 30</legend>
      <AvatarStack {...args} overlap={30}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
      </AvatarStack>
    </fieldset>
    <fieldset
      style={{ display: 'flex', gap: 'var(--ds-size-4)', alignItems: 'center' }}
    >
      <legend>overlap: 0</legend>
      <AvatarStack {...args} overlap={0}>
        <Avatar aria-label=''>
          <img src='https://placebeard.it/100x100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
        <Avatar aria-label=''>
          <img src='https://i.pravatar.cc/100' alt='' />
        </Avatar>
      </AvatarStack>
    </fieldset>
  </div>
);
Overlaps.args = {
  max: 4,
  gap: 3,
};
