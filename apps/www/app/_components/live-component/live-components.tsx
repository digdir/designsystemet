import * as ds from '@digdir/designsystemet-react';
import { LiveEditor, LivePreview, LiveProvider } from 'react-live';

const scopes = {
  ...ds,
};

export const LiveComponent = () => {
  return (
    <LiveProvider code={`<Button>min knapp!</Button>`} scope={scopes}>
      <div className='grid grid-cols-2 gap-4'>
        <LiveEditor className='font-mono' />
        <LivePreview />
      </div>
    </LiveProvider>
  );
};
