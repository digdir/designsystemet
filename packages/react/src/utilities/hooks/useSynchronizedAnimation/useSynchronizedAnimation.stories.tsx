import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../../../components';

import { useSynchronizedAnimation } from './useSynchronizedAnimation';

const meta: Meta = {
  title: 'Utilities/useSynchronizedAnimation',
  parameters: {
    chromatic: { disableSnapshot: true },
    customStyles: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
  },
};

export default meta;

const boxStyle = {
  width: '30px',
  height: '30px',
  backgroundColor: 'red',
};

const SyncedBox = () => {
  const ref = useSynchronizedAnimation<HTMLDivElement>('spin');

  return (
    <div
      ref={ref}
      style={{
        animation: 'spin 2s linear infinite',
        ...boxStyle,
      }}
    />
  );
};

export const TestSync = () => {
  const [count, setCount] = useState(1);

  return (
    <>
      <Button onClick={() => setCount(count + 1)}>Ny boks</Button>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          maxWidth: '300px',
          flexWrap: 'wrap',
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
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
    </>
  );
};
