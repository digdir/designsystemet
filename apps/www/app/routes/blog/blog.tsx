import { Chip } from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BlogCard } from '~/_components/blog-card/blog-card';
import {
  type BlogCategory,
  blogCategories,
  isBlogCategory,
} from '~/_utils/blog-categories';
import { getBlogPosts } from '~/_utils/config/get-blog-posts';
import { generateMetadata } from '~/_utils/metadata';
import i18nConf from '~/i18n';
import type { Route } from './+types/blog';
import classes from './blog.module.css';

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

export const meta: Route.MetaFunction = ({ loaderData, location }) => {
  if (!loaderData) return [{ title: 'Designsystemet' }];
  return generateMetadata({
    ...loaderData.metadata,
    pathname: location.pathname,
  });
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

const CATEGORY_PARAM = 'category';

export default function Blog({ loaderData: { posts } }: Route.ComponentProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<BlogCategory[]>([]);

  /* The page is prerendered without search params, so we read them after
     hydration to avoid a hydration mismatch */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelected(params.getAll(CATEGORY_PARAM).filter(isBlogCategory));
  }, []);

  /* Only show chips for categories that have at least one post */
  const availableCategories = blogCategories.filter((category) =>
    posts.some((post) => post.categories.includes(category)),
  );

  const filteredPosts =
    selected.length === 0
      ? posts
      : posts.filter((post) =>
          post.categories.some((category) => selected.includes(category)),
        );

  const toggleCategory = (category: BlogCategory, checked: boolean) => {
    const next = blogCategories.filter((c) =>
      c === category ? checked : selected.includes(c),
    );
    setSelected(next);

    /* Keep the URL in sync so filtered views can be shared. We update history
       directly instead of navigating, so the page doesn't refetch data on every
       click. Router state is kept so back/forward and scroll restoration work. */
    const url = new URL(window.location.href);
    url.searchParams.delete(CATEGORY_PARAM);
    for (const c of next) url.searchParams.append(CATEGORY_PARAM, c);
    window.history.replaceState(window.history.state, '', url);
  };

  return (
    <>
      {availableCategories.length > 0 && (
        <fieldset className={classes.filter}>
          <legend className='ds-sr-only'>{t('blog.filter.legend')}</legend>
          {availableCategories.map((category) => (
            <Chip.Checkbox
              key={category}
              name={CATEGORY_PARAM}
              value={category}
              checked={selected.includes(category)}
              onChange={(event) =>
                toggleCategory(category, event.currentTarget.checked)
              }
            >
              {t(`blog.categories.${category}`)}
            </Chip.Checkbox>
          ))}
        </fieldset>
      )}
      {filteredPosts.map((post, index) => {
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
