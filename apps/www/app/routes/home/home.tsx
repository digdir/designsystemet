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
import BlogCard from '~/_components/blog-card/blog-card';
import { ContentContainer } from '~/_components/content-container/content-container';
import { ImageBanner } from '~/_components/image-banner/image-banner';
import { NavigationCard } from '~/_components/navigation-card/navigation-card';
import { Section } from '~/_components/section/section';
import { getFileFromContentDir, getFilesFromContentDir } from '~/_utils/files';
import type { Route } from './+types/home';
import classes from './home.module.css';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  /* Get all files in /content/bloggen for the lang we have selected */
  const files = getFilesFromContentDir(join('bloggen', lang));

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
      join('bloggen', lang, file.relativePath),
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

  return { lang, posts };
};

export default function Home({
  loaderData: { posts, lang },
}: Route.ComponentProps) {
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
                Designsystemet hjelper deg å lage gode digitale tjenester
              </Heading>
            </div>
            <div className={classes.cards}>
              <NavigationCard
                title='For designere'
                description='Lær hvordan du kommer i gang med designsystemet som designer.'
                color='blue'
                url='grunnleggende/for-designere/kom-i-gang'
                icon={<PaletteIcon fontSize={36} aria-hidden='true' />}
                level={2}
              />

              <NavigationCard
                title='For utviklere'
                description='Lær hvordan du kommer i gang med designsystemet som utvikler.'
                color='yellow'
                url='grunnleggende/for-utviklere/kom-i-gang'
                icon={<WrenchIcon fontSize={36} aria-hidden='true' />}
                level={2}
              />

              <NavigationCard
                title='Komponenter'
                description='Se oversikten over UI-komponentene som er laget i react.'
                color='red'
                url='komponenter'
                icon={<ComponentIcon fontSize={34} aria-hidden='true' />}
                level={2}
              />
            </div>
          </ContentContainer>
        </div>
      </div>

      <ImageBanner
        title='En felles digital verktøykasse'
        description='Designsystemet er en felles verktøykasse med grunnleggende UI-komponenter, retningslinjer og mønstre, som du kan bruke når du utvikler digitale tjenester. Designsystemet bidrar til effektiv produktutvikling og helhetlige brukeropplevelser.'
        imgSrc='/img/Toolbox.svg'
        headingLevel='h2'
        imgWidth='1195'
        link={{
          text: 'Les mer om designsystemet',
          href: '/grunnleggende/introduksjon/om-designsystemet',
        }}
      />

      <ImageBanner
        title='Tilgjengelige og fleksible komponenter'
        description='Når vi lager de mest grunnleggende komponentene bare én gang, sikrer vi god kvalitet. Komponenten blir godt testet, og vi ivaretar kravene til tilgjengelighet. Komponentene er laget i Figma og i React. Du kan sette dem sammen på mange ulike måter og i forskjellige mønstre. '
        videoSrc='/animations/Page'
        imgPosition='right'
        headingLevel='h2'
        imgWidth='1195'
        fallbackImgSrc='/img/reduced-motion/Page.png'
        fallbackImgAlt='Designskisse av en mobiltelefon som har komponenter fra designsystemet i seg.'
      />

      <ImageBanner
        title='Bruk egne tema'
        description='Designsystemet støtter ulike identiteter gjennom tema. På denne måten kan alle ta utgangspunkt i samme designsystem, men tilpasse til ulike avsenderidentiteter.'
        videoSrc='/animations/Theme'
        headingLevel='h2'
        imgWidth='1195'
        fallbackImgSrc='/img/reduced-motion/Theme.png'
        fallbackImgAlt='Designskisse av en nettside som viser hvordan designsystemet kan tilpasses ulike identiteter.'
      />

      <Section
        title='Siste nytt fra designsystemet'
        style={{
          gridTemplateColumns: 'repeat(3, minmax(min(100%, 320px), 1fr))',
        }}
      >
        {posts.map((post) => (
          <BlogCard
            key={post.url}
            title={post.title}
            desc={post.description}
            author={post.author}
            href={`bloggen/${post.url}`}
            image={post.image.src}
            tagText='Bloggen'
            tagColor='brand1'
            date={post.date}
          />
        ))}
      </Section>
      <ImageBanner
        title='Bli med å utvikle designsystemet!'
        description='Ved å samarbeide om designsystemet kan vi lage mer helhetlige brukeropplevelser på tvers av offentlig sektor. Samtidig sparer vi oss for å gjøre de samme oppgavene flere ganger. Designsystemet  skal være et felles hjem for gjenbrukbare komponenter, god praksis, interaksjonsmønstre, brukerdialog, innsikt og mer. Vil du høre mer eller hjelpe? Ta kontakt med oss!'
        imgSrc='/img/Logotest.svg'
        headingLevel='h2'
        imgWidth='small'
        className='ds-logo-image'
        buttons={[
          {
            text: 'Bli med på Slack',
            href: '/slack',
            prefix: <PersonChatIcon fontSize={24} aria-hidden='true' />,
            variant: 'primary',
          },
          {
            text: 'Bidra på GitHub',
            href: 'https://github.com/digdir/designsystemet',
            prefix: <BranchingIcon fontSize={24} aria-hidden='true' />,
          },
          {
            text: 'Send en epost',
            href: 'mailto:designsystem@digdir.no',
            prefix: <EnvelopeClosedIcon fontSize={24} aria-hidden='true' />,
          },
        ]}
      />
    </>
  );
}
