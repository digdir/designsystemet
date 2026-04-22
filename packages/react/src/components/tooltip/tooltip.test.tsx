import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { Tooltip } from './tooltip';

describe('Tooltip', () => {
  it('should render child', () => {
    render(
      <Tooltip content='text'>
        <button>Button</button>
      </Tooltip>,
    );
    const tooltipTrigger = screen.getByRole('button');
    expect(tooltipTrigger).toBeInTheDocument();
    vi.waitFor(
      () => expect(tooltipTrigger).toHaveAttribute('aria-description', 'text'), // Let MutationObserver run first
    );
  });

  it('should render tooltip on hover', async () => {
    const content = 'Unique content for hover-test';
    render(
      <Tooltip content={content}>
        <button>Button</button>
      </Tooltip>,
    );

    const tooltipTrigger = screen.getByRole('button');
    expect(screen.queryByText(content)).not.toBeInTheDocument();

    const hover = new MouseEvent('mouseover', { bubbles: true });
    await act(async () => tooltipTrigger.dispatchEvent(hover));

    const tooltip = await screen.findByText(content);
    expect(tooltip).toBeVisible();
    expect(screen.getByText(content)).toBeVisible();
  });

  it('should render tooltip on focus', async () => {
    const content = 'Unique content for focus-test';
    render(
      <Tooltip content={content}>
        <button>Button</button>
      </Tooltip>,
    );

    expect(screen.queryByText(content)).not.toBeInTheDocument();
    await act(async () => screen.getByRole('button').focus());
    const tooltip = screen.getByText(content);
    expect(tooltip).toBeVisible();
  });

  it('should render span when children is a string', () => {
    const children = 'My string child';
    render(<Tooltip content='text'>{children}</Tooltip>);

    const tooltipTrigger = screen.getByText(children);
    expect(tooltipTrigger.tagName).toBe('SPAN');
  });

  it('should be aria-describedby when there is text in the trigger', () => {
    render(
      <Tooltip content='text'>
        <button>text</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-describedby')).toBeDefined();
  });

  it('should be aria-labelledby when there is no text in the trigger', () => {
    render(
      <Tooltip content='text'>
        <button />
      </Tooltip>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-labelledby')).toBeDefined();
  });
});
