import { Link, Paragraph } from '@digdir/designsystemet-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';

export const Preview = () => {
  return <Link href='https://designsystemet.no'>Gå til designsystemet</Link>;
};

export const InText = () => {
  return (
    <Paragraph>
      Vi bruker komponenter fra{' '}
      <Link href='https://designsystemet.no'>designsystemet.no</Link>.
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
  return (
    <Link href='https://designsystemet.no' data-color='neutral'>
      Gå til designsystemet
    </Link>
  );
};
