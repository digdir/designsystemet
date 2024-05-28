import Link from 'next/link';

import classes from './TeaserCard.module.css';

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
    <Link
      className={classes.card}
      href={href}
      prefetch={false}
    >
      <h3 className={classes.title}>{title}</h3>
      <p className={classes.desc}>{description}</p>
      {author && date && (
        <div className={classes.meta}>
          <span className={classes.author}>{author}</span>
          <span className={classes.date}>{date}</span>
        </div>
      )}
    </Link>
  );
};

export { TeaserCard };
