import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act, type JSX } from 'react';

import { Details, type DetailsProps } from './';

const user = userEvent.setup();
const VOID = () => {};

const TestComponent = (rest: DetailsProps): JSX.Element => {
  return (
    <Details {...rest}>
      <Details.Summary data-testid='summary'>
        Details Header Title Text
      </Details.Summary>
      <Details.Content>The fantastic details content text</Details.Content>
    </Details>
  );
};

describe('Details', () => {
  test('details should have heading, Content and be closed by default', () => {
    render(<TestComponent />);
    const detailsExpandButton = screen.getByTestId('summary');

    expect(screen.getByText('The fantastic details content text'));
    expect(screen.getByText('Details Header Title Text'));
    expect(detailsExpandButton.parentElement).not.toHaveAttribute('open');
  });

  test('should render details with open state as controlled', () => {
    render(<TestComponent open onToggle={VOID} />);
    const detailsExpandButton = screen.getByTestId('summary');
    expect(detailsExpandButton.parentElement).toHaveAttribute('open');
  });

  test('Should be able to set defaultOpen on uncontrolled', () => {
    render(<TestComponent defaultOpen />);

    const detailsExpandButton = screen.getByTestId('summary');
    expect(detailsExpandButton.parentElement).toHaveAttribute('open');
  });

  test('should be able to render Details as controlled', async () => {
    render(<TestComponent open onToggle={VOID} />);

    const detailsExpandButton = screen.getByTestId('summary');
    expect(detailsExpandButton.parentElement).toHaveAttribute('open');

    await user.click(detailsExpandButton);
    expect(detailsExpandButton.parentElement).toHaveAttribute('open');
  });
});
