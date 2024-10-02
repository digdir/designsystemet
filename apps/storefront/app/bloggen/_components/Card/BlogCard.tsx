import {
  Card,
  CardBlock,
  Heading,
  Paragraph,
  Tag,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import Link from 'next/link';

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
      data-featured={featured}
      className={cl(classes.card, className)}
      {...props}
    >
      <CardBlock>
        <img src={image} alt='' className={classes.image} />
      </CardBlock>
      <CardBlock>
        {tagText && (
          <Tag className={classes.tag} color={tagColor} size='sm'>
            {tagText}
          </Tag>
        )}
        <Heading level={level} size={featured ? 'lg' : 'sm'}>
          <Link href={href}>{title}</Link>
        </Heading>
        <Paragraph size={featured ? 'lg' : 'sm'}>{desc}</Paragraph>
        <Paragraph size={featured ? 'md' : 'xs'} className={classes.meta}>
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
    </Card>
  );
};

export default BlogCard;
