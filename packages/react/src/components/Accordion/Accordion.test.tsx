import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { AccordionItemProps } from './';
import { Accordion } from './';

const user = userEvent.setup();

const TestComponent = ({ ...rest }: Omit<AccordionItemProps, 'children'>): JSX.Element => {
  return (
    <Accordion>
      <Accordion.Item {...rest}>
        <Accordion.Header level={3}>Accordion Header Title Text</Accordion.Header>
        <Accordion.Content>The fantastic accordion content text</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};

describe('Accordion', () => {
  test('accordion should have Header, Content and be closed by default', () => {
    render(<TestComponent />);
    const accordionExpandButton = screen.getByRole('button');

    expect(
      screen.getByRole('heading', {
        name: 'Accordion Header Title Text',
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('The fantastic accordion content text'));
    expect(accordionExpandButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('should render accordion with open state as controlled', () => {
    render(<TestComponent open />);
    const accordionExpandButton = screen.getByRole('button');
    expect(accordionExpandButton).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('Accordion Accessibility', () => {
  test('should toggle aria-expanded based on user action (uncontrolled)', async () => {
    render(<TestComponent />);

    const accordionExpandButton = screen.getByRole('button');
    expect(accordionExpandButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(accordionExpandButton);
    expect(accordionExpandButton).toHaveAttribute('aria-expanded', 'true');

    await user.click(accordionExpandButton);
    expect(accordionExpandButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('should have correct aria-expanded when controlled', () => {
    const { rerender } = render(<TestComponent open />);

    const accordionExpandButton = screen.getByRole('button');
    expect(accordionExpandButton).toHaveAttribute('aria-expanded', 'true');

    rerender(<TestComponent open={false} />);
    expect(accordionExpandButton).toHaveAttribute('aria-expanded', 'false');
  });
});
