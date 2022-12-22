import { render, screen } from '@testing-library/react';
import React from 'react';

import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('Displays text passed to children property as a list', () => {
    const text = 'This is an error message';
    render(
      <ErrorMessage>
        <ol>
          <li>{text}</li>
        </ol>
      </ErrorMessage>,
    );
    expect(screen.getByRole('alertdialog')).toHaveTextContent(text);
  });

  it('Renders error message with accessible name when aria is defined', () => {
    const ariaLabel = 'Hello from aria';
    const text = 'This is an error message';
    render(<ErrorMessage ariaLabel={ariaLabel}>{text}</ErrorMessage>);
    expect(screen.getByLabelText(ariaLabel)).toHaveTextContent(text);
  });
});
