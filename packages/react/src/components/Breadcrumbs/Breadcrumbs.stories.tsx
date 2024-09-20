import type { Meta, StoryFn } from '@storybook/react';

import { Breadcrumbs } from '.';

export default {
  title: 'Komponenter/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    size: 'md',
  },
} as Meta;

export const Preview: StoryFn<typeof Breadcrumbs> = (args) => (
  <>
    <Breadcrumbs aria-label='Du er her:' {...args}>
      <Breadcrumbs.Link href='#' aria-label='Tilbake til Nivå 3'>
        Nivå 3
      </Breadcrumbs.Link>
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Nivå 1</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Nivå 2</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Nivå 3</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Nivå 4</Breadcrumbs.Link>
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  </>
);

export const ListOnly: StoryFn<typeof Breadcrumbs> = (args) => (
  <Breadcrumbs aria-label='Du er her:' size='md'>
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Nivå 1</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Nivå 2</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Nivå 3</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Nivå 4</Breadcrumbs.Link>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs>
);

export const BackOnly: StoryFn<typeof Breadcrumbs> = (args) => (
  <Breadcrumbs>
    <Breadcrumbs.Link href='#' aria-label='Tilbake til Nivå 3'>
      Nivå 3
    </Breadcrumbs.Link>
  </Breadcrumbs>
);

export const LongItems: StoryFn<typeof Breadcrumbs> = (args) => (
  <Breadcrumbs {...args}>
    <Breadcrumbs.Link
      href='#'
      aria-label='Tilbake til helsesertifikat for sjømat'
    >
      Slik søker du om helsesertifikat for sjømat
    </Breadcrumbs.Link>
    <Breadcrumbs.List aria-label='Du er her:'>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Hjem</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>
          Eksport til land utenfor EU/EØS
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Eksport av mat og drikke</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Eksport av fisk og sjømat</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>
          Veiledning om helsesertifikat for sjømat
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>
          Slik søker du om helsesertifikat for sjømat
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>
          Slik søker du om helsesertifikat i ny eksportløsning
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs>
);

export const MobileViewport: StoryFn<typeof Breadcrumbs> = (args) => (
  <Breadcrumbs aria-label='Du er her:' {...args}>
    <Breadcrumbs.Link href='#' aria-label='Tilbake til Nivå 3'>
      Nivå 3
    </Breadcrumbs.Link>
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Nivå 1</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Nivå 2</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Nivå 3</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Nivå 4</Breadcrumbs.Link>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs>
);

MobileViewport.parameters = {
  viewport: {
    defaultViewport: '375px', // Large mobile default viewport
  },
};
