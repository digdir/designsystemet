import React from 'react';
import userEvent from '@testing-library/user-event';
import { render as renderRtl, screen } from '@testing-library/react';

import type { AccordionProps } from './Accordion';
import { Accordion } from './Accordion';
import { AccordionContent } from './AccordionContent';
import { accordionIcons } from './Context';
import { AccordionHeader } from './AccordionHeader';

// Test data:
const header = 'AccordionHeader';
const content = 'AccordionContent';
const defaultProps: AccordionProps = {
  children: (
    <>
      <AccordionHeader>{header}</AccordionHeader>
      <AccordionContent>{content}</AccordionContent>
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

const render = (props: Partial<AccordionProps> = {}) =>
  renderRtl(
    <Accordion
      {...defaultProps}
      {...props}
    />,
  );

const user = userEvent.setup();

describe('Accordion', () => {
  it('Calls onClick when AccordionHeader is clicked', async () => {
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

  it('Calls onClick when AccordionHeader is clicked using the Space key', async () => {
    const onClick = jest.fn();
    render({ onClick });
    const accordionHeader = screen.getByRole('button', { name: header });
    await user.type(accordionHeader, '{Space}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Calls handleClick when AccordionHeader is clicked using the Enter key', async () => {
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
