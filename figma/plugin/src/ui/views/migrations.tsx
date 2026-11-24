import {
  Alert,
  Card,
  Details,
  Heading,
  Paragraph,
  Spinner,
} from '@digdir/designsystemet-react';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import type { MigrationInfo, MigrationSummary } from '../../types';

export type MigrationsState = {
  /** The migrations, oldest first, or null until the plugin has listed them. */
  available: MigrationInfo[] | null;
  /** The IDs of the migrations being previewed or applied. */
  selected: string[];
  /**
   * select: choosing migrations. previewing: finding what they would change. preview: showing it, before
   * applying. running: applying them. done: showing what they changed.
   */
  status: 'select' | 'previewing' | 'preview' | 'running' | 'done';
  summaries: MigrationSummary[];
  /** Why the last preview or run failed. */
  error?: string;
};

// Updates the layers in a copy of the UI kit when a release changes the variables its components use.
// The user clicks a migration to see what it would change, and then applies it.
export function MigrationsView({
  state,
  onChoose,
}: {
  state: MigrationsState;
  /** Previews a migration. */
  onChoose: (id: string) => void;
}): React.JSX.Element {
  const { available, status, summaries, error } = state;

  if (!available || status === 'previewing' || status === 'running') {
    return (
      <div className='status-view' role='status'>
        <Spinner aria-hidden data-size='lg' />
        <Heading level={2} data-size='sm'>
          {status === 'running'
            ? 'Updating components'
            : status === 'previewing'
              ? 'Finding what will change'
              : 'Reading migrations'}
        </Heading>
        {status !== 'select' && (
          <Paragraph>This can take a little while in a large file.</Paragraph>
        )}
      </div>
    );
  }

  if (status === 'preview' || status === 'done') {
    const done = status === 'done';
    return (
      <div className='migrations-view'>
        <Heading level={2} data-size='sm'>
          {done ? 'Components updated' : 'What will change'}
        </Heading>
        <Paragraph>
          {done
            ? 'You can undo all of it at once with Undo in Figma.'
            : 'Nothing has changed yet. Check the changes below, and click "Apply changes" to make them. You can undo them afterwards with Undo in Figma.'}
        </Paragraph>
        {summaries.map((summary) => (
          <MigrationSummaryView
            key={summary.id}
            summary={summary}
            done={done}
          />
        ))}
      </div>
    );
  }

  return (
    <div className='migrations-view'>
      <Paragraph>
        Migrations update your copy of the UI kit to a new release. Import the
        new config first.
      </Paragraph>
      <Paragraph>
        Only the UI kit's own components are changed, including layers you added
        inside them. Your own components and layers are left as they are.
        Instances of the UI kit's components follow the change, unless you
        changed their colors yourself.
      </Paragraph>
      {error && <Alert data-color='danger'>{error}</Alert>}
      <Heading level={2} data-size='xs'>
        Choose a migration
      </Heading>
      <Paragraph>You can see what changes before you apply it.</Paragraph>
      {available.map((migration) => (
        <Card key={migration.id} data-color='neutral' asChild>
          <button type='button' onClick={() => onChoose(migration.id)}>
            <Heading level={3} data-size='xs'>
              {migration.title}
            </Heading>
            <Paragraph>{migration.description}</Paragraph>
            <MigrationStatus appliedAt={migration.appliedAt} />
          </button>
        </Card>
      ))}
    </div>
  );
}

// Whether the migration has been applied to this file, and when: green with a checkmark once it has.
function MigrationStatus({
  appliedAt,
}: {
  appliedAt?: string;
}): React.JSX.Element {
  if (!appliedAt) {
    return (
      <Paragraph data-size='sm' className='migration-status'>
        Not applied to this file yet
      </Paragraph>
    );
  }
  return (
    <Paragraph
      data-size='sm'
      data-color='success'
      className='migration-status migration-status--applied'
    >
      <CheckmarkCircleFillIcon aria-hidden />
      Applied to this file on {new Date(appliedAt).toLocaleDateString()}
    </Paragraph>
  );
}

function MigrationSummaryView({
  summary,
  done,
}: {
  summary: MigrationSummary;
  done: boolean;
}): React.JSX.Element {
  const { title, components, total, warnings, error } = summary;
  return (
    <section className='migration-summary'>
      <Heading level={3} data-size='xs'>
        {title}
      </Heading>
      {error ? (
        <Alert data-color='danger'>{error}</Alert>
      ) : total === 0 ? (
        <Paragraph>
          {done ? 'Nothing was changed.' : 'Nothing to change.'} The components
          in this file are already up to date.
        </Paragraph>
      ) : (
        <Paragraph>
          {done ? 'Updated' : 'Will update'} {plural(components.length, 'page')}
          :
        </Paragraph>
      )}
      {warnings.length > 0 && (
        <Alert data-color='warning'>
          {warnings.length === 1 ? 'Skipped:' : `Skipped ${warnings.length}:`}
          <ul className='notification-details'>
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}
      {components.map((component) => (
        <Details key={component.name}>
          <Details.Summary>{component.name}</Details.Summary>
          <Details.Content>
            <ul className='notification-details'>
              {component.changes.map((change, index) => (
                <li key={index}>
                  {change.what}: {change.from} → {change.to} (
                  {plural(change.count, 'layer')})
                </li>
              ))}
            </ul>
          </Details.Content>
        </Details>
      ))}
    </section>
  );
}

const plural = (count: number, word: string): string =>
  `${count} ${word}${count === 1 ? '' : 's'}`;
