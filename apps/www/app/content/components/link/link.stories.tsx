import { Link, Paragraph } from '@digdir/designsystemet-react';
import { Chat2Icon } from '@navikt/aksel-icons';
import { useId } from 'react';

export const Preview = () => {
  const rand = useId();
  return (
    <Link href={'/no/patterns/external-links/' + rand}>Merking av lenker</Link>
  );
};

export const PreviewEn = () => {
  const rand = useId();
  return (
    <Link href={'/en/patterns/external-links/' + rand}>Labelling links</Link>
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

export const InTextEn = () => {
  const rand = useId();

  return (
    <Paragraph>
      We use components from{' '}
      <Link href={'https://designsystemet.no?q=' + rand}>
        designsystemet.no
      </Link>
      .
    </Paragraph>
  );
};

export const WithIcon = () => {
  return (
    <Link href='https://designsystemet.no/slack'>
      <Chat2Icon aria-hidden height={24} width={24} />
      <span>Snakk med oss på Slack</span>
    </Link>
  );
};

export const WithIconEn = () => {
  return (
    <Link href='https://designsystemet.no/slack'>
      <Chat2Icon aria-hidden height={24} width={24} />
      <span>Talk to us on Slack</span>
    </Link>
  );
};

export const Neutral = () => {
  const rand = useId();
  return (
    <Link href={'/no/intro/privacy-policy' + rand} data-color='neutral'>
      Personvernerklæring
    </Link>
  );
};

export const NeutralEn = () => {
  const rand = useId();
  return (
    <Link href={'/en/intro/privacy-policy' + rand} data-color='neutral'>
      Privacy Policy
    </Link>
  );
};
