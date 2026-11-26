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
  /** A short status under the label, e.g. how much of the file is stamped. */
  note?: string;
  /** Shown instead of the label while the utility runs, with a spinner instead of the icon. */
  busyLabel?: string;
};

// The start view: import a theme into this file, and the utilities, e.g. updating a copy of the UI kit.
// Export and stamping are shown when they're turned on, i.e. when onExport or onStampUiKit is given. Stamping is
// in its own section, For maintainers.
export function HomeView({
  onImport,
  onUpdateKit,
  pendingMigrations = 0,
  onExport,
  onStampUiKit,
  stamping = false,
  stampedPages = null,
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
  /** How many pages in this file are stamped, or null if not known yet. */
  stampedPages?: number | null;
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
  ];
  // For the UI kit's maintainers, in their own section, so it's clear they aren't for everyone.
  const maintainerUtilities: Utility[] = onStampUiKit
    ? [
        {
          label: 'Stamp UI kit',
          icon: <TagIcon />,
          onClick: onStampUiKit,
          busyLabel: stamping ? 'Stamping the UI kit…' : undefined,
          note:
            stampedPages === null
              ? undefined
              : stampedPages === 0
                ? 'Not stamped'
                : `${stampedPages} ${stampedPages === 1 ? 'page' : 'pages'} stamped`,
        },
      ]
    : [];

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

      <Card asChild className='home-main-card'>
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

      <UtilitySection id='home-utilities' title='Utilities'>
        {utilities}
      </UtilitySection>
      {maintainerUtilities.length > 0 && (
        <UtilitySection
          id='home-maintainer-utilities'
          title='For maintainers'
          description='Internal tools for the UI kit’s source file. Hidden in releases.'
        >
          {maintainerUtilities}
        </UtilitySection>
      )}
    </div>
  );
}

function UtilitySection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: Utility[];
}): React.JSX.Element {
  return (
    <section className='home-utilities' aria-labelledby={id}>
      <Heading level={2} data-size='xs' id={id}>
        {title}
      </Heading>
      {description && <Paragraph data-size='sm'>{description}</Paragraph>}
      <div className='home-utility-grid'>
        {children.map((utility) => (
          <UtilityCard key={utility.label} {...utility} />
        ))}
      </div>
    </section>
  );
}

function UtilityCard({
  label,
  icon,
  onClick,
  badge,
  note,
  busyLabel,
}: Utility): React.JSX.Element {
  return (
    <Card asChild className='home-utility-card'>
      <button
        type='button'
        onClick={onClick}
        aria-busy={busyLabel ? true : undefined}
        aria-disabled={busyLabel ? true : undefined}
      >
        <span aria-hidden className='home-card-icon'>
          {busyLabel ? (
            <Spinner data-color='accent' aria-hidden data-size='md' />
          ) : (
            icon
          )}
        </span>
        <span className='home-utility-label'>{busyLabel ?? label}</span>
        {note && !busyLabel && (
          <span className='home-utility-note'>{note}</span>
        )}
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
  );
}
