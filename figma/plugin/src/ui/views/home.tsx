import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import { FileExportIcon, PaletteIcon, RocketIcon } from '@navikt/aksel-icons';

// A utility on the start page: a small card with an icon and a short label. Add new utilities to the list
// in HomeView; the grid makes room for them.
type Utility = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

// The start view: import a theme into this file, and the utilities, e.g. updating a copy of the UI kit.
// Export is shown when it's turned on, i.e. when onExport is given.
export function HomeView({
  onImport,
  onUpdateKit,
  onExport,
}: {
  onImport: () => void;
  onUpdateKit: () => void;
  onExport?: () => void;
}): React.JSX.Element {
  const utilities: Utility[] = [
    { label: 'Update UI kit', icon: <RocketIcon />, onClick: onUpdateKit },
    ...(onExport
      ? [
          {
            label: 'Export config from Figma',
            icon: <FileExportIcon />,
            onClick: onExport,
          },
        ]
      : []),
  ];

  return (
    <div className='home-view'>
      <div className='home-intro'>
        <Heading level={1} data-size='sm'>
          Designsystemet
        </Heading>
        <Paragraph>
          Import your theme and keep the components in your Figma files up to
          date.
        </Paragraph>
      </div>

      <Card data-color='neutral' asChild className='home-main-card'>
        <button type='button' onClick={onImport}>
          <span aria-hidden className='home-card-icon'>
            <PaletteIcon />
          </span>
          <span className='home-main-card-text'>
            <Heading level={2} data-size='xs'>
              Import theme to Figma
            </Heading>
            <Paragraph>
              Use the config file from the theme builder to create or update the
              variables and styles in this file.
            </Paragraph>
          </span>
        </button>
      </Card>

      <section className='home-utilities' aria-labelledby='home-utilities'>
        <Heading level={2} data-size='xs' id='home-utilities'>
          Utilities
        </Heading>
        <div className='home-utility-grid'>
          {utilities.map(({ label, icon, onClick }) => (
            <Card
              key={label}
              data-color='neutral'
              asChild
              className='home-utility-card'
            >
              <button type='button' onClick={onClick}>
                <span aria-hidden className='home-card-icon'>
                  {icon}
                </span>
                <span className='home-utility-label'>{label}</span>
              </button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
