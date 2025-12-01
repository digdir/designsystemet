import { join } from 'node:path';
import { Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import {
  BranchingIcon,
  ComponentIcon,
  EnvelopeClosedIcon,
  PaletteIcon,
  PersonChatIcon,
  WrenchIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { bundleMDX } from 'mdx-bundler';
import { useTranslation } from 'react-i18next';
import BlogCard from '~/_components/blog-card/blog-card';
import { ImageBanner } from '~/_components/image-banner/image-banner';
import { Bronnoysund } from '~/_components/logos/bronnoysund';
import { Digdir } from '~/_components/logos/digdir';
import { KsDigital } from '~/_components/logos/ks-digital';
import { Mattilsynet } from '~/_components/logos/mattilsynet';
import { Udir } from '~/_components/logos/udir';
import { NavigationCard } from '~/_components/navigation-card/navigation-card';
import { Section } from '~/_components/section/section';
import {
  getFileFromContentDir,
  getFilesFromContentDir,
} from '~/_utils/files.server';
import { generateMetadata } from '~/_utils/metadata';
import i18nConf from '~/i18n';
import i18n from '~/i18next.server';
import type { Route } from './+types/home';
import classes from './home.module.css';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!i18nConf.supportedLngs.includes(lang)) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

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

export const meta: Route.MetaFunction = ({ data }: Route.MetaArgs) => {
  if (!data) {
    return [
      {
        title: 'Designsystemet',
      },
    ];
  }
  return data.metadata;
};

export default function Home({ loaderData: { posts } }: Route.ComponentProps) {
  const { t } = useTranslation();

  return (
    <div className={classes.mainContainer}>
      <div className={classes.header}>
        <div
          className={classes.content}
          /* We need this for firefox, because it focuses anything with overflow: hidden */
          tabIndex={-1}
        >
          <div className={cl('l-content-container', classes.container)}>
            <img
              className={classes.decoration}
              src='img/elements/second.svg'
              alt=''
              data-variant='1'
            />
            <img
              className={classes.decoration}
              src='img/elements/third.svg'
              alt=''
              data-variant='2'
            />
            <div className={classes.text}>
              <Heading data-size='lg' level={1}>
                {t('frontpage.heading')}
              </Heading>
            </div>
            <div className={classes.cards}>
              <NavigationCard
                title={t('frontpage.get-started.title')}
                description={t('frontpage.get-started.description')}
                color='blue'
                url='fundamentals/introduction/get-started'
                icon={<PaletteIcon fontSize={36} aria-hidden='true' />}
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

              <NavigationCard
                title={t('frontpage.patterns.title')}
                description={t('frontpage.patterns.description')}
                color='yellow'
                url='patterns'
                icon={<WrenchIcon fontSize={36} aria-hidden='true' />}
                level={2}
              />
            </div>
          </div>
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
      >
        <img
          className={classes.decoration}
          src='img/elements/second.svg'
          style={{ rotate: '90deg' }}
          alt=''
          data-variant='3'
        />
      </ImageBanner>

      <ImageBanner
        title={t('frontpage.components-section.title')}
        description={t('frontpage.components-section.description')}
        videoSrc='/animations/Page'
        imgPosition='right'
        headingLevel='h2'
        imgWidth='1195'
        link={{
          text: t('frontpage.components-section.link'),
          href: 'fundamentals/introduction/accessibility',
        }}
        fallbackImgSrc='/img/reduced-motion/Page.png'
        fallbackImgAlt={t('frontpage.components-section.fallbackImgAlt')}
      >
        <img
          className={classes.decoration}
          src='img/elements/fourth.svg'
          alt=''
          data-variant='4'
        />
      </ImageBanner>

      <ImageBanner
        title={t('frontpage.theme-section.title')}
        description={t('frontpage.theme-section.description')}
        videoSrc='/animations/Theme'
        headingLevel='h2'
        imgWidth='1195'
        link={{
          text: t('frontpage.theme-section.link'),
          href: 'http://theme.designsystemet.no',
        }}
        fallbackImgSrc='/img/reduced-motion/Theme.png'
        fallbackImgAlt={t('frontpage.theme-section.fallbackImgAlt')}
      >
        <img
          className={classes.decoration}
          src='img/elements/first.svg'
          alt=''
          data-variant='5'
        />
      </ImageBanner>

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
      <div className='l-content-container'>
        <div className={classes.collaborators}>
          <Heading level={2} data-size='md'>
            {t('frontpage.collaborators-section.title')}
          </Heading>
          <Paragraph>
            {t('frontpage.collaborators-section.description')}
          </Paragraph>
          <div data-logos>
            <span data-digdir>
              <Digdir aria-label='Digitaliseringsdirektoratet' />
            </span>
            <span>
              <Mattilsynet aria-label='Mattilsynet' />
            </span>
            <span>
              <KsDigital aria-label='KS Digital' />
            </span>
            <span>
              <Udir aria-label='Utdanningsdirektoratet' />
            </span>
            <span data-span-2>
              <Bronnoysund aria-label='Brønnøysundregistrene' />
            </span>
          </div>
        </div>
        <div className={classes.joinCard}>
          <img src='/img/Logotest.svg' alt='' />
          <div>
            <Heading level={2} data-size='md'>
              {t('frontpage.join-section.title')}
            </Heading>
            <Paragraph data-size='md'>
              {t('frontpage.join-section.description')}
            </Paragraph>
            <div data-links>
              <Link href='/slack'>
                <span>
                  <PersonChatIcon fontSize={24} aria-hidden='true' />
                </span>

                {t('frontpage.join-section.buttons.slack')}
              </Link>
              <Link href='https://github.com/digdir/designsystemet'>
                <span>
                  <BranchingIcon fontSize={24} aria-hidden='true' />
                </span>
                {t('frontpage.join-section.buttons.github')}
              </Link>
              <Link href='mailto:designsystem@digdir.no'>
                <span>
                  <EnvelopeClosedIcon fontSize={24} aria-hidden='true' />
                </span>
                {t('frontpage.join-section.buttons.email')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
