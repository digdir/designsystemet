import { Button } from '@digdir/designsystemet-react';
import { PencilWritingIcon } from '@navikt/aksel-icons';

const Code = () => {
  return (
    <>
      <Button icon aria-label='Kun ikon'>
        <PencilWritingIcon aria-hidden />
      </Button>
      <Button>
        <PencilWritingIcon aria-hidden />
        Rediger
      </Button>
    </>
  );
};

export default Code;
