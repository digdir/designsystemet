import { render, screen } from '@testing-library/react';

import { Heading } from '../';

import { Alert } from './Alert';

describe('Alert', () => {
/* TODO: Add visual tests for icons */
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
