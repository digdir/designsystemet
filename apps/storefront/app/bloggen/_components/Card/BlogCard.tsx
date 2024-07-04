import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardMedia,
  Heading,
  Paragraph,
  Tag,
} from '@digdir/designsystemet-react';
import Link from 'next/link';
import cl from 'clsx/lite';

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
        <CardMedia className={classes.media}>
          <img
            src={image}
            alt=''
            className={classes.image}
          />
        </CardMedia>
        <div className={classes.wrapper}>
          <CardHeader className={classes.heading}>
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
          </CardHeader>
          <CardContent>
            <Paragraph size={featured ? 'lg' : 'sm'}>{desc}</Paragraph>
          </CardContent>
          {author ||
            (date && (
              <CardFooter className={classes.footer}>
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
              </CardFooter>
            ))}
        </div>
      </Link>
    </Card>
  );
};

export default BlogCard;
