import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Accordion } from '..';

import type { AccordionHeaderProps } from './AccordionHeader';

const user = userEvent.setup();

const TestComponent = ({
  ...rest
}: Omit<AccordionHeaderProps, 'children'>): JSX.Element => {
  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header {...rest}>
          Accordion Header Title Text
        </Accordion.Header>
        <Accordion.Content>
          The Fantastic AccordionContent Text
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};

describe('AccordionHeader Rendering', () => {
  test('should render with aria-expanded false by default', () => {
    render(<TestComponent />);
    const accordionHeaderButton = screen.getByRole('button');

    expect(accordionHeaderButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('should render heading as level 1 by default', () => {
    render(<TestComponent />);

    expect(
      screen.getByRole('heading', {
        name: 'Accordion Header Title Text',
        level: 1,
      }),
    );
  });

  test('should render heading as level desired (h3) by default', () => {
    render(<TestComponent level={3} />);

    expect(
      screen.getByRole('heading', {
        name: 'Accordion Header Title Text',
        level: 3,
      }),
    );
  });

  test('should have onHeaderClick callback', async () => {
    const onHeaderClickMock = vi.fn();
    render(<TestComponent onHeaderClick={onHeaderClickMock} />);

    const accordionHeaderButton = screen.getByRole('button');
    await user.click(accordionHeaderButton);

    expect(onHeaderClickMock).toHaveBeenCalledTimes(1);
  });
});
