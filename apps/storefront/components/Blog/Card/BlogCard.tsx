import { Card, Heading, Paragraph } from '@digdir/design-system-react';
import Link from 'next/link';
import cl from 'clsx';

import classes from './BlogCard.module.css';

type BlogCardProps = {
  title: string;
  desc: string;
  author: string;
  date: string;
  image: string;
  href: string;
  featured?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const BlogCard = ({
  title,
  desc,
  author,
  image,
  href,
  date,
  featured = false,
  className,
  ...props
}: BlogCardProps) => {
  return (
    <Card
      color='neutral'
      asChild
      isLink
      data-featured={featured}
      className={cl(
        classes.card,
        {
          [classes.featured]: featured,
        },
        className,
      )}
      {...props}
    >
      <Link href={href}>
        <Card.Media className={classes.media}>
          <img
            src={image}
            alt={title}
            className={classes.image}
          />
        </Card.Media>
        <div className={classes.wrapper}>
          <Card.Header className={classes.header}>
            <Heading size='small'>{title}</Heading>
          </Card.Header>
          <Card.Content className={classes.content}>{desc}</Card.Content>
          <Card.Footer className={classes.footer}>
            <Paragraph size='small'>
              {date} - {author}
            </Paragraph>
          </Card.Footer>
        </div>
      </Link>
    </Card>
  );
};

export default BlogCard;
