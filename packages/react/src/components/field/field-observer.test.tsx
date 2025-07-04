import { render, screen } from '@testing-library/react';

import { Button, Input, Label, Select, Textarea } from '../..';
import { fieldObserver } from './field-observer';

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

    expect(description).toHaveAttribute('id', `${input.id}:description:1`);
    expect(input).toHaveAttribute(
      'aria-describedby',
      `${input.id}:description:1`,
    );
  });
  it('assigns unique IDs to multiple elements with the same data-field type', () => {
    const { container } = render(
      <div>
        <Label>Name</Label>
        <Input />
        <div data-field='validation'>First validation message</div>
        <div data-field='validation'>Second validation message</div>
        <div data-field='description'>Description text</div>
        <div data-field='description'>Additional description</div>
      </div>,
    );
    fieldObserver(container);

    const input = screen.getByLabelText('Name');
    const firstValidation = screen.getByText('First validation message');
    const secondValidation = screen.getByText('Second validation message');
    const firstDescription = screen.getByText('Description text');
    const secondDescription = screen.getByText('Additional description');

    // First of each type gets the simple format
    expect(firstValidation).toHaveAttribute('id', `${input.id}:validation:1`);
    expect(firstDescription).toHaveAttribute('id', `${input.id}:description:1`);

    // Subsequent ones get numbered
    expect(secondValidation).toHaveAttribute('id', `${input.id}:validation:2`);
    expect(secondDescription).toHaveAttribute(
      'id',
      `${input.id}:description:2`,
    );

    // All should be in aria-describedby
    const ariaDescribedby = input.getAttribute('aria-describedby');
    expect(ariaDescribedby).toContain(firstValidation.id);
    expect(ariaDescribedby).toContain(secondValidation.id);
    expect(ariaDescribedby).toContain(firstDescription.id);
    expect(ariaDescribedby).toContain(secondDescription.id);
  });
});
