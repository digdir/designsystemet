import { Button } from '@digdir/designsystemet-react';
import {
  ArrowRightIcon,
  Chat2Icon,
  PersonPlusIcon,
  PlusIcon,
} from '@navikt/aksel-icons';

export const DoIcon = () => {
  return (
    <>
      <Button variant='primary'>
        <Chat2Icon aria-hidden />
        Start chat
      </Button>
      <Button variant='secondary'>
        <PersonPlusIcon aria-hidden />
        Legg til
      </Button>
    </>
  );
};
export const DontIcon = () => {
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

export const DoIconEn = () => {
  return (
    <>
      <Button variant='primary'>
        <Chat2Icon aria-hidden />
        Start chat
      </Button>
      <Button variant='secondary'>
        <PersonPlusIcon aria-hidden />
        Add
      </Button>
    </>
  );
};

export const DontIconEn = () => {
  return (
    <>
      <Button variant='primary'>
        <Chat2Icon aria-hidden /> Start chat <ArrowRightIcon aria-hidden />
      </Button>
      <Button variant='secondary'>
        <PlusIcon aria-hidden />
        Add
        <PersonPlusIcon aria-hidden />
      </Button>
    </>
  );
};

export const DoIcon2 = () => {
  return (
    <Button variant='primary' data-color='accent'>
      Logg inn <ArrowRightIcon aria-hidden />
    </Button>
  );
};
export const DontIcon2 = () => {
  return (
    <Button variant='primary' data-color='accent'>
      Klikk her <ArrowRightIcon aria-hidden />
    </Button>
  );
};

export const DoIcon2En = () => {
  return (
    <Button variant='primary' data-color='accent'>
      Log in <ArrowRightIcon aria-hidden />
    </Button>
  );
};

export const DontIcon2En = () => {
  return (
    <Button variant='primary' data-color='accent'>
      Click here <ArrowRightIcon aria-hidden />
    </Button>
  );
};

export const DoIcon3 = () => {
  return (
    <Button variant='primary' data-color='accent'>
      Send søknad
    </Button>
  );
};
export const DontIcon3 = () => {
  return (
    <>
      <Button variant='primary' data-color='accent'>
        SEND SØKNAD
      </Button>
      <Button variant='primary' data-color='accent'>
        Send Søknad
      </Button>
      <Button variant='primary' data-color='accent'>
        send søknad
      </Button>
    </>
  );
};

export const DoIcon3En = () => {
  return (
    <Button variant='primary' data-color='accent'>
      Submit application
    </Button>
  );
};

export const DontIcon3En = () => {
  return (
    <>
      <Button variant='primary' data-color='accent'>
        SUBMIT APPLICATION
      </Button>
      <Button variant='primary' data-color='accent'>
        Submit Application
      </Button>
      <Button variant='primary' data-color='accent'>
        submit application
      </Button>
    </>
  );
};
