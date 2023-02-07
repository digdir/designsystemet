import React from 'react';
import { render, screen } from '@testing-library/react';

import { Accordion } from './Accordion';
import { AccordionContent } from './AccordionContent';
import type { AccordionHeaderProps } from './AccordionHeader';
import { AccordionHeader } from './AccordionHeader';

// Test data:
const header = 'AccordionHeader';
const defaultProps: AccordionHeaderProps = {
  children: header,
};

const renderWithContext = (props: Partial<AccordionHeaderProps> = {}) => render(
  <Accordion
    onClick={jest.fn()}
    open={false}
  >
    <AccordionHeader {...defaultProps} {...props} />
    <AccordionContent>AccordionContent</AccordionContent>
  </Accordion>
);

describe('AccordionHeader', () => {
  it('Shows subtitle when "subtitle" prop is set', () => {
    const subtitle = 'Subtitle is here';
    renderWithContext({ subtitle });
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('Does not show subtitle when "subtitle" prop is not set', () => {
    renderWithContext({ subtitle: undefined });
    expect(
      screen.queryByTestId('accordion-header-subtitle')
    ).not.toBeInTheDocument();
  });
});
