import { Link, Paragraph } from '@digdir/designsystemet-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';

const designsystemetLink = 'https://designsystemet.no';

export const Preview = () => (
  <Link href={designsystemetLink}>Gå til designsystemet</Link>
);

export const InText = () => (
  <Paragraph>
    Vi bruker komponenter fra{' '}
    <Link href={designsystemetLink}>designsystemet.no</Link>.
  </Paragraph>
);

export const WithIcon = () => (
  <Link href='mailto:designsystem@digdir.no'>
    <EnvelopeClosedIcon aria-hidden fontSize={24} />
    <span>Kontakt oss</span>
  </Link>
);

export const Neutral = () => (
  <Link href={designsystemetLink} data-color='neutral'>
    Gå til designsystemet
  </Link>
);
