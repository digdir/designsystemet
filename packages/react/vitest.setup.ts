import { configure } from '@testing-library/react';
import { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom';

interface ImportMetaEnv {
  VITE_REACT_VERSION?: string;
}

declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

const expectedVersion = import.meta.env.VITE_REACT_VERSION;

if (expectedVersion) {
  if (!reactVersion.startsWith(expectedVersion)) {
    throw new Error(
      `Expected react v${expectedVersion}, but found v${reactVersion}`,
    );
  }
  if (!reactDomVersion.startsWith(expectedVersion)) {
    throw new Error(
      `Expected react-dom v${expectedVersion}, but found v${reactDomVersion}`,
    );
  }
} else {
  throw new Error('VITE_REACT_VERSION is not defined');
}

configure({ reactStrictMode: true });
