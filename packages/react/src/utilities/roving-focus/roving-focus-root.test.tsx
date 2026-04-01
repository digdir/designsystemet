import { render, screen } from '@testing-library/react';
import { RovingFocusItem } from './roving-focus-item';
import { RovingFocusRoot } from './roving-focus-root';

describe('RovingFocusRoot', () => {
  it('can navigate with tab and arrow keys', () => {
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
    item1.focus();
    expect(item1).toHaveFocus();
    item1.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(item2).toHaveFocus();
    item2.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(item3).toHaveFocus();
    item3.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(item1).toHaveFocus();
    item1.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    expect(item3).toHaveFocus();
    item3.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    expect(item2).toHaveFocus();
    item2.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    expect(item1).toHaveFocus();
  });

  it('can navigate with tab and arrow keys with custom value', () => {
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

    item1.focus();
    expect(item1).toHaveFocus();
    item1.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(item2).toHaveFocus();
    item2.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(item3).toHaveFocus();
    item3.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(item1).toHaveFocus();
    item1.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    expect(item3).toHaveFocus();
    item3.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    expect(item2).toHaveFocus();
    item2.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    expect(item1).toHaveFocus();
  });
});
