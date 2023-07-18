import React from 'react';
import { render, screen } from '@testing-library/react';

import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  test('myProp should add myClass', (): void => {
    render(<Fieldset myProp>test text</Fieldset>);
    expect(screen.getByText('test text')).toHaveClass('myClass');
  });
});
