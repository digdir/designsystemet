import { configure } from '@testing-library/react';
import { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom';

const expectedVersion = process.env.REACT_VERSION;
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
}

configure({ reactStrictMode: true });
