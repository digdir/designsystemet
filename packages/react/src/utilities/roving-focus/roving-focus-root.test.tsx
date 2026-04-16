import { act, render, screen } from '@testing-library/react';
import { RovingFocusItem } from './roving-focus-item';
import { RovingFocusRoot } from './roving-focus-root';

const keydown = (el: Element, key: string) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

describe('RovingFocusRoot', () => {
  beforeEach(() => {
    window.dsWarnings = false; // Suppress warnings about RovingFocus being deprecated
  });
  afterEach(() => {
    window.dsWarnings = true; // Re-enable warnings after tests
  });
  it('can navigate with tab and arrow keys', async () => {
    render(
      <RovingFocusRoot>
        <RovingFocusItem>test</RovingFocusItem>
        <RovingFocusItem>test2</RovingFocusItem>
        <RovingFocusItem>test3</RovingFocusItem>
      </RovingFocusRoot>,
    );

    const item1 = screen.getByText('test');
    const item2 = screen.getByText('test2');
    const item3 = screen.getByText('test3');

    await act(async () => item1.focus());
    expect(item1).toHaveFocus();

    await act(async () => keydown(item1, 'ArrowRight'));
    expect(item2).toHaveFocus();

    await act(async () => keydown(item2, 'ArrowRight'));
    expect(item3).toHaveFocus();

    await act(async () => keydown(item3, 'ArrowRight'));
    expect(item1).toHaveFocus();

    await act(async () => keydown(item1, 'ArrowLeft'));
    expect(item3).toHaveFocus();

    await act(async () => keydown(item3, 'ArrowLeft'));
    expect(item2).toHaveFocus();

    await act(async () => keydown(item2, 'ArrowLeft'));
    expect(item1).toHaveFocus();
  });

  it('can navigate with tab and arrow keys with custom value', async () => {
    render(
      <RovingFocusRoot>
        <RovingFocusItem data-testid='id1' value='banana'>
          test
        </RovingFocusItem>
        <RovingFocusItem data-testid='id2' value='strawberry'>
          test
        </RovingFocusItem>
        <RovingFocusItem data-testid='id3' value='chocolate'>
          test
        </RovingFocusItem>
      </RovingFocusRoot>,
    );

    const item1 = screen.getByTestId('id1');
    const item2 = screen.getByTestId('id2');
    const item3 = screen.getByTestId('id3');

    await act(async () => item1.focus());
    expect(item1).toHaveFocus();

    await act(async () => keydown(item1, 'ArrowRight'));
    expect(item2).toHaveFocus();

    await act(async () => keydown(item2, 'ArrowRight'));
    expect(item3).toHaveFocus();

    await act(async () => keydown(item3, 'ArrowRight'));
    expect(item1).toHaveFocus();

    await act(async () => keydown(item1, 'ArrowLeft'));
    expect(item3).toHaveFocus();

    await act(async () => keydown(item3, 'ArrowLeft'));
    expect(item2).toHaveFocus();

    await act(async () => keydown(item2, 'ArrowLeft'));
    expect(item1).toHaveFocus();
  });
});
