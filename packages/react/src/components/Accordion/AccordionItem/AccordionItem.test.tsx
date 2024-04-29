import { render, screen } from '@testing-library/react';

import { Accordion } from '..';

import type { AccordionItemProps } from './AccordionItem';

const TestComponent = ({ ...rest }: Omit<AccordionItemProps, 'children'>): JSX.Element => {
  return (
    <Accordion>
      <Accordion.Item {...rest}>
        <Accordion.Header level={3}>Accordion Header Title Text</Accordion.Header>
        <Accordion.Content>The Fantastic AccordionContent Text</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};

describe('AccordionItem Rendering', () => {
  test('should render AccordionHeader and AccordionContent as children', () => {
    render(<TestComponent />);

    expect(
      screen.getByRole('heading', {
        name: 'Accordion Header Title Text',
        level: 3,
      }),
    );
    expect(screen.getByText('The Fantastic AccordionContent Text'));
  });
});

describe('AccordionItem Uncontrolled', () => {
  test('should render accordion and should be closed by default', () => {
    render(<TestComponent />);

    const accordionExpandButton = screen.getByRole('button');
    expect(accordionExpandButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('Should be able to set defaultOpen on uncontrolled', () => {
    render(<TestComponent defaultOpen />);

    const accordionExpandButton = screen.getByRole('button');
    expect(accordionExpandButton).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('AccordionItem Controlled', () => {
  test('should be able to render AccordionItem as controlled', () => {
    render(<TestComponent open />);

    const accordionExpandButton = screen.getByRole('button');
    expect(accordionExpandButton).toHaveAttribute('aria-expanded', 'true');
  });
});
