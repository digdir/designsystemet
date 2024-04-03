import Image from 'next/image';
import type { SanityDocument } from 'next-sanity';

import { Container } from '../Container/Container';
import { Link } from '../Link/Link';
import { getUrl } from '../../sanity/lib/imageBuilder';

import classes from './Footer.module.css';

const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear();
};

type FooterProps = {
  data: SanityDocument[] | null;
};

const content = (column: SanityDocument) => {
  return (
    <div>
      {column._type == 'heading' && (
        <h2 className={classes.title}>{column.text}</h2>
      )}
      {column._type == 'image' && (
        <Image
          alt='Digdir logo'
          height={100}
          width={600}
          src={getUrl(column.image)}
        />
      )}
      {column._type == 'link' && (
        <Link
          className={classes.link}
          href={column.url}
        >
          {column.text}
        </Link>
      )}
    </div>
  );
};

export function Footer({ data }: FooterProps) {
  return (
    <footer className={classes.footer}>
      <div className={classes.top}>
        <Container className={classes.container}>
          <div>
            {data[0].column1.map((item, index) => (
              <div key={index}>{content(item)}</div>
            ))}
          </div>
          <div>
            {data[0].column2.map((item, index) => (
              <div key={index}>{content(item)}</div>
            ))}
          </div>
          <div>
            {data[0].column3.map((item, index) => (
              <div key={index}>{content(item)}</div>
            ))}
          </div>
        </Container>
      </div>
      <div className={classes.bottom}>
        <Container>© {getCurrentYear()} Designsystemet</Container>
      </div>
    </footer>
  );
}
