import type React from 'react';
import { Heading } from '@digdir/design-system-react';
import { PaletteIcon, WrenchIcon, ComponentIcon } from '@navikt/aksel-icons';
import cn from 'clsx';

import { NavigationCard, Container, ImageBanner, Section } from '@components';

import { BlogCard } from '@blog';

import classes from './FrontpageLayout.module.css';

type FrontpageLayoutProps = {
  content: React.ReactNode;
};

const FrontpageLayout = ({ content }: FrontpageLayoutProps) => {
  return (
    <main id='main'>
      <div>
        <img
          src='/img/elements/first.svg'
          alt='test'
          className={cn(classes.cluster, classes.cluster1, classes.clusterLeft)}
        />
        <img
          src='/img/elements/third.svg'
          alt='test'
          className={cn(
            classes.cluster,
            classes.cluster2,
            classes.clusterRight,
          )}
        />
        <img
          src='/img/elements/second.svg'
          alt='test'
          className={cn(classes.cluster, classes.cluster3, classes.clusterLeft)}
        />
        <img
          src='/img/elements/fourth.svg'
          alt='test'
          className={cn(
            classes.cluster,
            classes.cluster4,
            classes.clusterRight,
          )}
        />
        <img
          src='/img/elements/first.svg'
          alt='test'
          className={cn(classes.cluster, classes.cluster5, classes.clusterLeft)}
        />
      </div>
      <div className={classes.header}>
        <div className={classes.content}>
          <Container className={classes.container}>
            <div className={classes.test}>
              <Heading size='xlarge'>
                Designsystemet hjelper deg å lage gode digitale tjenester
              </Heading>
            </div>
            <div className={classes.cards}>
              <NavigationCard
                title='For designere'
                description='Lær hvordan du kommer i gang med designsystemet som designer.'
                color='blue'
                url='/grunnleggende/for-designere/kom-i-gang'
                icon={<PaletteIcon fontSize={36} />}
              ></NavigationCard>

              <NavigationCard
                title='For utviklere'
                description='Lær hvordan du kommer i gang med designsystemet som utvikler.'
                color='yellow'
                url='/grunnleggende/for-utviklere/kom-i-gang'
                icon={<WrenchIcon fontSize={36} />}
              ></NavigationCard>

              <NavigationCard
                title='Komponenter'
                description='Se oversikten over UI-komponentene som er laget i react.'
                color='red'
                url='https://storybook.designsystemet.no'
                icon={<ComponentIcon fontSize={34} />}
              ></NavigationCard>
            </div>
          </Container>
        </div>
      </div>

      <div className={classes.banners}>
        <ImageBanner
          title='Din digitale verktøykasse'
          description='The height he dragged would apartment, yourself not he in like he itch as arrives at then liabilities one by leather the facilitate day cost. As where instruments, spirit, are do. Violin, and it and bit a be refinement cut the through in allow eyes. The was a poured the also when open close.'
          imgSrc='/img/Toolbox.svg'
          headingLevel='h2'
          imgWidth={1195}
          imgHeight={270}
        />
        <ImageBanner
          title='Tilgjengelige komponenter'
          description='The height he dragged would apartment, yourself not he in like he itch as arrives at then liabilities one by leather the facilitate day cost. As where instruments, spirit, are do. Violin, and it and bit a be refinement cut the through in allow eyes. The was a poured the also when open close.'
          videoSrc='/animations/Page.mp4'
          imgPosition='right'
          headingLevel='h2'
          imgWidth={1195}
          imgHeight={270}
        />
        <ImageBanner
          title='Bruk ditt eget tema'
          description='The height he dragged would apartment, yourself not he in like he itch as arrives at then liabilities one by leather the facilitate day cost. As where instruments, spirit, are do. Violin, and it and bit a be refinement cut the through in allow eyes. The was a poured the also when open close.'
          videoSrc='/animations/Theme.mp4'
          headingLevel='h2'
          imgWidth={1195}
          imgHeight={270}
        />
      </div>
      <Section title='Ting i tiden'>
        <BlogCard
          title='Designsystemet er endelig ute av beta!'
          desc='lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
          href='/bloggen/dette-er-eit-navn'
          image='/img/bloggen/versjon1.png'
          featured={false}
          tagText='Bloggen'
          tagColor='first'
        />
        <BlogCard
          title='Derfor trenger vi et felles designsystem'
          desc='Høsten 2023 arrangerte vi en åpen presentasjon og mini-workshop om felles designsystem. Over 200 deltok og vi fikk 440 tilbakemeldinger på gevinster og utfordringer.'
          href='/bloggen/dette-er-eit-navn'
          image='/img/bloggen/miro.png'
          featured={false}
          tagText='Bloggen'
          tagColor='first'
        />
        <BlogCard
          title='Kompsisjon med asChild i React koden'
          desc='Nokre gonger må du kanskje byte ut ein komponent med ein anna, for eksempel Button skulle vore ein Link. Det er her asChild kjem inn i biletet.'
          href='/bloggen/dette-er-eit-navn'
          image='https://source.unsplash.com/random/1920x1080'
          featured={false}
          tagText='For utviklere'
          tagColor='second'
        />
      </Section>
    </main>
  );
};

export { FrontpageLayout };
