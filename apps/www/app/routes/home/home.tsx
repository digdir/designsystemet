import { join } from 'node:path';
import { Heading } from '@digdir/designsystemet-react';
import {
  BranchingIcon,
  ComponentIcon,
  EnvelopeClosedIcon,
  PaletteIcon,
  PersonChatIcon,
  WrenchIcon,
} from '@navikt/aksel-icons';
import { bundleMDX } from 'mdx-bundler';
import { useTranslation } from 'react-i18next';
import BlogCard from '~/_components/blog-card/blog-card';
import { ContentContainer } from '~/_components/content-container/content-container';
import { ImageBanner } from '~/_components/image-banner/image-banner';
import { NavigationCard } from '~/_components/navigation-card/navigation-card';
import { Section } from '~/_components/section/section';
import { getFileFromContentDir, getFilesFromContentDir } from '~/_utils/files';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import type { Route } from './+types/home';
import classes from './home.module.css';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  /* Get all files in /content/blog for the lang we have selected */
  const files = getFilesFromContentDir(join('blog', lang));

  /* Filter out files that are not .mdx */
  const mdxFiles = files.filter((file) => file.relativePath.endsWith('.mdx'));

  /* Get titles and URLs for all files */
  const posts: {
    title: string;
    author: string;
    description: string;
    url: string;
    date: string;
    image: {
      src: string;
      alt: string;
    };
  }[] = [];

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = getFileFromContentDir(
      join('blog', lang, file.relativePath),
    );
    const result = await bundleMDX({
      source: fileContent,
    });

    const title =
      result.frontmatter.title || file.relativePath.replace('.mdx', '');
    const url = file.relativePath.replace('.mdx', '');
    posts.push({
      title,
      author: result.frontmatter.author || 'Unknown Author',
      description: result.frontmatter.description || 'No description available',
      url,
      date: result.frontmatter.date || '2000-01-01',
      image: {
        src: result.frontmatter.imageSrc || '',
        alt: result.frontmatter.imageAlt || '',
      },
    });
  }

  /* Sort posts by date */
  posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  /* Get last 3 posts */
  posts.splice(3);

  const t = await i18n.getFixedT(lang);

  return {
    lang,
    posts,
    metadata: generateMetadata({
      title: t('frontpage.meta.title'),
      description: t('frontpage.meta.description'),
    }),
  };
};

export const meta: Route.MetaFunction = ({
  data: { metadata },
}: Route.MetaArgs) => {
  return metadata;
};

export default function Home({ loaderData: { posts } }: Route.ComponentProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className={classes.header}>
        <div
          className={classes.content}
          /* We need this for firefox, because it focuses anything with overflow: hidden */
          tabIndex={-1}
        >
          <ContentContainer className={classes.container}>
            <div className={classes.text}>
              <Heading data-size='lg' level={1}>
                {t('frontpage.heading')}
              </Heading>
            </div>
            <div className={classes.cards}>
              <NavigationCard
                title={t('frontpage.for-designers.title')}
                description={t('frontpage.for-designers.description')}
                color='blue'
                url='fundamentals/for-designers/get-started'
                icon={<PaletteIcon fontSize={36} aria-hidden='true' />}
                level={2}
              />

              <NavigationCard
                title={t('frontpage.for-developers.title')}
                description={t('frontpage.for-developers.description')}
                color='yellow'
                url='fundamentals/for-developers/get-started'
                icon={<WrenchIcon fontSize={36} aria-hidden='true' />}
                level={2}
              />

              <NavigationCard
                title={t('frontpage.components.title')}
                description={t('frontpage.components.description')}
                color='red'
                url='components'
                icon={<ComponentIcon fontSize={34} aria-hidden='true' />}
                level={2}
              />
            </div>
          </ContentContainer>
        </div>
      </div>

      <ImageBanner
        title={t('frontpage.toolbox.title')}
        description={t('frontpage.toolbox.description')}
        imgSrc='/img/Toolbox.svg'
        headingLevel='h2'
        imgWidth='1195'
        link={{
          text: t('frontpage.toolbox.link'),
          href: 'fundamentals/introduction/about-the-design-system',
        }}
      />

      <ImageBanner
        title={t('frontpage.components-section.title')}
        description={t('frontpage.components-section.description')}
        videoSrc='/animations/Page'
        imgPosition='right'
        headingLevel='h2'
        imgWidth='1195'
        fallbackImgSrc='/img/reduced-motion/Page.png'
        fallbackImgAlt={t('frontpage.components-section.fallbackImgAlt')}
      />

      <ImageBanner
        title={t('frontpage.theme-section.title')}
        description={t('frontpage.theme-section.description')}
        videoSrc='/animations/Theme'
        headingLevel='h2'
        imgWidth='1195'
        fallbackImgSrc='/img/reduced-motion/Theme.png'
        fallbackImgAlt={t('frontpage.theme-section.fallbackImgAlt')}
      />

      <Section title={t('frontpage.latest-news.title')}>
        {posts.map((post) => (
          <BlogCard
            key={post.url}
            title={post.title}
            desc={post.description}
            author={post.author}
            href={`blog/${post.url}`}
            image={post.image.src}
            tagText={t('blog.tag')}
            tagColor='brand1'
            date={post.date}
          />
        ))}
      </Section>
      <ImageBanner
        title={t('frontpage.join-section.title')}
        description={t('frontpage.join-section.description')}
        imgSrc='/img/Logotest.svg'
        headingLevel='h2'
        imgWidth='small'
        className='ds-logo-image'
        buttons={[
          {
            text: t('frontpage.join-section.buttons.slack'),
            href: '/slack',
            prefix: <PersonChatIcon fontSize={24} aria-hidden='true' />,
            variant: 'primary',
          },
          {
            text: t('frontpage.join-section.buttons.github'),
            href: 'https://github.com/digdir/designsystemet',
            prefix: <BranchingIcon fontSize={24} aria-hidden='true' />,
          },
          {
            text: t('frontpage.join-section.buttons.email'),
            href: 'mailto:designsystem@digdir.no',
            prefix: <EnvelopeClosedIcon fontSize={24} aria-hidden='true' />,
          },
        ]}
      />
    </>
  );
}
