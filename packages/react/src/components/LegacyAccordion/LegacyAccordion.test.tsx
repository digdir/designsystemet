import React from 'react';
import userEvent from '@testing-library/user-event';
import { render as renderRtl, screen } from '@testing-library/react';

import type { LegacyAccordionProps } from './LegacyAccordion';
import { LegacyAccordion } from './LegacyAccordion';
import { LegacyAccordionContent } from './LegacyAccordionContent';
import { accordionIcons } from './Context';
import { LegacyAccordionHeader } from './LegacyAccordionHeader';

// Test data:
const header = 'LegacyAccordionHeader';
const content = 'LegacyAccordionContent';
const defaultProps: LegacyAccordionProps = {
  children: (
    <>
      <LegacyAccordionHeader>{header}</LegacyAccordionHeader>
      <LegacyAccordionContent>{content}</LegacyAccordionContent>
    </>
  ),
  open: false,
  onClick: jest.fn(),
};

// Mocks:
jest.mock('./icons', () => ({
  Arrow: () => <svg data-testid={'primary'} />,
  CircleArrow: () => <svg data-testid={'secondary'} />,
}));

const render = (props: Partial<LegacyAccordionProps> = {}) =>
  renderRtl(
    <LegacyAccordion
      {...defaultProps}
      {...props}
    />,
  );

const user = userEvent.setup();

describe('LegacyAccordion', () => {
  it('Calls onClick when LegacyAccordionHeader is clicked', async () => {
    const onClick = jest.fn();
    render({ onClick });
    await user.click(screen.getByRole('button', { name: header }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Is expanded when the "open" property is true', () => {
    render({ open: true });
    expect(
      screen.getByRole('button', { name: header, expanded: true }),
    ).toBeInTheDocument();
  });

  it('Is not expanded when the "open" property is false', () => {
    render({ open: false });
    expect(
      screen.getByRole('button', { name: header, expanded: false }),
    ).toBeInTheDocument();
  });

  it('Calls onClick when LegacyAccordionHeader is clicked using the Space key', async () => {
    const onClick = jest.fn();
    render({ onClick });
    const LegacyAccordionHeader = screen.getByRole('button', { name: header });
    await user.type(LegacyAccordionHeader, '{Space}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Calls handleClick when LegacyAccordionHeader is clicked using the Enter key', async () => {
    const onClick = jest.fn();
    render({ onClick });
    await user.keyboard('{Tab}');
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each(accordionIcons)(
    `Has correct icon when icon variant is set to %s`,
    (iconVariant) => {
      render({ iconVariant });
      const otherVariants = accordionIcons.filter((v) => v !== iconVariant);
      expect(screen.getByTestId(iconVariant)).toBeInTheDocument();
      otherVariants.forEach((v) => {
        expect(screen.queryByTestId(v)).not.toBeInTheDocument();
      });
    },
  );
});
