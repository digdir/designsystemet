import { BriefcaseIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Avatar, AvatarStack } from '../';

type Story = StoryFn<typeof AvatarStack>;

const meta: Meta<typeof AvatarStack> = {
  title: 'Komponenter/AvatarStack',
  component: AvatarStack,
  parameters: {
    layout: 'fullscreen',
    /*     customStyles: {
      display: 'flex',
      gap: 'var(--ds-size-2)',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    }, */
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

Preview.args = {
  'aria-label': 'Ola Nordmann',
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
  expandable: true,
  gap: 3,
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
  </AvatarStack>
);
ShapeVariants.args = {
  overlap: 50,
  expandable: true,
};
