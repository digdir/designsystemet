import {
  Badge,
  Card,
  Heading,
  Paragraph,
  Spinner,
} from '@digdir/designsystemet-react';
import {
  FileExportIcon,
  PaletteIcon,
  RocketIcon,
  TagIcon,
} from '@navikt/aksel-icons';

// A utility on the start page: a small card with an icon and a short label. Add new utilities to the list
// in HomeView; the grid makes room for them.
type Utility = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  /** A count shown in the card's corner, e.g. migrations not applied to this file. Hidden when 0. */
  badge?: { count: number; label: string };
  /** Shown instead of the label while the utility runs, with a spinner instead of the icon. */
  busyLabel?: string;
};

// The start view: import a theme into this file, and the utilities, e.g. updating a copy of the UI kit.
// Export and stamping are shown when they're turned on, i.e. when onExport or onStampUiKit is given.
export function HomeView({
  onImport,
  onUpdateKit,
  pendingMigrations = 0,
  onExport,
  onStampUiKit,
  stamping = false,
}: {
  onImport: () => void;
  onUpdateKit: () => void;
  /** The number of migrations not applied to this file yet. */
  pendingMigrations?: number;
  onExport?: () => void;
  /** Stamps the UI kit's source file for migrations. For maintainers. */
  onStampUiKit?: () => void;
  /** Whether the UI kit is being stamped. */
  stamping?: boolean;
}): React.JSX.Element {
  const utilities: Utility[] = [
    {
      label: 'Update UI kit',
      icon: <RocketIcon />,
      onClick: onUpdateKit,
      badge: {
        count: pendingMigrations,
        label: `${pendingMigrations} ${pendingMigrations === 1 ? 'update' : 'updates'} not applied`,
      },
    },
    ...(onExport
      ? [
          {
            label: 'Export config from Figma',
            icon: <FileExportIcon />,
            onClick: onExport,
          },
        ]
      : []),
    ...(onStampUiKit
      ? [
          {
            label: 'Stamp UI kit (maintainers)',
            icon: <TagIcon />,
            onClick: onStampUiKit,
            busyLabel: stamping ? 'Stamping the UI kit…' : undefined,
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
          {utilities.map(({ label, icon, onClick, badge, busyLabel }) => (
            <Card
              key={label}
              data-color='neutral'
              asChild
              className='home-utility-card'
            >
              <button
                type='button'
                onClick={onClick}
                aria-busy={busyLabel ? true : undefined}
                aria-disabled={busyLabel ? true : undefined}
              >
                <span aria-hidden className='home-card-icon'>
                  {busyLabel ? <Spinner aria-hidden data-size='md' /> : icon}
                </span>
                <span className='home-utility-label'>{busyLabel ?? label}</span>
                {badge && badge.count > 0 && (
                  <>
                    {/* The count is drawn by CSS, so screen readers get it as text instead. */}
                    <Badge
                      aria-hidden
                      data-color='accent'
                      count={badge.count}
                      maxCount={9}
                      className='home-utility-badge'
                    />
                    <span className='ds-sr-only'>, {badge.label}</span>
                  </>
                )}
              </button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
