import { Breadcrumbs } from '@digdir/designsystemet-react';

export const Preview = () => (
  <>
    <Breadcrumbs aria-label='Du er her:'>
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

export const ListOnly = () => (
  <Breadcrumbs aria-label='Du er her:'>
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

export const BackOnly = () => (
  <Breadcrumbs>
    <Breadcrumbs.Link href='#' aria-label='Tilbake til Nivå 3'>
      Nivå 3
    </Breadcrumbs.Link>
  </Breadcrumbs>
);

export const LongItems = () => (
  <Breadcrumbs>
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

export const MobileViewport = () => (
  <Breadcrumbs aria-label='Du er her:'>
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
