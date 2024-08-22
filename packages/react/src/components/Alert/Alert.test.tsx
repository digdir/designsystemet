import { render, screen } from '@testing-library/react';

import { Heading } from '../';

import { Alert } from './Alert';

describe('Alert', () => {
  // test('has correct default icon title when severity="danger"', () => {
  //   render(<Alert color='danger'>Alert me!</Alert>);
  //   expect(screen.getByTitle('Feil'));
  // });
  // test('has correct default icon title when severity="warning"', () => {
  //   render(<Alert color='warning'>Alert me!</Alert>);
  //   expect(screen.getByTitle('Advarsel'));
  // });
  // test('has correct default icon title when severity="success"', () => {
  //   render(<Alert color='success'>Alert me!</Alert>);
  //   expect(screen.getByTitle('Suksess'));
  // });
  // test('has correct default icon title when severity is not defined', () => {
  //   render(<Alert>Alert me!</Alert>);
  //   expect(screen.getByTitle('Informasjon'));
  // });
  // test('has correct icon title when iconTitle is defined', () => {
  //   render(<Alert color='info'>Alert me!</Alert>);
  //   expect(screen.getByTitle('info'));
  // });
  test('should render children, heading level 1', () => {
    render(
      <Alert color='info'>
        <Heading level={1} size='xs'>
          Alert me!
        </Heading>
      </Alert>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Alert me!' }));
  });
  test('has passed style should apply or override', () => {
    const style = { color: '#fff', marginTop: '32px' };
    render(
      <Alert
        data-testid='alert'
        color='info'
        style={style}
        className='testClass'
      >
        <Heading level={1} size='xs'>
          Alert me!
        </Heading>
      </Alert>,
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveStyle(style);
    expect(alert).toHaveClass('testClass');
  });
});
