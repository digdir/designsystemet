import * as ds from '@digdir/designsystemet-react';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import classes from './live-component.module.css';

const scopes = {
  ...ds,
};

type LiveComponentProps = {
  code: string;
};

export const LiveComponent = ({ code }: LiveComponentProps) => {
  return (
    <LiveProvider code={code} scope={scopes} noInline>
      <div className='grid grid-cols-2 gap-4'>
        <div className={classes.preview}>
          <LivePreview />
          <LiveError className='ds-alert' />
        </div>
        <LiveEditor className='font-mono' />
      </div>
    </LiveProvider>
  );
};
