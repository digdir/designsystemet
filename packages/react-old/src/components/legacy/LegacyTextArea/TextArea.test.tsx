import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LegacyTextArea } from './TextArea';
import type { LegacyTextAreaProps } from './TextArea';

const user = userEvent.setup();

describe('LegacyTextArea', () => {
  it('Triggers onPaste when pasting into input', async () => {
    const onPaste = vi.fn();
    const data = 'Hello world';
    render({ onPaste });
    const element = screen.getByRole('textbox');
    await user.click(element);
    await user.paste(data);
    //fireEvent(element, paste);
    expect(onPaste).toHaveBeenCalledTimes(1);
    expect(onPaste).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        clipboardData: expect.objectContaining({
          items: [expect.objectContaining({ data })],
        }),
      }),
    );
  });

  it('Triggers onBlur event when field loses focus', async () => {
    const onBlur = vi.fn();
    render({ onBlur });
    const element = screen.getByRole('textbox');
    await user.click(element);
    expect(element).toHaveFocus();
    await user.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('Triggers onChange event for each keystroke', async () => {
    const onChange = vi.fn();
    const data = 'test';
    render({ onChange });
    const element = screen.getByRole('textbox');
    await user.click(element);
    expect(element).toHaveFocus();
    await user.keyboard(data);
    expect(onChange).toHaveBeenCalledTimes(data.length);
  });

  it('Focuses on text area when label is clicked', async () => {
    const label = 'Lorem ipsum';
    render({ label });
    await user.click(screen.getByText(label));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('should have max allowed characters label for screen readers', () => {
    render({
      characterLimit: {
        maxCount: 10,
        srLabel: 'Max 10 characters is allowed',
        label: (count: number) => `${count} characters remaining`,
      },
    });
    const screenReaderText = screen.getByText('Max 10 characters is allowed');
    expect(screenReaderText).toBeInTheDocument();
  });

  it('should countdown remaining characters', async () => {
    const user = userEvent.setup();
    render({
      label: 'First name',
      characterLimit: {
        maxCount: 10,
        label: (count: number) => `${count} characters remaining`,
        srLabel: 'characters remaining',
      },
    });
    const inputField = screen.getByLabelText('First name');
    await user.type(inputField, 'Peter');
    expect(screen.getByText('5 characters remaining')).toBeInTheDocument();
  });
});

const render = (props: Partial<LegacyTextAreaProps> = {}) =>
  renderRtl(
    <LegacyTextArea
      id='id'
      onChange={vi.fn()}
      {...props}
    />,
  );
