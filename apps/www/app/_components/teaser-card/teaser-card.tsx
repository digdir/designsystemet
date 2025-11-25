import { Card, Heading } from '@digdir/designsystemet-react';
import { Link } from 'react-router';
import { AvatarStack } from '~/_components/avatar-stack/avatar-stack';
import classes from './teaser-card.module.css';

interface TeaserCardProps {
  title: string;
  description?: string;
  author?: string;
  date?: string;
  href: string;
}

const TeaserCard = ({
  title,
  description,
  href,
  author,
  date,
}: TeaserCardProps) => {
  return (
    <Card className={classes.card} asChild>
      <article>
        <Heading level={3} data-size='sm' className={classes.title}>
          <Link to={href}>{title}</Link>
        </Heading>
        <p className={classes.desc}>{description}</p>
        {author && date && (
          <div className={classes.meta}>
            <AvatarStack authors={author} />
            <span>{author}</span>
            <span className={classes.seperator}>·</span>
            <span>{date}</span>
          </div>
        )}
      </article>
    </Card>
  );
};

export { TeaserCard };
