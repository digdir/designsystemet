import { Heading, Paragraph, Spinner } from '@digdir/designsystemet-react';

export type Progress = {
  /** 1-based number of the step in progress. */
  step: number;
  total: number;
  label: string;
};

// Shown during the export: which step is running, and how far along the export is.
export function ExportView({
  progress,
}: {
  progress: Progress | null;
}): React.JSX.Element {
  return (
    <div className='status-view' role='status' aria-live='polite'>
      <Spinner aria-hidden data-size='lg' />
      <Heading level={2} data-size='sm'>
        Creating variables
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
        </>
      ) : (
        <Paragraph>Starting…</Paragraph>
      )}
    </div>
  );
}
