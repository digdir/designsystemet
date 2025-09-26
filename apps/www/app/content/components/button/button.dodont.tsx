import { Button } from '@digdir/designsystemet-react';
import {
  ArrowRightIcon,
  Chat2Icon,
  PersonPlusIcon,
  PlusIcon,
} from '@navikt/aksel-icons';

export const doIcon = () => {
  return (
    <>
      <Button variant='primary'>
        Start chat <ArrowRightIcon aria-hidden />
      </Button>
      <Button variant='secondary'>
        <PersonPlusIcon aria-hidden />
        Legg til
      </Button>
    </>
  );
};
export const dontIcon = () => {
  return (
    <>
      <Button variant='primary'>
        <Chat2Icon aria-hidden /> Start chat <ArrowRightIcon aria-hidden />
      </Button>
      <Button variant='secondary'>
        <PlusIcon aria-hidden />
        Legg til
        <PersonPlusIcon aria-hidden />
      </Button>
    </>
  );
};
