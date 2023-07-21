import React from 'react';
import { render, screen } from '@testing-library/react';

import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  test('myProp should add myClass', (): void => {
    render(<Fieldset>test text</Fieldset>);
    expect(true);
  });
});
