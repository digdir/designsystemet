import React from 'react';
import { render, screen } from '@testing-library/react';

import { LegacyAccordion } from './LegacyAccordion';
import { LegacyAccordionContent } from './LegacyAccordionContent';
import type { LegacyAccordionHeaderProps } from './LegacyAccordionHeader';
import { LegacyAccordionHeader } from './LegacyAccordionHeader';

// Test data:
const header = 'LegacyAccordionHeader';
const defaultProps: LegacyAccordionHeaderProps = {
  children: header,
};

const renderWithContext = (props: Partial<LegacyAccordionHeaderProps> = {}) =>
  render(
    <LegacyAccordion
      onClick={jest.fn()}
      open={false}
    >
      <LegacyAccordionHeader
        {...defaultProps}
        {...props}
      />
      <LegacyAccordionContent>LegacyAccordionContent</LegacyAccordionContent>
    </LegacyAccordion>,
  );

describe('LegacyAccordionHeader', () => {
  it('Shows subtitle when "subtitle" prop is set', () => {
    const subtitle = 'Subtitle is here';
    renderWithContext({ subtitle });
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('Does not show subtitle when "subtitle" prop is not set', () => {
    renderWithContext({ subtitle: undefined });
    expect(
      screen.queryByTestId('LegacyAccordion-header-subtitle'),
    ).not.toBeInTheDocument();
  });
});
