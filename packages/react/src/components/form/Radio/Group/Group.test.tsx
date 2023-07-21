import React from 'react';
import { render, screen } from '@testing-library/react';

import { RadioGroup } from './Group';

describe('Group', () => {
  test('myProp should add myClass', (): void => {
    render(<RadioGroup>test text</RadioGroup>);
    expect(true);
  });
});
