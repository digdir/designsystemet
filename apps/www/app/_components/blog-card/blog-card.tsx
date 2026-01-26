import {
  Card,
  CardBlock,
  type CardProps,
  Heading,
  Paragraph,
  Tag,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { Link } from 'react-router';
import { AvatarStack } from '~/_components/avatar-stack/avatar-stack';
import classes from './blog-card.module.css';

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
} & Omit<CardProps, 'color' | 'children'>;

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
      data-featured={featured}
      className={cl(classes.card, className)}
      data-color='neutral'
      asChild
      {...props}
    >
      <article>
        <CardBlock>
          <img src={image} alt='' className={classes.image} />
        </CardBlock>
        <CardBlock>
          {tagText && (
            <Tag className={classes.tag} data-color={tagColor} data-size='sm'>
              {tagText}
            </Tag>
          )}
          <Heading
            className={classes.heading}
            level={level}
            data-size={featured ? 'md' : 'xs'}
          >
            <Link to={href}>{title}</Link>
          </Heading>
          <Paragraph data-size={featured ? 'md' : 'sm'}>{desc}</Paragraph>
          <Paragraph data-size={'md'} className={classes.meta}>
            <AvatarStack authors={author || ''} />
            {author ||
              (date && (
                <>
                  <span>{date}</span>
                  {author && (
                    <>
                      <span aria-hidden className={classes.metaSquare} />
                      <span>{author}</span>
                    </>
                  )}
                </>
              ))}
          </Paragraph>
        </CardBlock>
      </article>
    </Card>
  );
};

export default BlogCard;
