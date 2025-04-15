import { renderHook } from '@testing-library/react';
import * as React from 'react';
import { useMergeRefs } from './useMergeRefs';

describe('useMergeRefs', () => {
  it('should return null if all refs are null or undefined', () => {
    const { result } = renderHook(() => useMergeRefs([null, undefined]));
    expect(result.current).toBeNull();
  });

  it('should call all ref callbacks with the instance', () => {
    const ref1 = vi.fn();
    const ref2 = vi.fn();
    const { result } = renderHook(() => useMergeRefs([ref1, ref2]));

    const instance = {};
    result.current?.(instance);

    expect(ref1).toHaveBeenCalledWith(instance);
    expect(ref2).toHaveBeenCalledWith(instance);
  });

  it('should set the current property of ref objects', () => {
    const ref1 = React.createRef();
    const ref2 = React.createRef();
    const { result } = renderHook(() => useMergeRefs([ref1, ref2]));

    const instance = {};
    result.current?.(instance);

    expect(ref1.current).toBe(instance);
    expect(ref2.current).toBe(instance);
  });

  it('should clean up ref callbacks when instance is set to null', () => {
    const ref1 = vi.fn();
    const ref2 = vi.fn();
    const { result } = renderHook(() => useMergeRefs([ref1, ref2]));

    const instance = {};
    result.current?.(instance);
    result.current?.(null);

    expect(ref1).toHaveBeenCalledWith(null);
    expect(ref2).toHaveBeenCalledWith(null);
  });

  it('should clean up ref objects when instance is set to null', () => {
    const ref1 = React.createRef();
    const ref2 = React.createRef();
    const { result } = renderHook(() => useMergeRefs([ref1, ref2]));

    const instance = {};
    result.current?.(instance);
    result.current?.(null);

    expect(ref1.current).toBeNull();
    expect(ref2.current).toBeNull();
  });

  it('should handle a mix of callback refs and object refs', () => {
    const refCallback = vi.fn();
    const refObject = React.createRef();
    const { result } = renderHook(() => useMergeRefs([refCallback, refObject]));

    const instance = {};
    result.current?.(instance);

    expect(refCallback).toHaveBeenCalledWith(instance);
    expect(refObject.current).toBe(instance);

    result.current?.(null);

    expect(refCallback).toHaveBeenCalledWith(null);
    expect(refObject.current).toBeNull();
  });
});
