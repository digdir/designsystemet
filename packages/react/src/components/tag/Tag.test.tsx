import { render, screen } from '@testing-library/react';

import { Tag } from './Tag';

describe('Tag', () => {
  test('should render tag with Beta as value', (): void => {
    render(<Tag>Beta</Tag>);
    expect(screen.getByText('Beta'));
  });

  test('should have custom className', () => {
    render(<Tag className='customClassName'>Beta</Tag>);
    expect(screen.getByText('Beta')).toHaveClass('customClassName');
  });
});
