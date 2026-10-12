import { Heading, Paragraph, Spinner } from '@digdir/designsystemet-react';

export type Progress = {
  /** 1-based number of the step in progress. */
  step: number;
  total: number;
  label: string;
  note?: string;
};

// Shown during the import: which step is running, and how far along the import is.
export function ImportingView({
  progress,
}: {
  progress: Progress | null;
}): React.JSX.Element {
  return (
    <div className='status-view' role='status'>
      <Spinner aria-hidden data-size='lg' />
      <Heading level={2} data-size='sm'>
        Importing to Figma
      </Heading>
      {progress ? (
        <>
          <progress
            className='progress'
            max={progress.total}
            value={progress.step}
            aria-label={`Step ${progress.step} of ${progress.total}`}
          />
          <Paragraph>
            Step {progress.step} of {progress.total}: {progress.label}
          </Paragraph>
          {progress.note && (
            <Paragraph data-color='warning'>{progress.note}</Paragraph>
          )}
        </>
      ) : (
        <Paragraph>Starting…</Paragraph>
      )}
    </div>
  );
}
