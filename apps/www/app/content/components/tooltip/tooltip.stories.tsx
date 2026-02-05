import { Button, Tooltip } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';

export const Preview = () => {
  return (
    <Tooltip content='Kopier' placement='top'>
      <Button icon aria-label='Kopier'>
        <FilesIcon aria-hidden />
      </Button>
    </Tooltip>
  );
};

export const PreviewEn = () => {
  return (
    <Tooltip content='Copy' placement='top'>
      <Button icon aria-label='Copy'>
        <FilesIcon aria-hidden />
      </Button>
    </Tooltip>
  );
};

export const WithString = () => {
  return <Tooltip content='Organisasjonsnummer'>Org.nr.</Tooltip>;
};

export const WithStringEn = () => {
  return <Tooltip content='Organisation number'>Org. no.</Tooltip>;
};

export const Placement = () => {
  return (
    <Tooltip content='Kopier' placement='bottom'>
      <Button icon aria-label='Kopier'>
        <FilesIcon aria-hidden />
      </Button>
    </Tooltip>
  );
};

export const PlacementEn = () => {
  return (
    <Tooltip content='Copy' placement='bottom'>
      <Button icon aria-label='Copy'>
        <FilesIcon aria-hidden />
      </Button>
    </Tooltip>
  );
};

export const Aria = () => {
  return (
    <>
      <Tooltip content='Eg er aria-describedby'>
        <Button>Eg er aria-describedby</Button>
      </Tooltip>
      <Tooltip content='Eg er aria-labelledby'>
        <Button icon>
          <FilesIcon aria-hidden />
        </Button>
      </Tooltip>
    </>
  );
};

export const AriaEn = () => {
  return (
    <>
      <Tooltip content='I am aria-describedby'>
        <Button>I am aria-describedby</Button>
      </Tooltip>

      <Tooltip content='I am aria-labelledby'>
        <Button icon>
          <FilesIcon aria-hidden />
        </Button>
      </Tooltip>
    </>
  );
};
