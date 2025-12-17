import cat1 from '@assets/img/cats/Cat 3.jpg';
import { BriefcaseIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Avatar, AvatarStack } from '../';

type Story = StoryFn<typeof AvatarStack>;

const meta: Meta<typeof AvatarStack> = {
  title: 'Komponenter/AvatarStack',
  component: AvatarStack,
  parameters: {
    layout: 'padded',
    customStyles: {
      display: 'flex',
      gap: 'var(--ds-size-2)',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
  },
};

export default meta;

export const Preview: Story = (args) => (
  <AvatarStack {...args}>
    <Avatar aria-label=''>
      <img src={cat1} alt='' />
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
