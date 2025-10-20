import { Tooltip, Button } from '@digdir/designsystemet-react';
import { FilesIcon } from '@navikt/aksel-icons';

export const Preview = () => (
  <Tooltip content="Kopier" placement="top">
    <Button icon aria-label="Kopier">
      <FilesIcon aria-hidden />
    </Button>
  </Tooltip>
);

export const WithString = () => (
  <Tooltip content="Organisasjonsnummer">
    Org.nr.
  </Tooltip>
);

export const Placement = () => (
  <Tooltip content="Kopier" placement="bottom">
    <Button icon aria-label="Kopier">
      <FilesIcon aria-hidden />
    </Button>
  </Tooltip>
);
