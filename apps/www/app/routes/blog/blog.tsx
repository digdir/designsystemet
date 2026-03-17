import { BlogCard } from '~/_components/blog-card/blog-card';
import { getBlogPosts } from '~/_utils/config/get-blog-posts';
import { generateMetadata } from '~/_utils/metadata';
import i18nConf from '~/i18n';
import type { Route } from './+types/blog';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  if (!i18nConf.supportedLngs.includes(lang)) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return getBlogPosts(lang);
};

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData) return [{ title: 'Designsystemet' }];
  return generateMetadata(loaderData.metadata);
};

export const links: Route.LinksFunction = () => [
  ...i18nConf.supportedLngs.flatMap((lang) => [
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: `RSS - ${lang}`,
      href: `/${lang}/blog/feed.rss`,
      hrefLang: lang,
    },
    {
      rel: 'alternate',
      type: 'application/atom+xml',
      title: `Atom - ${lang}`,
      href: `/${lang}/blog/feed.atom`,
      hrefLang: lang,
    },
  ]),
];

export default function Blog({ loaderData: { posts } }: Route.ComponentProps) {
  return (
    <>
      {posts.map((post, index) => {
        return (
          <BlogCard
            key={post.url}
            title={post.title}
            desc={post.description}
            author={post.author}
            image={post.image.src}
            href={post.url}
            featured={index === 0}
            level={2}
          />
        );
      })}
    </>
  );
}
