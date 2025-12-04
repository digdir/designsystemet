import { Button } from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => {
  /* const SyncedBox = () => {
    const ref = useSynchronizedAnimation<HTMLDivElement>('spin');

    return (
      <div
        ref={ref}
        style={{
          animation: 'spin 2s linear infinite',
          width: '30px',
          height: '30px',
          backgroundColor: 'red',
        }}
      />
    );
  }; */

  const [count, setCount] = useState(1);

  return (
    <div>
      <Button onClick={() => setCount(count + 1)} style={{ display: 'block' }}>
        New box
      </Button>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          maxWidth: '300px',
          flexWrap: 'wrap',
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          /* @ts-ignore */
          <SyncedBox key={i} />
        ))}
      </div>

      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};
