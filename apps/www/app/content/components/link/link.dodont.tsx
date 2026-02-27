import { Link } from '@digdir/designsystemet-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';

export const DoIcon = () => {
  return (
    <Link href='https://arbeidsplassen.nav.no/stillinger'>
      <span>Finn ledige stillinger på arbeidsplassen.no</span>
    </Link>
  );
};
export const DontIcon = () => {
  return (
    <Link href='https://arbeidsplassen.nav.no/stillinger'>
      <ExternalLinkIcon aria-hidden height={24} width={24} />
      <span>Finn ledige stillinger</span>
    </Link>
  );
};

export const DoIconEn = () => {
  return (
    <Link href='https://arbeidsplassen.nav.no/stillinger'>
      <span>Find available jobs on arbeidsplassen.no</span>
    </Link>
  );
};

export const DontIconEn = () => {
  return (
    <Link href='https://arbeidsplassen.nav.no/stillinger'>
      <ExternalLinkIcon aria-hidden height={24} width={24} />
      <span>Find available jobs</span>
    </Link>
  );
};

export const DoIcon2 = () => {
  return (
    <Link href='/no/patterns/external-links/'>
      <span>Merking av lenker</span>
    </Link>
  );
};
export const DontIcon2 = () => {
  return (
    <Link href='/no/patterns/external-links/'>
      <span>Les mer</span>
    </Link>
  );
};

export const DoIcon2En = () => {
  return (
    <Link href='/no/patterns/external-links/'>
      <span>Labelling links</span>
    </Link>
  );
};

export const DontIcon2En = () => {
  return (
    <Link href='/no/patterns/external-links/'>
      <span>Read more</span>
    </Link>
  );
};
