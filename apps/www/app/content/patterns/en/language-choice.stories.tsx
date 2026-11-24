import {
  Avatar,
  Button,
  Divider,
  Dropdown,
} from '@digdir/designsystemet-react';
import {
  CheckmarkIcon,
  ChevronDownIcon,
  LanguageIcon,
  MagnifyingGlassIcon,
  MenuHamburgerIcon,
  XMarkIcon,
} from '@navikt/aksel-icons';
import { useState } from 'react';

export const LanguageChoiceInHeader = () => {
  const [languageOpen, setLanguageOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const languages = [
    { code: 'nb', name: 'Bokmål (norsk)', current: true },
    { code: 'nn', name: 'Nynorsk (norsk)' },
    { code: 'en', name: 'English' },
    { code: 'se', name: 'Davvisámegiella' },
  ];

  const languageLinks = languages.map(({ code, name, current }) => (
    <Dropdown.Item key={code}>
      <Dropdown.Button asChild>
        <a
          href={`/${code}/`}
          lang={code}
          hrefLang={code}
          aria-current={current ? 'true' : undefined}
        >
          <CheckmarkIcon
            aria-hidden
            style={{ visibility: current ? 'visible' : 'hidden' }}
          />
          {name}
        </a>
      </Dropdown.Button>
    </Dropdown.Item>
  ));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-8)',
        width: '100%',
        containerType: 'inline-size',
      }}
    >
      <style>{`
        .page-header {
          display: grid;
          grid-template-columns: 1fr auto auto auto auto;
          grid-template-areas: 'logo search language profile menu';
          align-items: center;
          gap: var(--ds-size-2);
        }
        .page-header-logo { grid-area: logo; }
        .page-header-search { grid-area: search; }
        .page-header-language { grid-area: language; }
        .page-header-profile { grid-area: profile; }
        .page-header-menu { grid-area: menu; }

        .page-menu {
          display: grid;
          gap: var(--ds-size-2);
          margin-top: var(--ds-size-4);
        }
        .page-menu[hidden] { display: none; }
        .page-menu ul {
          display: grid;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .page-menu .ds-button {
          width: 100%;
          justify-content: flex-start;
        }
        .page-menu-heading {
          display: flex;
          align-items: center;
          gap: var(--ds-size-2);
          margin: 0;
          padding: var(--ds-size-2) var(--ds-size-4);
          font-weight: 500;
        }
        .page-menu-narrow { display: none; }

        /* Not enough room: move the profile to its own line */
        @container (width < 42rem) {
          .page-header {
            grid-template-columns: 1fr auto auto auto;
            grid-template-areas:
              'logo search language menu'
              'profile profile profile profile';
          }
          .page-header-profile {
            width: 100%;
            justify-content: flex-start;
          }
          .page-header-profile > svg { margin-inline-start: auto; }
        }

        /* Even less room: move search and language into the menu */
        @container (width < 30rem) {
          .page-header {
            grid-template-columns: 1fr auto;
            grid-template-areas:
              'logo menu'
              'profile profile';
          }
          .page-header-search,
          .page-header-language,
          .page-header-language-dropdown { display: none; }
          .page-menu-narrow { display: contents; }
        }
      `}</style>
      <header data-size='sm'>
        <div className='page-header'>
          <span
            className='page-header-logo'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ds-size-2)',
              fontWeight: 500,
            }}
          >
            <svg
              aria-hidden
              width='1.5em'
              height='1.5em'
              viewBox='0 0 102 102'
              fill='currentColor'
            >
              <path d='M78.1 30.56a2.44 2.44 0 0 1 3.45 0l18.72 18.71a2.44 2.44 0 0 1 0 3.46L81.55 71.45a2.44 2.44 0 0 1-3.45 0L59.38 52.73a2.44 2.44 0 0 1 0-3.46z' />
              <rect
                x='51'
                y='57.66'
                width='31.36'
                height='31.36'
                rx='2.44'
                transform='rotate(45 51 57.66)'
              />
              <rect
                x='22.18'
                y='28.83'
                width='31.36'
                height='31.36'
                rx='2.44'
                transform='rotate(45 22.18 28.83)'
              />
              <rect
                x='51'
                width='31.36'
                height='31.36'
                rx='2.44'
                transform='rotate(45 51 0)'
              />
            </svg>
            Avsender
          </span>
          <Button variant='secondary' className='page-header-search'>
            <MagnifyingGlassIcon aria-hidden />
            Søk
          </Button>
          <Dropdown.TriggerContext>
            <Dropdown.Trigger
              variant='tertiary'
              className='page-header-language'
              style={{
                background: languageOpen
                  ? 'var(--dsc-button-background--hover)'
                  : undefined,
              }}
            >
              <LanguageIcon aria-hidden />
              Language
            </Dropdown.Trigger>
            <Dropdown
              className='page-header-language-dropdown'
              placement='bottom-start'
              open={languageOpen}
              onOpen={() => setLanguageOpen(true)}
              onClose={() => setLanguageOpen(false)}
            >
              <Dropdown.List>{languageLinks}</Dropdown.List>
            </Dropdown>
          </Dropdown.TriggerContext>
          <Button
            variant='secondary'
            className='page-header-profile'
            style={{
              padding: 0,
              paddingInlineEnd: 'var(--ds-size-3)',
              overflow: 'hidden',
              background: 'var(--ds-color-surface-tinted)',
            }}
          >
            <Avatar
              aria-hidden
              variant='square'
              initials='Ka'
              style={{ width: '2.5rem', height: '2.5rem', borderRadius: 0 }}
            />
            Kari Nordmann
            <ChevronDownIcon aria-hidden />
          </Button>
          <Button
            variant='secondary'
            className='page-header-menu'
            aria-expanded={menuOpen}
            aria-controls='page-menu'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <XMarkIcon aria-hidden />
            ) : (
              <MenuHamburgerIcon aria-hidden />
            )}
            Meny
          </Button>
        </div>
        <nav
          id='page-menu'
          aria-label='Meny'
          className='page-menu'
          hidden={!menuOpen}
        >
          <div className='page-menu-narrow'>
            <Button variant='tertiary'>
              <MagnifyingGlassIcon aria-hidden />
              Søk
            </Button>
            <Divider />
            <p className='page-menu-heading'>
              <LanguageIcon aria-hidden />
              Language
            </p>
            <ul>{languageLinks}</ul>
            <Divider />
          </div>
          <ul>
            <li>
              <Button variant='tertiary' asChild>
                <a href='#'>Tjenester</a>
              </Button>
            </li>
            <li>
              <Button variant='tertiary' asChild>
                <a href='#'>Om oss</a>
              </Button>
            </li>
          </ul>
        </nav>
      </header>
      <main
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: '12rem',
          background: 'var(--ds-color-neutral-background-tinted)',
          color: 'var(--ds-color-neutral-surface-active)',
          fontSize: '4rem',
        }}
      >
        Innhold
      </main>
    </div>
  );
};
