import { render as renderRtl, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

import { TextArea } from './TextArea';
import type { TextAreaProps } from './TextArea';

const user = userEvent.setup();

describe('TextArea', () => {

  it('Triggers onPaste when pasting into input', async () => {
    const onPaste = jest.fn();
    const data = 'Hello world';
    render({ onPaste });
    const element = screen.getByRole('textbox');
    await user.click(element);
    await user.paste(data);
    //fireEvent(element, paste);
    expect(onPaste).toHaveBeenCalledTimes(1);
    expect(onPaste).toHaveBeenCalledWith(expect.objectContaining({
      clipboardData: expect.objectContaining({
        items: [expect.objectContaining({ data })]
      })
    }));
  });

  it('Triggers onBlur event when field loses focus', async () => {
    const onBlur = jest.fn();
    render({ onBlur });
    const element = screen.getByRole('textbox');
    await user.click(element);
    expect(element).toHaveFocus();
    await user.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('Triggers onChange event for each keystroke', async () => {
    const onChange = jest.fn();
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
});

const render = (props: Partial<TextAreaProps> = {}) =>
  renderRtl(<TextArea id='id' onChange={jest.fn()} {...props} />);
