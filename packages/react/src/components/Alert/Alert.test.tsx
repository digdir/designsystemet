import React from 'react';
import { render, screen } from '@testing-library/react';

import { Alert } from './Alert';

describe('Alert', () => {
  test('has correct icon title when severity="danger"', (): void => {
    render(<Alert severity='danger'>Alert me!</Alert>);
    screen.debug();
    expect(screen.getByTitle('Feil'));
  });
  test('has correct icon title when severity="warning"', (): void => {
    render(<Alert severity='warning'>Alert me!</Alert>);
    screen.debug();
    expect(screen.getByTitle('Advarsel'));
  });
  test('has correct icon title when severity="success"', (): void => {
    render(<Alert severity='success'>Alert me!</Alert>);
    screen.debug();
    expect(screen.getByTitle('Suksess'));
  });
  test('has correct icon title when severity is not defined', (): void => {
    render(<Alert>Alert me!</Alert>);
    screen.debug();
    expect(screen.getByTitle('Informasjon'));
  });
});
