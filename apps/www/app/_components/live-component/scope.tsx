import * as storyIcons from 'virtual:story-icons';
import * as ds from '@digdir/designsystemet-react';
import { useSynchronizedAnimation } from '@digdir/designsystemet-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const SyncedBox = () => {
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
};

/** Everything the code in a story can use without importing it. */
export const liveScope: Record<string, unknown> = {
  ...ds,
  ...storyIcons,
  useState,
  useEffect,
  useRef,
  useId,
  SyncedBox,
  useDropzone,
};

let allIcons: Promise<void> | undefined;

/**
 * `liveScope` starts out with only the icons the stories use. This adds the rest of
 * '@navikt/aksel-icons', so people editing an example can use any icon without every reader
 * having to download all of them.
 */
export const loadAllIcons = () => {
  allIcons ??= import('virtual:all-icons').then(
    (icons) => {
      Object.assign(liveScope, { ...icons, ...liveScope });
    },
    () => {
      // Editing still works with the icons we have; try again on the next edit
      allIcons = undefined;
    },
  );
  return allIcons;
};
