import {
  Alert,
  Field,
  Heading,
  Label,
  Paragraph,
  Spinner,
  Textarea,
} from '@digdir/designsystemet-react';

export type ExportState =
  | { status: 'loading' }
  | { status: 'success'; config: string; warnings: string[] }
  | { status: 'error'; message: string };

// Shows the config created from this file's variables, with what couldn't be included.
export function ExportView({
  exported,
}: {
  exported: ExportState;
}): React.JSX.Element {
  if (exported.status === 'loading') {
    return (
      <div className='status-view' role='status'>
        <Spinner aria-hidden data-size='lg' />
        <Heading level={2} data-size='sm'>
          Reading variables
        </Heading>
      </div>
    );
  }

  if (exported.status === 'error') {
    return (
      <div className='export-view'>
        <Alert data-color='danger'>
          Could not create a config from this file: {exported.message}
        </Alert>
      </div>
    );
  }

  const { config, warnings } = exported;

  return (
    <div className='export-view'>
      <Paragraph>
        This config was created from the variables in this file. Syncing it
        gives the same themes, including colors that were changed by hand.
      </Paragraph>
      {warnings.length > 0 && (
        <Alert data-color='warning'>
          {warnings.length === 1
            ? '1 thing in this file is not in the config:'
            : `${warnings.length} things in this file are not in the config:`}
          <ul className='notification-details'>
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}
      <Field className='export-field'>
        <Label>designsystemet.config.json</Label>
        <Textarea value={config} readOnly />
      </Field>
    </div>
  );
}
