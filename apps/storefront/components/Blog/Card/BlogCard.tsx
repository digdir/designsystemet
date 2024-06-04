/* eslint-disable @next/next/no-img-element */
import { Card, Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import Link from 'next/link';
import cl from 'clsx';

import classes from './BlogCard.module.css';

type BlogCardProps = {
  title: string;
  desc: string;
  author?: string;
  date?: string;
  image: string;
  href: string;
  featured?: boolean;
  tagText?: string;
  tagColor?: 'brand1' | 'brand2' | 'brand3';
  level?: 2 | 3;
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
  tagText,
  tagColor,
  level = 3,
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
            alt=''
            className={classes.image}
          />
        </Card.Media>
        <div className={classes.wrapper}>
          <Card.Header className={classes.heading}>
            {tagText && (
              <Tag
                className={classes.tag}
                color={tagColor}
                size='sm'
              >
                {tagText}
              </Tag>
            )}
            <Heading
              level={level}
              size={featured ? 'lg' : 'sm'}
            >
              {title}
            </Heading>
          </Card.Header>
          <Card.Content>
            <Paragraph size={featured ? 'lg' : 'sm'}>{desc}</Paragraph>
          </Card.Content>
          {author ||
            (date && (
              <Card.Footer className={classes.footer}>
                <Paragraph
                  size={featured ? 'md' : 'xs'}
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
            ))}
        </div>
      </Link>
    </Card>
  );
};

export default BlogCard;
