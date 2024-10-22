import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import type { FieldsetProps } from './Fieldset';
import { Fieldset } from './Fieldset';
import type { FormField } from './useFormField';
import { useFormField } from './useFormField';

const createWrapper = (Wrapper: typeof Fieldset, props?: FieldsetProps) => {
  return ({ children }: { children: ReactNode }) => (
    <Wrapper legend='Wrapper' {...props}>
      {children}
    </Wrapper>
  );
};

describe('useFormField', () => {
  test('has correct error props when error is string', () => {
    const { result } = renderHook(
      () => useFormField({ error: 'error' }, 'test'),
      { wrapper: createWrapper(Fieldset) },
    );

    const field = result.current;

    expect(field.hasError).toBeTruthy();
    expect(field.errorId).toBeDefined();
    expect(field.inputProps['aria-invalid']).toBeTruthy();
    expect(field.inputProps['aria-describedby']).toEqual(field.errorId);
  });

  test('has correct error props when error is boolean', () => {
    const { result } = renderHook(() => useFormField({ error: true }, 'test'), {
      wrapper: createWrapper(Fieldset),
    });

    const field = result.current;

    expect(field.hasError).toBeTruthy();
    expect(field.errorId).toBeDefined();
    expect(field.inputProps['aria-invalid']).toBeTruthy();
    expect(field.inputProps['aria-describedby']).toEqual(field.errorId);
  });

  test('has correct error props when Fieldset has error', () => {
    const { result } = renderHook<FormField, FieldsetProps>(
      () => useFormField({}, 'test'),
      {
        wrapper: createWrapper(Fieldset, { error: 'error', legend: 'Wrapper' }),
      },
    );

    const field = result.current;

    expect(field.hasError).toBeTruthy();
    expect(field.errorId).toBeDefined();
    expect(field.inputProps['aria-invalid']).toBeTruthy();
    expect(
      field.inputProps['aria-describedby']?.includes(field.errorId),
    ).toBeFalsy();
    expect(
      field.inputProps['aria-describedby']?.includes('fieldset-error'),
    ).toBeTruthy();
  });

  test('has correct description props', () => {
    const { result } = renderHook(
      () => useFormField({ description: 'description' }, 'test'),
      { wrapper: createWrapper(Fieldset) },
    );

    const field = result.current;

    expect(field.hasError).toBeFalsy();
    expect(field.inputProps.id).toBeDefined();
    expect(field.inputProps['aria-invalid']).toBeFalsy();
    expect(field.inputProps['aria-describedby']).toEqual(field.descriptionId);
  });
  test('has overridden internal id and error id', () => {
    const { result } = renderHook(
      () => useFormField({ errorId: 'my errorId', id: 'my id' }, 'test'),
      { wrapper: createWrapper(Fieldset) },
    );

    const field = result.current;

    expect(field.errorId).toEqual('my errorId');
    expect(field.inputProps.id).toEqual('my id');
  });

  test('is disabled', () => {
    const { result } = renderHook(
      () => useFormField({ disabled: true }, 'test'),
      { wrapper: createWrapper(Fieldset) },
    );

    const field = result.current;

    expect(field.inputProps.disabled).toBeTruthy();
  });

  test('has correct size', () => {
    const { result } = renderHook(() => useFormField({ size: 'sm' }, 'test'), {
      wrapper: createWrapper(Fieldset),
    });

    const field = result.current;

    expect(field.size).toEqual('sm');
  });
  test('has correct values inherited from Fieldset', () => {
    const { result } = renderHook<FormField, FieldsetProps>(
      () => useFormField({}, 'test'),
      {
        wrapper: createWrapper(Fieldset, {
          disabled: true,
          size: 'sm',
          legend: 'Wrapper',
        }),
      },
    );

    const field = result.current;

    expect(field.size).toEqual('sm');
    expect(field.inputProps.disabled).toBeTruthy();
  });

  test('has undefined aria-describedby', () => {
    const { result } = renderHook<FormField, FieldsetProps>(() =>
      useFormField({}, 'test'),
    );

    const field = result.current;

    expect(field.inputProps['aria-describedby']).toBeUndefined();
  });
});
