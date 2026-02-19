/// <reference types="@testing-library/jest-dom" />

import * as floating from '@floating-ui/dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

const setupPopover = () => {
  const source = document.createElement('button');
  source.textContent = 'Open';
  const popover = document.createElement('div');
  popover.id = 'test-popover';
  popover.style.setProperty('--_ds-floating', 'bottom');
  document.body.appendChild(source);
  document.body.appendChild(popover);
  return { source, popover };
};

const dispatchToggle = (
  popover: HTMLElement,
  source: HTMLElement | undefined,
  newState: 'open' | 'closed',
) => {
  const event = new Event('toggle') as Event & {
    newState?: string;
    oldState?: string;
    source?: HTMLElement;
  };
  event.newState = newState;
  event.oldState = newState === 'open' ? 'closed' : 'open';
  event.source = source;
  popover.dispatchEvent(event);
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('popover behavior', () => {
  it('positions the popover on open', async () => {
    const { source, popover } = setupPopover();

    const cleanup = vi.fn();
    vi.spyOn(floating, 'autoUpdate').mockImplementation(
      (_source, _popover, callback) => {
        void callback();
        return cleanup;
      },
    );
    vi.spyOn(floating, 'computePosition').mockResolvedValue({
      x: 12,
      y: 34,
      placement: 'bottom',
      strategy: 'absolute',
      middlewareData: {},
    } as unknown as floating.ComputePositionReturn);

    dispatchToggle(popover, source, 'open');

    await vi.waitUntil(() => popover.style.translate === '12px 34px');

    expect(floating.autoUpdate).toHaveBeenCalledTimes(1);
    expect(floating.computePosition).toHaveBeenCalledWith(
      source,
      popover,
      expect.objectContaining({ placement: 'bottom' }),
    );
  });

  it('cleans up auto positioning on close', async () => {
    const { source, popover } = setupPopover();

    const cleanup = vi.fn();
    vi.spyOn(floating, 'autoUpdate').mockImplementation(
      (_source, _popover, callback) => {
        void callback();
        return cleanup;
      },
    );
    vi.spyOn(floating, 'computePosition').mockResolvedValue({
      x: 0,
      y: 0,
      placement: 'bottom',
      strategy: 'absolute',
      middlewareData: {},
    } as unknown as floating.ComputePositionReturn);

    dispatchToggle(popover, source, 'open');

    await vi.waitUntil(() => popover.style.display === 'none');

    dispatchToggle(popover, source, 'closed');

    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
