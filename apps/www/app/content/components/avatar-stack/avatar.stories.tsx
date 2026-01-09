import {
  Avatar,
  AvatarStack,
  Checkbox,
  Label,
  Tooltip,
} from '@digdir/designsystemet-react';
import { BriefcaseIcon } from '@navikt/aksel-icons';

export const Preview = () => (
  <AvatarStack>
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
