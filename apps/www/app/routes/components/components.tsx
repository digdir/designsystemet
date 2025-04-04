import { ComponentFillIcon } from '@navikt/aksel-icons';
import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '~/_components/banner/banner';
import { ComponentCard } from '~/_components/component-card/component-card';
import { ContentContainer } from '~/_components/content-container/content-container';
import { data } from '~/content/components';
import classes from './components.module.css';

const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));

const IS_NEXT_BRANCH = false;

/* If we are in the next branch, send us to the next storybook */
if (IS_NEXT_BRANCH) {
  for (const component of sortedData) {
    component.url = component.url.replace(
      'storybook.designsystemet.no',
      'next.storybook.designsystemet.no',
    );
  }
}

export default function Components() {
  return (
    <>
      <Banner color='blue'>
        <BannerIcon>
          <ComponentFillIcon />
        </BannerIcon>
        <BannerHeading level={1}>Komponenter</BannerHeading>
        <BannerIngress>
          Designsystemet inneholder grunnleggende komponenter som kan settes
          sammen på mange ulike måter og i forskjellige mønstre.
        </BannerIngress>
      </Banner>
      <ContentContainer className={classes.grid}>
        {sortedData.map((component) => (
          <ComponentCard key={component.title} {...component} />
        ))}
      </ContentContainer>
    </>
  );
}
