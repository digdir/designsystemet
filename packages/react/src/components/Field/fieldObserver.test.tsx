import { render, screen } from '@testing-library/react';

import { Button, Input, Label, Select, Textarea } from '../..';
import { fieldObserver } from './fieldObserver';

describe('fieldObserver', () => {
  it('connects input and label', () => {
    const { container } = render(
      <div>
        <Label>Navn</Label>
        <Input />
      </div>,
    );
    fieldObserver(container);

    const label = screen.getByText('Navn');
    const input = screen.getByLabelText('Navn');

    expect(label).toHaveAttribute('for', input.id);
  });
  it('works with textarea', () => {
    const { container } = render(
      <div>
        <Label>Navn</Label>
        <Textarea />
      </div>,
    );
    fieldObserver(container);

    const label = screen.getByText('Navn');
    const input = screen.getByLabelText('Navn');

    expect(label).toHaveAttribute('for', input.id);
  });

  it('works with Select', () => {
    const { container } = render(
      <div>
        <Label>Navn</Label>
        <Select>
          <Select.Option value='1'>Option 1</Select.Option>
          <Select.Option value='2'>Option 2</Select.Option>
        </Select>
      </div>,
    );
    fieldObserver(container);

    const label = screen.getByText('Navn');
    const input = screen.getByLabelText('Navn');

    expect(label).toHaveAttribute('for', input.id);
  });

  it('does not apply to button', () => {
    const { container } = render(
      <div>
        <Button>Button</Button>
      </div>,
    );
    fieldObserver(container);

    const button = screen.getByText('Button');

    expect(button).not.toHaveAttribute('id');
  });

  it('will pass through a user-supplied id', () => {
    const { container } = render(
      <div>
        <Label>Navn</Label>
        <Input id='test' />
      </div>,
    );
    fieldObserver(container);

    const input = screen.getByLabelText('Navn');

    expect(input).toHaveAttribute('id', 'test');
  });

  it('connects input and elements with data-field using aria-describedby', () => {
    const { container } = render(
      <div>
        <Label>Navn</Label>
        <Input />
        <div data-field='description'>Description</div>
      </div>,
    );
    fieldObserver(container);

    const description = screen.getByText('Description');
    const input = screen.getByLabelText('Navn');

    expect(description).toHaveAttribute('id', `${input.id}:description`);
    expect(input).toHaveAttribute(
      'aria-describedby',
      `${input.id}:description`,
    );
  });
});
