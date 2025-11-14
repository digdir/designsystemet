import { Link, Paragraph } from '@digdir/designsystemet-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { useId } from 'react';

export const Preview = () => {
  const rand = useId();
  return (
    <Link href={'https://designsystemet.no?q=' + rand}>
      Gå til designsystemet
    </Link>
  );
};

export const InText = () => {
  const rand = useId();

  return (
    <Paragraph>
      Vi bruker komponenter fra{' '}
      <Link href={'https://designsystemet.no?q=' + rand}>
        designsystemet.no
      </Link>
      .
    </Paragraph>
  );
};

export const WithIcon = () => {
  return (
    <Link href='mailto:designsystem@digdir.no'>
      <EnvelopeClosedIcon aria-hidden fontSize={24} />
      <span>Kontakt oss</span>
    </Link>
  );
};

export const Neutral = () => {
  const rand = useId();
  return (
    <Link href={'https://designsystemet.no?q=' + rand} data-color='neutral'>
      Gå til designsystemet
    </Link>
  );
};
