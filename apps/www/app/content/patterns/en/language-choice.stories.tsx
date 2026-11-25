import {
  Alert,
  Avatar,
  Button,
  Card,
  Dialog,
  Divider,
  Dropdown,
  Field,
  Heading,
  Input,
  Label,
  Link,
  Paragraph,
  ToggleGroup,
  Tooltip,
} from '@digdir/designsystemet-react';
import {
  CheckmarkIcon,
  ChevronDownIcon,
  LanguageIcon,
  LaptopIcon,
  MagnifyingGlassIcon,
  MenuHamburgerIcon,
  MoonIcon,
  SunIcon,
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
          onClick={(event) => event.preventDefault()}
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
          grid-template-columns: 1fr auto auto auto;
          grid-template-areas:
            'logo language profile menu'
            'nav nav nav nav';
          align-items: center;
          column-gap: var(--ds-size-3);
        }
        .page-header-logo { grid-area: logo; }
        .page-header-language { grid-area: language; }
        .page-header-profile { grid-area: profile; }
        .page-header-menu { grid-area: menu; }

        .page-menu {
          grid-area: nav;
          position: relative;
          display: grid;
          gap: var(--ds-size-2);
          margin-top: var(--ds-size-4);
          padding: var(--ds-size-4);
          border-radius: var(--ds-border-radius-lg);
          background: var(--ds-color-neutral-surface-tinted);
        }
        /* Arrow pointing up at the menu button */
        .page-menu::before {
          content: '';
          position: absolute;
          top: calc(var(--ds-size-2) * -1);
          right: var(--ds-size-12);
          border: var(--ds-size-2) solid transparent;
          border-top: 0;
          border-bottom-color: var(--ds-color-neutral-surface-tinted);
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
        .page-menu-tools {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ds-size-3);
        }
        .page-menu-tools .ds-button {
          width: auto;
        }
        .page-menu-search { flex: 1; }
        .page-menu-heading {
          display: flex;
          align-items: center;
          gap: var(--ds-size-2);
          margin: 0;
          padding: var(--ds-size-2) var(--ds-size-4);
          font-weight: 500;
        }
        .page-menu-heading svg {
          width: var(--ds-icon-size);
          height: var(--ds-icon-size);
        }
        .page-menu-narrow { display: none; }

        /* Not enough room: move language into the menu */
        @container (width < 42rem) {
          .page-header {
            grid-template-columns: 1fr auto auto;
            grid-template-areas:
              'logo profile menu'
              'nav nav nav';
          }
          .page-header-language,
          .page-header-language-dropdown { display: none; }
          .page-menu-narrow { display: contents; }
        }

        /* Even less room: move the profile to its own line */
        @container (width < 28rem) {
          .page-header {
            grid-template-columns: 1fr auto;
            grid-template-areas:
              'logo menu'
              'nav nav'
              'profile profile';
          }
          .page-header-profile {
            width: 100%;
            margin-top: var(--ds-size-4);
            justify-content: flex-start;
          }
          .page-header-profile > svg { margin-inline-start: auto; }
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
            <img src='/img/emblem.svg' alt='' width='24' height='24' />
            Avsender
          </span>
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
              data-autoplacement='false'
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
          <nav
            id='page-menu'
            aria-label='Meny'
            className='page-menu'
            hidden={!menuOpen}
          >
            <div className='page-menu-tools'>
              <Button variant='secondary' className='page-menu-search'>
                <MagnifyingGlassIcon aria-hidden />
                Søk
              </Button>
              <ToggleGroup aria-label='Fargemodus' defaultValue='system'>
                <Tooltip content='Systeminnstilling'>
                  <ToggleGroup.Item value='system'>
                    <LaptopIcon aria-hidden />
                  </ToggleGroup.Item>
                </Tooltip>
                <Tooltip content='Lys'>
                  <ToggleGroup.Item value='light'>
                    <SunIcon aria-hidden />
                  </ToggleGroup.Item>
                </Tooltip>
                <Tooltip content='Mørk'>
                  <ToggleGroup.Item value='dark'>
                    <MoonIcon aria-hidden />
                  </ToggleGroup.Item>
                </Tooltip>
              </ToggleGroup>
            </div>
            <Divider />
            <div className='page-menu-narrow'>
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
        </div>
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

export const LanguagePartlyTranslated = () => {
  const languages = [
    { code: 'nb', name: 'Bokmål (norsk)', current: true },
    { code: 'nn', name: 'Nynorsk (norsk)' },
    { code: 'en', name: 'English', note: 'Some pages are only in Norwegian' },
  ];

  return (
    <div style={{ minHeight: '14rem' }}>
      <Dropdown.TriggerContext>
        <Dropdown.Trigger
          variant='tertiary'
          style={{ background: 'var(--dsc-button-background--hover)' }}
        >
          <LanguageIcon aria-hidden />
          Language
        </Dropdown.Trigger>
        <Dropdown placement='bottom-start' data-autoplacement='false' open>
          <Dropdown.List>
            {languages.map(({ code, name, note, current }) => (
              <Dropdown.Item key={code}>
                <Dropdown.Button asChild>
                  <a
                    href={`/${code}/`}
                    lang={code}
                    hrefLang={code}
                    onClick={(event) => event.preventDefault()}
                    aria-current={current ? 'true' : undefined}
                  >
                    <CheckmarkIcon
                      aria-hidden
                      style={{ visibility: current ? 'visible' : 'hidden' }}
                    />
                    <span style={{ display: 'grid', textAlign: 'start' }}>
                      {name}
                      {note && (
                        <small
                          style={{
                            color: 'var(--ds-color-neutral-text-subtle)',
                          }}
                        >
                          {note}
                        </small>
                      )}
                    </span>
                  </a>
                </Dropdown.Button>
              </Dropdown.Item>
            ))}
          </Dropdown.List>
        </Dropdown>
      </Dropdown.TriggerContext>
    </div>
  );
};

export const LanguageChoiceInDialog = () => {
  const [search, setSearch] = useState('');

  const languages = [
    { code: 'nb', name: 'Bokmål (norsk)', terms: 'norwegian', current: true },
    { code: 'nn', name: 'Nynorsk (norsk)', terms: 'norwegian' },
    { code: 'se', name: 'Davvisámegiella', terms: 'nordsamisk north sami' },
    { code: 'smj', name: 'Julevsámegiella', terms: 'lulesamisk lule sami' },
    { code: 'sma', name: 'Åarjelsaemien gïele', terms: 'sørsamisk south sami' },
    { code: 'en', name: 'English', terms: 'engelsk' },
    { code: 'uk', name: 'Українська', terms: 'ukrainsk ukrainian' },
    { code: 'pl', name: 'Polski', terms: 'polsk polish' },
    { code: 'lt', name: 'Lietuvių', terms: 'litauisk lithuanian' },
    { code: 'so', name: 'Soomaali', terms: 'somali' },
    { code: 'ti', name: 'ትግርኛ', terms: 'tigrinja tigrinya' },
    { code: 'ar', name: 'العربية', terms: 'arabisk arabic' },
    { code: 'fa', name: 'فارسی', terms: 'persisk persian farsi' },
    { code: 'es', name: 'Español', terms: 'spansk spanish' },
    { code: 'fr', name: 'Français', terms: 'fransk french' },
    { code: 'de', name: 'Deutsch', terms: 'tysk german' },
    { code: 'sv', name: 'Svenska', terms: 'svensk swedish' },
    { code: 'da', name: 'Dansk', terms: 'dansk danish' },
    { code: 'fi', name: 'Suomi', terms: 'finsk finnish' },
    { code: 'is', name: 'Íslenska', terms: 'islandsk icelandic' },
    { code: 'it', name: 'Italiano', terms: 'italiensk italian' },
    { code: 'pt', name: 'Português', terms: 'portugisisk portuguese' },
    { code: 'nl', name: 'Nederlands', terms: 'nederlandsk dutch' },
    { code: 'et', name: 'Eesti', terms: 'estisk estonian' },
    { code: 'lv', name: 'Latviešu', terms: 'latvisk latvian' },
    { code: 'ro', name: 'Română', terms: 'rumensk romanian' },
    { code: 'sq', name: 'Shqip', terms: 'albansk albanian' },
    { code: 'bs', name: 'Bosanski', terms: 'bosnisk bosnian' },
    { code: 'ru', name: 'Русский', terms: 'russisk russian' },
    { code: 'tr', name: 'Türkçe', terms: 'tyrkisk turkish' },
    { code: 'ku', name: 'Kurdî', terms: 'kurdisk kurdish' },
    { code: 'ur', name: 'اردو', terms: 'urdu' },
    { code: 'ps', name: 'پښتو', terms: 'pashto' },
    { code: 'am', name: 'አማርኛ', terms: 'amharisk amharic' },
    { code: 'sw', name: 'Kiswahili', terms: 'swahili' },
    { code: 'hi', name: 'हिन्दी', terms: 'hindi' },
    { code: 'ta', name: 'தமிழ்', terms: 'tamil' },
    { code: 'vi', name: 'Tiếng Việt', terms: 'vietnamesisk vietnamese' },
    { code: 'th', name: 'ไทย', terms: 'thai' },
    { code: 'tl', name: 'Filipino', terms: 'filippinsk tagalog' },
    { code: 'zh', name: '中文', terms: 'kinesisk chinese' },
    { code: 'ja', name: '日本語', terms: 'japansk japanese' },
    { code: 'ko', name: '한국어', terms: 'koreansk korean' },
  ];

  const filtered = languages.filter(({ name, terms }) =>
    `${name} ${terms}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <>
      <Button
        variant='tertiary'
        command='show-modal'
        commandfor='language-dialog'
      >
        <LanguageIcon aria-hidden />
        Language
      </Button>
      <Dialog id='language-dialog' closedby='any'>
        <Heading style={{ marginBottom: 'var(--ds-size-4)' }}>
          Velg språk / Language
        </Heading>
        <Field style={{ marginBottom: 'var(--ds-size-4)' }}>
          <Label>Søk etter språk / Search languages</Label>
          <Input
            type='search'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Field>
        <ul
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
            alignContent: 'start',
            gap: 'var(--ds-size-1)',
            height: 'min(20rem, 50vh)',
            overflowY: 'auto',
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {filtered.length === 0 && <li>Ingen treff / No results</li>}
          {filtered.map(({ code, name, current }) => (
            <li key={code}>
              <Button variant='tertiary' asChild>
                <a
                  href={`/${code}/`}
                  lang={code}
                  hrefLang={code}
                  onClick={(event) => event.preventDefault()}
                  aria-current={current ? 'true' : undefined}
                >
                  <CheckmarkIcon
                    aria-hidden
                    style={{ visibility: current ? 'visible' : 'hidden' }}
                  />
                  {name}
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </Dialog>
    </>
  );
};

export const UntranslatedContent = () => {
  const languages = [
    { code: 'nb', name: 'Bokmål (norsk)' },
    { code: 'nn', name: 'Nynorsk (norsk)' },
    { code: 'en', name: 'English', current: true },
    { code: 'se', name: 'Davvisámegiella' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-8)',
        width: '100%',
      }}
    >
      <header
        data-size='sm'
        lang='en'
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--ds-size-3)',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--ds-size-2)',
            fontWeight: 500,
          }}
        >
          <img src='/img/emblem.svg' alt='' width='24' height='24' />
          Avsender
        </span>
        <span
          style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-size-3)' }}
        >
          <Button variant='secondary'>
            <MagnifyingGlassIcon aria-hidden />
            Search
          </Button>
          <Dropdown.TriggerContext>
            <Dropdown.Trigger variant='tertiary'>
              <LanguageIcon aria-hidden />
              Language
            </Dropdown.Trigger>
            <Dropdown placement='bottom-start' data-autoplacement='false'>
              <Dropdown.List>
                {languages.map(({ code, name, current }) => (
                  <Dropdown.Item key={code}>
                    <Dropdown.Button asChild>
                      <a
                        href={`/${code}/`}
                        lang={code}
                        hrefLang={code}
                        onClick={(event) => event.preventDefault()}
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
                ))}
              </Dropdown.List>
            </Dropdown>
          </Dropdown.TriggerContext>
          <Button variant='secondary'>
            <MenuHamburgerIcon aria-hidden />
            Menu
          </Button>
        </span>
      </header>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-size-4)',
        }}
      >
        <Alert data-color='info' lang='en'>
          This content is not yet translated to English and therefore shown in
          Norwegian (bokmål).
        </Alert>
        <div lang='nb'>
          <Heading level={1} data-size='md'>
            Søk om tilskudd
          </Heading>
          <Paragraph style={{ marginTop: 'var(--ds-size-2)' }}>
            Du kan søke om tilskudd hvis du skal starte en ny virksomhet.
            Søknaden må sendes inn før du starter.
          </Paragraph>
        </div>
      </main>
    </div>
  );
};

export const LanguageChoiceForPage = () => {
  const languages = [
    {
      code: 'nb',
      name: 'Norsk',
      title: 'Jeg vil levere søknad om beskyttelse',
      content: 'Innhold',
    },
    {
      code: 'en',
      name: 'English',
      title: 'I want to apply for protection',
      content: 'Content',
    },
    {
      code: 'uk',
      name: 'Українська',
      title: 'Я хочу подати заяву про захист',
      content: 'Зміст',
    },
    {
      code: 'ru',
      name: 'Русский',
      title: 'Я хочу подать заявление о защите',
      content: 'Содержание',
    },
  ];
  const [page, setPage] = useState(languages[0]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-8)',
        width: '100%',
      }}
    >
      <header
        data-size='sm'
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--ds-size-3)',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--ds-size-2)',
            fontWeight: 500,
          }}
        >
          <img src='/img/emblem.svg' alt='' width='24' height='24' />
          Avsender
        </span>
        <span style={{ display: 'flex', gap: 'var(--ds-size-3)' }}>
          <Button variant='secondary'>
            <MagnifyingGlassIcon aria-hidden />
            Søk
          </Button>
          <Button variant='secondary'>
            <MenuHamburgerIcon aria-hidden />
            Meny
          </Button>
        </span>
      </header>
      <main
        lang={page.code}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-size-6)',
        }}
      >
        <nav
          aria-label='Page language'
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'var(--ds-size-2) var(--ds-size-4)',
            padding: 'var(--ds-size-3) var(--ds-size-4)',
            borderRadius: 'var(--ds-border-radius-default)',
            background: 'var(--ds-color-neutral-surface-tinted)',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ds-size-2)',
              color: 'var(--ds-color-neutral-text-subtle)',
            }}
          >
            <LanguageIcon aria-hidden />
            Page language
          </span>
          {languages.map((language) =>
            language.code === page.code ? (
              <span
                key={language.code}
                lang={language.code}
                aria-current='true'
              >
                {language.name}
              </span>
            ) : (
              <Link
                key={language.code}
                href={`/${language.code}/`}
                lang={language.code}
                hrefLang={language.code}
                onClick={(event) => {
                  event.preventDefault();
                  setPage(language);
                }}
              >
                {language.name}
              </Link>
            ),
          )}
        </nav>
        <Heading level={1} data-size='md'>
          {page.title}
        </Heading>
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            minHeight: '10rem',
            background: 'var(--ds-color-neutral-background-tinted)',
            color: 'var(--ds-color-neutral-surface-active)',
            fontSize: '4rem',
          }}
        >
          {page.content}
        </div>
      </main>
    </div>
  );
};

export const ImportantLanguageOnFrontPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-8)',
        width: '100%',
      }}
    >
      <header
        data-size='sm'
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--ds-size-3)',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--ds-size-2)',
            fontWeight: 500,
          }}
        >
          <img src='/img/emblem.svg' alt='' width='24' height='24' />
          Avsender
        </span>
        <span
          style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-size-3)' }}
        >
          <Button variant='secondary'>
            <MagnifyingGlassIcon aria-hidden />
            Søk
          </Button>
          <Button variant='tertiary'>
            <LanguageIcon aria-hidden />
            Language
          </Button>
          <Button variant='secondary'>
            <MenuHamburgerIcon aria-hidden />
            Meny
          </Button>
        </span>
      </header>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-size-6)',
        }}
      >
        <Card data-color='accent' variant='tinted'>
          <Paragraph
            lang='nb'
            data-size='sm'
            style={{ color: 'var(--ds-color-text-subtle)' }}
          >
            Informasjon til personer som flykter fra krigen i Ukraina
          </Paragraph>
          <Heading level={2} data-size='xs' lang='uk'>
            Інформація для людей, які тікають від війни в Україні
          </Heading>
          <Paragraph lang='uk'>
            Тут ви знайдете інформацію про те, як подати заяву про захист у
            Норвегії та що відбувається після прибуття до Норвегії.
          </Paragraph>
          <Paragraph lang='uk'>
            <Link
              href='/uk/'
              hrefLang='uk'
              onClick={(event) => event.preventDefault()}
            >
              Інформація українською
            </Link>
          </Paragraph>
        </Card>
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            minHeight: '10rem',
            background: 'var(--ds-color-neutral-background-tinted)',
            color: 'var(--ds-color-neutral-surface-active)',
            fontSize: '4rem',
          }}
        >
          Innhold
        </div>
      </main>
    </div>
  );
};

export const LanguageNameTooltip = () => {
  const languages = [
    { code: 'nb', name: 'Norsk', label: 'Norwegian' },
    { code: 'en', name: 'English', label: 'English' },
    { code: 'it', name: 'Italiano', label: 'Italian' },
    { code: 'uk', name: 'Українська', label: 'Ukrainian' },
    { code: 'se', name: 'Davvisámegiella', label: 'Northern Sami' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--ds-size-2) var(--ds-size-6)',
        paddingTop: 'var(--ds-size-12)',
      }}
    >
      {languages.map(({ code, name, label }) => (
        <Tooltip key={code} content={label}>
          <Link
            href={`/${code}/`}
            hrefLang={code}
            onClick={(event) => event.preventDefault()}
          >
            <span lang={code}>{name}</span>
          </Link>
        </Tooltip>
      ))}
    </div>
  );
};
