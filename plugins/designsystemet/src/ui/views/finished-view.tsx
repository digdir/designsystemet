import { Heading, Paragraph } from '@digdir/designsystemet-react';

// Shown when the sync has finished. Warnings and the sync log are in the notifications view.
export function FinishedView({
  message,
  warningCount,
}: {
  message: string;
  warningCount: number;
}): React.JSX.Element {
  return (
    <div className='status-view'>
      <Heading level={2} data-size='sm'>
        Sync finished
      </Heading>
      <Paragraph>{message}</Paragraph>
      {warningCount > 0 && (
        <Paragraph data-color='warning'>
          {warningCount} {warningCount === 1 ? 'warning' : 'warnings'}. See the
          notifications for details.
        </Paragraph>
      )}
    </div>
  );
}
