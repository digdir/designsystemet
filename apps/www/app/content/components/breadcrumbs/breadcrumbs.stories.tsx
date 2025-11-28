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

export const PreviewEn = () => (
  <>
    <Breadcrumbs aria-label='You are here:'>
      <Breadcrumbs.Link href='#' aria-label='Back to Level 3'>
        Level 3
      </Breadcrumbs.Link>
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Level 1</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Level 2</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Level 3</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href='#'>Level 4</Breadcrumbs.Link>
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

export const ListOnlyEn = () => (
  <Breadcrumbs aria-label='You are here:'>
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Level 1</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Level 2</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Level 3</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Level 4</Breadcrumbs.Link>
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

export const BackOnlyEn = () => (
  <Breadcrumbs>
    <Breadcrumbs.Link href='#' aria-label='Back to Level 3'>
      Level 3
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

export const LongItemsEn = () => (
  <Breadcrumbs>
    <Breadcrumbs.Link
      href='#'
      aria-label='Back to health certificate for seafood'
    >
      How to apply for a health certificate for seafood
    </Breadcrumbs.Link>
    <Breadcrumbs.List aria-label='You are here:'>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Home</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>
          Export to countries outside the EU/EEA
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Export of food and drink</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Export of fish and seafood</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>
          Guidance on health certificates for seafood
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>
          How to apply for a health certificate for seafood
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>
          How to apply for a health certificate in the new export solution
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

export const MobileViewportEn = () => (
  <Breadcrumbs aria-label='You are here:'>
    <Breadcrumbs.Link href='#' aria-label='Back to Level 3'>
      Level 3
    </Breadcrumbs.Link>
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Level 1</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Level 2</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Level 3</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href='#'>Level 4</Breadcrumbs.Link>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs>
);
