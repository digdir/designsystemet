import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import { Details, type DetailsProps } from './';

const user = userEvent.setup();
const VOID = () => {};

const TestComponent = (rest: DetailsProps): JSX.Element => {
  return (
    <>
      <Details {...rest}>
        <Details.Summary>Details Header Title Text</Details.Summary>
        <Details.Content>The fantastic details content text</Details.Content>
      </Details>
    </>
  );
};

describe('Details', () => {
  test('details should have heading, Content and be closed by default', () => {
    render(<TestComponent />);
    const detailsExpandButton = screen.getByRole('button');

    expect(screen.getByText('The fantastic details content text'));
    expect(screen.getByText('Details Header Title Text'));
    expect(detailsExpandButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('should render details with open state as controlled', () => {
    render(<TestComponent open onToggle={VOID} />);
    const detailsExpandButton = screen.getByRole('button');
    expect(detailsExpandButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('Should be able to set defaultOpen on uncontrolled', () => {
    render(<TestComponent defaultOpen />);

    const detailsExpandButton = screen.getByRole('button');
    expect(detailsExpandButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('should be able to render Details as controlled', () => {
    render(<TestComponent open onToggle={VOID} />);

    const detailsExpandButton = screen.getByRole('button');
    expect(detailsExpandButton).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('Details Accessibility', () => {
  test('should toggle aria-expanded based on user action (uncontrolled)', async () => {
    render(<TestComponent />);

    const detailsExpandButton = screen.getByRole('button');
    expect(detailsExpandButton).toHaveAttribute('aria-expanded', 'false');

    await act(async () => await user.click(detailsExpandButton));
    expect(detailsExpandButton).toHaveAttribute('aria-expanded', 'true');

    await act(async () => await user.click(detailsExpandButton));
    expect(detailsExpandButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('should have correct aria-expanded when controlled', () => {
    const { rerender, container } = render(
      <TestComponent open onToggle={VOID} />,
    );

    const detailsExpandButton = screen.getByRole('button');
    expect(detailsExpandButton).toHaveAttribute('aria-expanded', 'true');

    rerender(<TestComponent open={false} onToggle={VOID} />);
    expect(detailsExpandButton).toHaveAttribute('aria-expanded', 'false');
  });
});
