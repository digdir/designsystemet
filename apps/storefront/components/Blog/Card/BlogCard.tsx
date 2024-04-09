import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import cl from 'clsx';

import classes from './BlogCard.module.css';

type BlogCardProps = {
  title: string;
  desc: string;
  author?: string;
  date: string;
  image: string;
  href: string;
  featured?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>;

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
      asChild
      isLink
      data-featured={featured}
      className={cl(classes.card, className)}
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
          <Card.Header className={classes.heading}>
            <Heading size={featured ? 'large' : 'small'}>{title}</Heading>
          </Card.Header>
          <Card.Content>
            <Paragraph size={featured ? 'large' : 'small'}>{desc}</Paragraph>
          </Card.Content>
          <Card.Footer className={classes.footer}>
            <Paragraph
              size={featured ? 'medium' : 'small'}
              className={classes.meta}
            >
              <span>{date}</span>
              {author && (
                <>
                  <span
                    aria-hidden
                    className={classes.metaSquare}
                  />
                  <span>{author}</span>
                </>
              )}
            </Paragraph>
          </Card.Footer>
        </div>
      </Link>
    </Card>
  );
};

export default BlogCard;
