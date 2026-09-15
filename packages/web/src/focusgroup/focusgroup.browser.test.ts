// Many of these tests are based on https://github.com/microsoft/polyfills/tree/main/packages/focusgroup

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { getGroup, getItems, isConflict, isFocusable } from './focusgroup';

const setupPageWithShadowRoots = (html: string) => {
  document.body.innerHTML = html;

  const selector = 'template[shadowrootmode]';
  const templates = Array.from(document.querySelectorAll(selector));

  while (templates.length) {
    const template = templates.pop() as HTMLTemplateElement;
    const host = template.parentElement;
    if (!host || host.shadowRoot) continue;

    const mode = template.getAttribute('shadowrootmode') as ShadowRootMode;
    const root = host.attachShadow({ mode: mode ?? 'open' });
    root.append(template.content.cloneNode(true));
    templates.push(...root.querySelectorAll(selector));
    template.remove();
  }
};

const getById = (id: string) => document.getElementById(id) as HTMLElement;
const useTab = async (opts?: Parameters<typeof userEvent.tab>[0]) => {
  await userEvent.tab(opts);
  vi.advanceTimersByTime(100);
};

// Use fake timers to allow setTab to run
beforeEach(() => vi.useFakeTimers());
afterEach(async () => {
  await vi.runOnlyPendingTimersAsync();
  vi.useRealTimers();
  document.body.innerHTML = '';
});

test('does not move when focused on focusgroup root', async () => {
  document.body.innerHTML = `<div id="root" tabindex="0" focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;
  const root = document.getElementById('root') as HTMLElement;

  root.focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(root).toHaveFocus();

  await userEvent.keyboard('{ArrowLeft}');
  expect(root).toHaveFocus();
});

test('does not move when focused on element that is not a focusgroup item', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>
    <span id="nonitem1" tabindex="0">nonitem1</span>`;

  const nonitem = document.getElementById('nonitem1') as HTMLElement;
  nonitem.focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(nonitem).toHaveFocus();

  await userEvent.keyboard('{ArrowLeft}');
  expect(nonitem).toHaveFocus();
});

test('does not move when there is only one item even with wrap', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block wrap">
      <span id="item1" tabindex="0">item1</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item1')).toHaveFocus();

  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item1')).toHaveFocus();
});

test('does not move when there is only one item', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item1')).toHaveFocus();

  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item1')).toHaveFocus();
});

test('does not move when focused on element outside focusgroup', async () => {
  document.body.innerHTML = `<span id="out" tabindex="0">out</span>
    <div focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('out').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('out')).toHaveFocus();

  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('out')).toHaveFocus();
});

test('does not wrap backward when wrap is not specified', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item1')).toHaveFocus();

  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item1')).toHaveFocus();
});

test('moves to previous item and skips non-focusable elements', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2">item2</span>
      <span id="item3" tabindex="0">item3</span>
    </div>`;

  getById('item3').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item1')).toHaveFocus();

  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item1')).toHaveFocus();
});

test('moves to previous item on ArrowUp and ArrowLeft', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item2').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item1')).toHaveFocus();

  getById('item2').focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item1')).toHaveFocus();
});

test('skips focusgroup=none subtree when navigating backward', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block wrap">
      <span id="item1" tabindex="0">item1</span>
      <div focusgroup="none">
        <span id="item2" tabindex="0">item2</span>
        <span id="item3" tabindex="0">item3</span>
      </div>
      <span id="item4" tabindex="0">item4</span>
    </div>`;

  getById('item4').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item1')).toHaveFocus();

  getById('item4').focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item1')).toHaveFocus();
});

test('skips deeply nested root focusgroup subtrees when navigating backward (complex)', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block wrap">
      <span id="item1" tabindex="0">item1</span>
      <div>
        <div focusgroup="toolbar inline block">
          <div id="item2" tabindex="0">
            <div focusgroup="toolbar inline block">
              <span id="item3" tabindex="0">item3</span>
              <span id="item4" tabindex="0">item4</span>
            </div>
          </div>
        </div>
      </div>
      <span id="item5" tabindex="0">item5</span>
    </div>`;

  getById('item5').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item1')).toHaveFocus();

  getById('item5').focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item1')).toHaveFocus();
});

test('skips unrelated root focusgroup subtree when navigating backward', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block wrap">
      <span id="item1" tabindex="0">item1</span>
      <div>
        <div focusgroup="toolbar inline block">
          <span id="item2" tabindex="0">item2</span>
          <span id="item3" tabindex="0">item3</span>
        </div>
      </div>
      <span id="item4" tabindex="0">item4</span>
    </div>`;

  getById('item4').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item1')).toHaveFocus();

  getById('item4').focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item1')).toHaveFocus();
});

test('skip hidden candidates', async () => {
  document.body.innerHTML = `
    <div focusgroup="tablist">
      <button tabindex="0" id="item1">item1</button>
      <div hidden>
        <button tabindex="0">item2</button>
      </div>
      <button tabindex="0" id="item3">item3</button>
    </div>
  `;

  getById('item3').focus();
  await userEvent.keyboard('{ArrowLeft}');

  expect(getById('item1')).toHaveFocus();
});

test('wraps successfully when there are non-item elements before and after items', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block wrap">
      <div>
        <span id="nonitem1">nonitem1</span>
        <span id="nonitem2">nonitem2</span>
      </div>
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
      <span id="item3" tabindex="0">item3</span>
      <div>
        <span id="nonitem3">nonitem3</span>
        <span id="nonitem4">nonitem4</span>
      </div>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item3')).toHaveFocus();

  getById('item1').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item3')).toHaveFocus();
});

test('wraps successfully from first item to last', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block wrap">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
      <span id="item3" tabindex="0">item3</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item3')).toHaveFocus();

  getById('item1').focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item3')).toHaveFocus();
});

test('horizontal: does not ascend out of nested focusgroup when axis not supported', async () => {
  document.body.innerHTML = `<ul focusgroup="toolbar inline">
      <li id="item1" tabindex="0">
        <ul focusgroup="toolbar block">
          <li id="item2" tabindex="0">item2</li>
        </ul>
      </li>
    </ul>`;

  getById('item2').focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item2')).toHaveFocus();
});

test('horizontal: does not move when axis (ArrowLeft) is not supported (block only)', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item2').focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item2')).toHaveFocus();
});

test('horizontal: does not wrap when only block (vertical) axis is supported', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar block wrap">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
      <span id="item3" tabindex="0">item3</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item1')).toHaveFocus();
});

test('horizontal: moves when only horizontal axis (ArrowLeft) is supported (inline only)', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar inline">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item2').focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item1')).toHaveFocus();
});

test('horizontal: wraps backward when inline axis and wrap are supported', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline wrap">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
      <span id="item3" tabindex="0">item3</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('item3')).toHaveFocus();
});

test('vertical: does not ascend out of nested focusgroup when axis not supported', async () => {
  document.body.innerHTML = `<ul focusgroup="toolbar block">
      <li id="item1" tabindex="0">
        <ul focusgroup="toolbar inline">
          <li id="item2" tabindex="0">item2</li>
        </ul>
      </li>
    </ul>`;

  getById('item2').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item2')).toHaveFocus();
});

test('vertical: does not move when axis (ArrowUp) is not supported (inline only)', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar inline">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item2').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item2')).toHaveFocus();
});

test('vertical: does not wrap when only inline (horizontal) axis is supported', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline wrap">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
      <span id="item3" tabindex="0">item3</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item1')).toHaveFocus();
});

test('vertical: moves when only vertical axis (ArrowUp) is supported (block only)', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item2').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item1')).toHaveFocus();
});

test('vertical: wraps backward when block axis and wrap are supported', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar block wrap">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
      <span id="item3" tabindex="0">item3</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(getById('item3')).toHaveFocus();
});

describe('nested focusgroup is not an item of parent focusgroup', () => {
  test('arrow left at first item of inner does not bleed into parent (no wrap)', async () => {
    document.body.innerHTML = `<div id="outer" focusgroup="toolbar nomemory">
        <button tabindex="0" id="btn1">btn1</button>
        <div id="inner" focusgroup="toolbar nomemory">
          <button tabindex="0" id="inner_btn1">inner btn1</button>
          <button tabindex="0" id="inner_btn2">inner btn2</button>
        </div>
        <button tabindex="0" id="btn4">btn4</button>
      </div>`;

    getById('inner_btn1').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('inner_btn1')).toHaveFocus();
  });

  test("inner backward navigation moves to previous inner item, not parent's previous item", async () => {
    document.body.innerHTML = `<div id="outer" focusgroup="toolbar nomemory">
        <button tabindex="0" id="btn1">btn1</button>
        <div id="inner" focusgroup="toolbar nomemory">
          <button tabindex="0" id="inner_btn1">inner btn1</button>
          <button tabindex="0" id="inner_btn2">inner btn2</button>
        </div>
        <button tabindex="0" id="btn4">btn4</button>
      </div>`;

    getById('inner_btn2').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('inner_btn1')).toHaveFocus();
  });
});

describe('behavior token can appear in any position', () => {
  const defs = [
    { focusgroup: 'toolbar', valid: true },
    { focusgroup: 'tablist inline', valid: true },
    { focusgroup: 'radiogroup wrap', valid: true },
    { focusgroup: 'wrap tablist', valid: true },
    { focusgroup: 'inline menubar', valid: true },
    { focusgroup: '', valid: false },
    { focusgroup: 'inline', valid: false },
    { focusgroup: 'wrap', valid: false },
  ];

  for (const def of defs) {
    const testName = [
      def.valid ? 'valid' : 'invalid',
      `'${def.focusgroup}'`,
      'attribute value',
      def.valid ? 'enables' : 'doesn’t enable',
      'navigation',
    ].join(' ');

    test(testName, async () => {
      document.body.innerHTML = `
        <div focusgroup="${def.focusgroup}">
          <span id="item1" tabindex="0">item 1</span>
          <span id="item2" tabindex="0">item 2</span>
        </div>
      `;

      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');

      if (def.valid) {
        expect(getById('item2')).toHaveFocus();
      } else {
        expect(getById('item1')).toHaveFocus();
      }
    });
  }
});

describe('behavior tokens comprehensive', () => {
  describe('toolbar: inline only, no wrap', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="toolbar">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
          <button tabindex="0" id="item3">item3</button>
        </div>
      `;
    });

    test('toolbar: ArrowRight navigates (inline)', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item2')).toHaveFocus();
    });

    test('toolbar: ArrowDown blocked (inline-only)', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item1')).toHaveFocus();
    });

    test('toolbar: does not wrap', async () => {
      getById('item3').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item3')).toHaveFocus();
    });
  });

  describe('tablist: inline + wrap', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="tablist">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
          <button tabindex="0" id="item3">item3</button>
        </div>
      `;
    });

    test('tablist: ArrowRight navigates (inline)', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item2')).toHaveFocus();
    });

    test('tablist: ArrowDown blocked (inline-only)', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item1')).toHaveFocus();
    });

    test('tablist: wraps', async () => {
      getById('item3').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item1')).toHaveFocus();
    });
  });

  describe('menu: block + wrap', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="menu">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
          <button tabindex="0" id="item3">item3</button>
        </div>
      `;
    });

    test('menu: ArrowDown navigates (block)', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item2')).toHaveFocus();
    });

    test('menu: ArrowRight blocked (block-only)', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item1')).toHaveFocus();
    });

    test('menu: wraps', async () => {
      getById('item3').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item1')).toHaveFocus();
    });
  });

  describe('menubar: inline + wrap', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="menubar">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
          <button tabindex="0" id="item3">item3</button>
        </div>
      `;
    });

    test('menubar: ArrowRight navigates (inline)', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item2')).toHaveFocus();
    });

    test('menubar: ArrowDown blocked (inline-only)', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item1')).toHaveFocus();
    });

    test('menubar: wraps', async () => {
      getById('item3').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item1')).toHaveFocus();
    });
  });

  describe('radiogroup: both axes, wrap', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="radiogroup">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
          <button tabindex="0" id="item3">item3</button>
        </div>
      `;
    });

    test('radiogroup: ArrowRight navigates', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item2')).toHaveFocus();
    });

    test('radiogroup: ArrowDown navigates', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item2')).toHaveFocus();
    });

    test('radiogroup: wraps', async () => {
      getById('item3').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item1')).toHaveFocus();
    });
  });

  describe('listbox: block only, no wrap', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="listbox">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
          <button tabindex="0" id="item3">item3</button>
        </div>
      `;
    });

    test('listbox: ArrowRight doesn’t navigate', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item1')).toHaveFocus();
    });

    test('listbox: ArrowDown navigates', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item2')).toHaveFocus();
    });

    test('listbox: does not wrap', async () => {
      getById('item3').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item3')).toHaveFocus();
    });
  });

  describe('none: opt-out', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="none">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
        </div>
      `;
    });

    test('none: no navigation', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item1')).toHaveFocus();

      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item1')).toHaveFocus();
    });
  });

  describe('tablist block: explicit block overrides default inline', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="tablist block">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
          <button tabindex="0" id="item3">item3</button>
        </div>
      `;
    });

    test('tablist block: ArrowDown navigates', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item2')).toHaveFocus();
    });

    test('tablist block: ArrowRight blocked', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item1')).toHaveFocus();
    });

    test('tablist block: wraps', async () => {
      getById('item3').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item1')).toHaveFocus();
    });
  });

  describe('tablist nowrap: suppresses default wrap', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="tablist nowrap">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
          <button tabindex="0" id="item3">item3</button>
        </div>
      `;
    });

    test('tablist nowrap: ArrowRight navigates', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item2')).toHaveFocus();
    });

    test('tablist nowrap: does not wrap', async () => {
      getById('item3').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item3')).toHaveFocus();
    });
  });

  describe('menu inline: explicit inline overrides default block', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="menu inline">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
          <button tabindex="0" id="item3">item3</button>
        </div>
      `;
    });

    test('menu inline: ArrowRight navigates', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item2')).toHaveFocus();
    });

    test('menu inline: ArrowDown blocked', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item1')).toHaveFocus();
    });

    test('menu inline: wraps', async () => {
      getById('item3').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item1')).toHaveFocus();
    });
  });

  describe('listbox inline wrap: explicit inline overrides default both axes and suppress default nowrap', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="listbox inline wrap">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
          <button tabindex="0" id="item3">item3</button>
        </div>
      `;
    });

    test('listbox inline: ArrowRight navigates', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item2')).toHaveFocus();
    });

    test('listbox inline: ArrowDown blocked', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item1')).toHaveFocus();
    });

    test('listbox inline: wraps', async () => {
      getById('item3').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item1')).toHaveFocus();
    });
  });

  describe('tablist both axes', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="tablist inline block">
          <button tabindex="0" id="item1">item1</button>
          <button tabindex="0" id="item2">item2</button>
          <button tabindex="0" id="item3">item3</button>
        </div>
      `;
    });

    test('tablist block: ArrowDown navigates', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item2')).toHaveFocus();
    });

    test('tablist block: ArrowRight navigates', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(getById('item2')).toHaveFocus();
    });

    test('tablist block: wraps', async () => {
      getById('item3').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(getById('item1')).toHaveFocus();
    });
  });
});

test('simple descendant navigation works', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar">
      <button tabindex="0" id="item1" >Item 1</button>
      <div>
        <button tabindex="0" id="item2" >Item 2 (nested)</button>
      </div>
      <button tabindex="0" id="item3" >Item 3</button>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item2')).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item3')).toHaveFocus();
});

describe('deeply nested items navigation', () => {
  test('forward navigation works with deeply nested focusgroup descendants', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar inline block">
        <span id="item1" tabindex="0">Item 1</span>
        <div class="container">
          <div class="sub-container">
            <div class="deep-container">
              <span id="item2" tabindex="0">Item 2 (deeply nested)</span>
            </div>
          </div>
        </div>
        <span>
          <span>
            <span id="item3" tabindex="0">Item 3 (nested in spans)</span>
          </span>
        </span>
        <div>
          <p>Some text</p>
          <div>
            <span id="item4" tabindex="0">Item 4 (nested)</span>
          </div>
        </div>
        <span id="item5" tabindex="0">Item 5</span>
      </div>`;

    getById('item1').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item2')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item3')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item4')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item5')).toHaveFocus();
  });

  test('backward navigation works with deeply nested focusgroup descendants', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar">
        <span id="item1" tabindex="0">Item 1</span>
        <div class="container">
          <div class="sub-container">
            <div class="deep-container">
              <span id="item2" tabindex="0">Item 2 (deeply nested)</span>
            </div>
          </div>
        </div>
        <span>
          <span>
            <span id="item3" tabindex="0">Item 3 (nested in spans)</span>
          </span>
        </span>
        <div>
          <p>Some text</p>
          <div>
            <span id="item4" tabindex="0">Item 4 (nested)</span>
          </div>
        </div>
        <span id="item5" tabindex="0">Item 5</span>
      </div>`;

    getById('item5').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('item4')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('item3')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('item2')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('item1')).toHaveFocus();
  });

  test('vertical navigation works with nested descendants', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar block">
        <span id="item1" tabindex="0">Item 1</span>
        <div>
          <span id="item2" tabindex="0">Item 2 (nested)</span>
        </div>
      </div>`;

    getById('item1').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(getById('item2')).toHaveFocus();
  });
});

describe('wrapping with descendants', () => {
  test('forward wrapping should work from nested descendants to first item', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar inline block wrap">
        <div class="first-section">
          <button tabindex="0" id="first" >First Item</button>
        </div>
        <div class="middle-section">
          <div>
            <div>
              <button tabindex="0" id="middle" >Middle Item (nested)</button>
            </div>
          </div>
        </div>
        <div class="last-section">
          <span>
            <button tabindex="0" id="last" >Last Item</button>
          </span>
        </div>
      </div>`;

    getById('last').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('first')).toHaveFocus();
  });

  test('backward wrapping should work from first item to nested descendants', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar wrap">
        <div class="first-section">
          <button tabindex="0" id="first" >First Item</button>
        </div>
        <div class="last-section">
          <span>
            <button tabindex="0" id="last" >Last Item</button>
          </span>
        </div>
      </div>`;

    getById('first').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('last')).toHaveFocus();
  });

  test('normal navigation should still work correctly with nested items', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar wrap">
        <div>
          <button tabindex="0" id="first" >First Item</button>
        </div>
        <div>
          <div>
            <button tabindex="0" id="middle" >Middle Item (nested)</button>
          </div>
        </div>
        <div>
          <button tabindex="0" id="last" >Last Item</button>
        </div>
      </div>`;

    getById('first').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('middle')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('last')).toHaveFocus();
  });

  test('vertical wrapping works with nested descendants', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar block wrap">
        <div>
          <button tabindex="0" id="first" >First Item</button>
        </div>
        <div>
          <button tabindex="0" id="last" >Last Item</button>
        </div>
      </div>`;

    getById('last').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(getById('first')).toHaveFocus();
  });
});

test('navigation works with mixed content (buttons, links, inputs)', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar inline block">
      <button tabindex="0" id="btn1">Button 1</button>
      <div>
        <a id="link1" href="#">Link 1</a>
      </div>
      <div>
        <input id="input1" type="text">
      </div>
      <button tabindex="0" id="btn2">Button 2</button>
    </div>`;

  getById('btn1').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('link1')).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  expect(getById('input1')).toHaveFocus();

  await useTab();
  expect(getById('btn2')).toHaveFocus();
});

test('navigation works with various focusable element types', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar inline block">
      <button tabindex="0" id="btn">Button</button>
      <div>
        <div id="div" tabindex="0">Div with tabindex</div>
      </div>
      <div>
        <span id="span" tabindex="0">Span with tabindex</span>
      </div>
    </div>`;

  getById('btn').focus();
  expect(getById('btn')).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('div')).toHaveFocus();

  // await userEvent.keyboard('{ArrowRight}');
  // expect(getById('span')).toHaveFocus();
});

test('moves to next item on ArrowDown and ArrowRight', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getById('item2')).toHaveFocus();

  getById('item1').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item2')).toHaveFocus();
});

test('moves to next item and skips non-focusable elements', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2">item2</span>
      <span id="item3" tabindex="0">item3</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getById('item3')).toHaveFocus();

  getById('item1').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item3')).toHaveFocus();
});

test('does not move when focused on focusgroup root', async () => {
  document.body.innerHTML = `<div id="root" tabindex="0" focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('root').focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getById('root')).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  expect(getById('root')).toHaveFocus();
});

test('does not move when focused on focusable element that is not a focusgroup item', async () => {
  document.body.innerHTML = `<span id="nonitem1" tabindex="0">nonitem1</span>
    <div tabindex="0" focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('nonitem1').focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getById('nonitem1')).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  expect(getById('nonitem1')).toHaveFocus();
});

test('does not move when focused on element outside focusgroup', async () => {
  document.body.innerHTML = `<span id="out" tabindex="0">out</span>
    <div focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('out').focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getById('out')).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  expect(getById('out')).toHaveFocus();
});

test('does not move when there is only one item', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getById('item1')).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item1')).toHaveFocus();
});

test('does not move when there is only one item even with wrap', async () => {
  document.body.innerHTML = `<div focusgroup="toolbar inline block wrap">
      <span id="item1" tabindex="0">item1</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getById('item1')).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item1')).toHaveFocus();
});

test('does not wrap when wrap is not supported', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar inline block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item2').focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getById('item2')).toHaveFocus();

  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item2')).toHaveFocus();
});

test('wraps successfully from last item to first', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar inline block wrap">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item2').focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getById('item1')).toHaveFocus();

  getById('item2').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item1')).toHaveFocus();
});

describe('nested focusgroup is item of parent focusgroup', () => {
  test('arrow right navigates TO nested focusgroup element', async () => {
    document.body.innerHTML = `<button tabindex="0" id="before" >before</button>
      <div id="outer" focusgroup="toolbar nomemory">
        <button tabindex="0" id="btn1">btn1</button>
        <button tabindex="0" id="btn2">btn2</button>
        <button tabindex="0" id="btn3">btn3</button>
        <div id="inner" focusgroup="toolbar nomemory" tabindex="0">
          <button tabindex="0" id="inner_btn1">inner btn1</button>
          <button tabindex="0" id="inner_btn2">inner btn2</button>
          <button tabindex="0" id="inner_btn3">inner btn3</button>
        </div>
        <button tabindex="0" id="btn4">btn4</button>
      </div>
      <button tabindex="0" id="after" >after</button>`;

    getById('btn3').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('inner')).toHaveFocus();
  });

  test('arrow left navigates TO nested focusgroup element', async () => {
    document.body.innerHTML = `<div id="outer" focusgroup="toolbar nomemory">
        <button tabindex="0" id="btn3">btn3</button>
        <div id="inner" focusgroup="toolbar nomemory" tabindex="0">
          <button tabindex="0" id="inner_btn1">inner btn1</button>
        </div>
        <button tabindex="0" id="btn4">btn4</button>
      </div>`;

    getById('btn4').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('inner')).toHaveFocus();
  });

  test('arrow right from nested focusgroup navigates to next sibling in parent', async () => {
    document.body.innerHTML = `<div id="outer" focusgroup="toolbar nomemory">
        <button tabindex="0" id="btn3">btn3</button>
        <div id="inner" focusgroup="toolbar nomemory" tabindex="0">
          <button tabindex="0" id="inner_btn1">inner btn1</button>
        </div>
        <button tabindex="0" id="btn4">btn4</button>
      </div>`;

    getById('inner').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('btn4')).toHaveFocus();
  });

  test('arrow left from nested focusgroup navigates to previous sibling in parent', async () => {
    document.body.innerHTML = `<div id="outer" focusgroup="toolbar nomemory">
        <button tabindex="0" id="btn3">btn3</button>
        <div id="inner" focusgroup="toolbar nomemory" tabindex="0">
          <button tabindex="0" id="inner_btn1">inner btn1</button>
        </div>
        <button tabindex="0" id="btn4">btn4</button>
      </div>`;

    getById('inner').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('btn3')).toHaveFocus();
  });

  test('inner focusgroup navigation works independently', async () => {
    document.body.innerHTML = `<div id="outer" focusgroup="toolbar nomemory">
        <button tabindex="0" id="btn1">btn1</button>
        <div id="inner" focusgroup="toolbar nomemory" tabindex="0">
          <button tabindex="0" id="inner_btn1">inner btn1</button>
          <button tabindex="0" id="inner_btn2">inner btn2</button>
        </div>
        <button tabindex="0" id="btn4">btn4</button>
      </div>`;

    getById('inner_btn1').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('inner_btn2')).toHaveFocus();
  });
});

describe('nested focusgroup is not an item of parent focusgroup', () => {
  test('arrow right at last item of inner does not bleed into parent (no wrap)', async () => {
    document.body.innerHTML = `<div id="outer" focusgroup="toolbar nomemory">
        <button tabindex="0" id="btn1">btn1</button>
        <div id="inner" focusgroup="toolbar nomemory">
          <button tabindex="0" id="inner_btn1">inner btn1</button>
          <button tabindex="0" id="inner_btn2">inner btn2</button>
        </div>
        <button tabindex="0" id="btn4">btn4</button>
      </div>`;

    getById('inner_btn2').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('inner_btn2')).toHaveFocus();
  });

  test("inner navigation moves to next inner item, not parent's next item", async () => {
    document.body.innerHTML = `<div id="outer" focusgroup="toolbar nomemory">
        <button tabindex="0" id="btn1">btn1</button>
        <div id="inner" focusgroup="toolbar nomemory">
          <button tabindex="0" id="inner_btn1">inner btn1</button>
          <button tabindex="0" id="inner_btn2">inner btn2</button>
        </div>
        <button tabindex="0" id="btn4">btn4</button>
      </div>`;

    getById('inner_btn1').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('inner_btn2')).toHaveFocus();
  });

  test('Home/End at inner item operates within inner, not parent', async () => {
    document.body.innerHTML = `<div id="outer" focusgroup="toolbar nomemory">
        <button tabindex="0" id="btn1">btn1</button>
        <div id="inner" focusgroup="toolbar nomemory">
          <button tabindex="0" id="inner_btn1">inner btn1</button>
          <button tabindex="0" id="inner_btn2">inner btn2</button>
          <button tabindex="0" id="inner_btn3">inner btn3</button>
        </div>
        <button tabindex="0" id="btn4">btn4</button>
      </div>`;

    getById('inner_btn2').focus();
    await userEvent.keyboard('{End}');
    expect(getById('inner_btn3')).toHaveFocus();

    await userEvent.keyboard('{Home}');
    expect(getById('inner_btn1')).toHaveFocus();
  });

  test('axis-supported parent does not act on key the inner failed to handle (orthogonal axis)', async () => {
    document.body.innerHTML = `<div id="outer" focusgroup="toolbar inline">
        <button tabindex="0" id="btn1">btn1</button>
        <div id="inner" focusgroup="toolbar block">
          <button tabindex="0" id="inner_btn1">inner btn1</button>
          <button tabindex="0" id="inner_btn2">inner btn2</button>
        </div>
        <button tabindex="0" id="btn4">btn4</button>
      </div>`;

    getById('inner_btn1').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('inner_btn1')).toHaveFocus();
  });
});

describe("Arrow keys follow the focused element's writing direction", () => {
  describe('LTR container with RTL wrapper', () => {
    let item1: HTMLElement;
    let item2: HTMLElement;
    let item3: HTMLElement;
    let item4: HTMLElement;
    let item5: HTMLElement;

    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="toolbar">
          <div dir="rtl">
            <span id="item1" tabindex=0>One</span>
            <span id="item2" tabindex=0>Two</span>
          </div>
          <span id="item3" tabindex=0>Three</span>
          <span id="item4" tabindex=0>Four</span>
          <span id="item5" tabindex=0>Five</span>
        </div>
      `;

      item1 = getById('item1');
      item2 = getById('item2');
      item3 = getById('item3');
      item4 = getById('item4');
      item5 = getById('item5');
    });

    test('ArrowLeft (forward in RTL) from item1 moves to item2', async () => {
      item1.focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect(item2).toHaveFocus();
    });

    test('ArrowLeft (forward in RTL) from item2 crosses to LTR item3', async () => {
      item2.focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect(item3).toHaveFocus();
    });

    test('ArrowRight (backward in RTL) from item2 moves to item1', async () => {
      item2.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(item1).toHaveFocus();
    });

    test('ArrowRight from LTR item3 moves to item4', async () => {
      item3.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(item4).toHaveFocus();
    });

    test('ArrowRight from LTR item4 moves to item5', async () => {
      item4.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(item5).toHaveFocus();
    });

    test('ArrowLeft from LTR item5 moves to item4', async () => {
      item5.focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect(item4).toHaveFocus();
    });

    test('ArrowLeft from LTR item3 crosses back to RTL item2', async () => {
      item3.focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect(item2).toHaveFocus();
    });
  });

  describe('RTL container with LTR wrapper', () => {
    let item1: HTMLElement;
    let item2: HTMLElement;
    let item3: HTMLElement;

    beforeEach(() => {
      document.body.innerHTML = `
        <div focusgroup="toolbar" dir="rtl">
          <span id="item1" tabindex=0>One</span>
          <div dir="ltr">
            <span id="item2" tabindex=0>Two</span>
            <span id="item3" tabindex=0>Three</span>
          </div>
        </div>
      `;

      item1 = getById('item1');
      item2 = getById('item2');
      item3 = getById('item3');
    });

    test('ArrowLeft (forward in RTL) from r1 moves to LTR r2', async () => {
      item1.focus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(item2).toHaveFocus();
    });

    test('ArrowRight (forward in LTR) from r2 moves to r3', async () => {
      item2.focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(item3).toHaveFocus();
    });

    test('ArrowLeft (backward in LTR) from r2 moves to r1', async () => {
      item2.focus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(item1).toHaveFocus();
    });

    test('ArrowLeft (backward in LTR) from r3 moves to r2', async () => {
      item3.focus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(item2).toHaveFocus();
    });
  });
});

describe('in RTL, ArrowLeft moves focus forward inline', () => {
  let item1: HTMLElement;
  let item2: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
        <div dir="rtl" focusgroup="toolbar">
          <span id="item1" tabindex=0>item1</span>
          <span id="item2" tabindex=0>item2</span>
          <span id="item3" tabindex=0>item3</span>
        </div>
      `;

    item1 = getById('item1');
    item2 = getById('item2');
  });

  test('ArrowLeft moves focus to the next item in an RTL focusgroup', async () => {
    item1.focus();
    await userEvent.keyboard('{ArrowLeft}');

    expect(item2).toHaveFocus();
  });

  test('ArrowRight moves focus to the previous item in an RTL focusgroup', async () => {
    item2.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(item1).toHaveFocus();
  });

  test('ArrowDown does not move focus forward in an RTL focusgroup', async () => {
    item1.focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(item1).toHaveFocus();
  });

  test('ArrowUp does not move focus backward in an RTL focusgroup', async () => {
    item2.focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(item2).toHaveFocus();
  });
});

describe('RTL wrapping respects reversed inline direction', () => {
  let item1: HTMLElement;
  let item3: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
        <div dir="rtl" focusgroup="toolbar wrap">
          <span id="item1" tabindex=0>One</span>
          <span id="item2" tabindex=0>Two</span>
          <span id="item3" tabindex=0>Three</span>
        </div>
      `;

    item1 = getById('item1');
    item3 = getById('item3');
  });

  test('ArrowLeft at last item wraps to first item in RTL focusgroup', async () => {
    item3.focus();
    await userEvent.keyboard('{ArrowLeft}');

    expect(item1).toHaveFocus();
  });

  test('ArrowRight at first item wraps to last item in RTL focusgroup', async () => {
    item1.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(item3).toHaveFocus();
  });
});

describe('Vertical writing-mode swaps inline and block axes', () => {
  describe('inline axis only', () => {
    beforeEach(() => {
      document.body.innerHTML = `<div focusgroup="toolbar inline" style="writing-mode: vertical-rl;">
          <span id="item1" tabindex="0">item1</span>
          <span id="item2" tabindex="0">item2</span>
        </div>`;
    });

    test('ArrowDown moves forward inline in vertical-rl inline-only focusgroup', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');

      expect(getById('item2')).toHaveFocus();
    });

    test('ArrowUp moves backward inline in vertical-rl inline-only focusgroup', async () => {
      getById('item2').focus();
      await userEvent.keyboard('{ArrowUp}');

      expect(getById('item1')).toHaveFocus();
    });

    test('ArrowLeft/ArrowRight do not move focus in vertical-rl inline-only focusgroup', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect(getById('item1')).toHaveFocus();

      await userEvent.keyboard('{ArrowRight}');

      expect(getById('item1')).toHaveFocus();
    });
  });

  describe('both axes', () => {
    beforeEach(() => {
      document.body.innerHTML = `<div focusgroup="toolbar inline block" style="writing-mode: vertical-rl;">
          <span id="item1" tabindex="0">item1</span>
          <span id="item2" tabindex="0">item2</span>
          <span id="item3" tabindex="0">item3</span>
        </div>`;
    });

    test('ArrowDown moves forward in both-axes vertical-rl focusgroup', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowDown}');

      expect(getById('item2')).toHaveFocus();
    });

    test('ArrowLeft moves forward (block) in both-axes vertical-rl focusgroup', async () => {
      getById('item1').focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect(getById('item2')).toHaveFocus();
    });
  });
});

test('skip hidden candidates', async () => {
  document.body.innerHTML = `
    <div focusgroup="tablist">
      <button tabindex="0" id="item1">item1</button>
      <div hidden>
        <button tabindex="0">item2</button>
      </div>
      <button tabindex="0" id="item3">item3</button>
    </div>
  `;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowRight}');

  expect(getById('item3')).toHaveFocus();
});

test('horizontal: does not move when axis (ArrowRight) is not supported (block only)', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item1')).toHaveFocus();
});

test('horizontal: moves when only the horizontal axis (ArrowRight) is supported (inline only)', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar inline">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item2')).toHaveFocus();
});

describe('horizontal: RTL with inline-only axis respects reversed arrow keys', () => {
  let item1: HTMLElement;
  let item2: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <div dir="rtl" focusgroup="toolbar inline">
        <span id=item1 tabindex=0>item1</span>
        <span id=item2 tabindex=0>item2</span>
      </div>
    `;

    item1 = getById('item1');
    item2 = getById('item2');
  });

  test('ArrowLeft moves forward in RTL inline-only focusgroup', async () => {
    item1.focus();
    await userEvent.keyboard('{ArrowLeft}');

    expect(item2).toHaveFocus();
  });

  test('ArrowRight moves backward in RTL inline-only focusgroup', async () => {
    item2.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(item1).toHaveFocus();
  });

  test('ArrowDown and ArrowUp do not move focus in RTL inline-only focusgroup', async () => {
    item1.focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(item1).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');

    expect(item1).toHaveFocus();
  });
});

test('vertical: does not move when axis (ArrowDown) is not supported (inline only)', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar inline">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getById('item1')).toHaveFocus();
});

test('vertical: moves when only the vertical axis (ArrowDown) is supported (block only)', async () => {
  document.body.innerHTML = `<div id="root" focusgroup="toolbar block">
      <span id="item1" tabindex="0">item1</span>
      <span id="item2" tabindex="0">item2</span>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(getById('item2')).toHaveFocus();
});

describe('none creates navigation barriers', () => {
  test('forward navigation skips opted-out subtree', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar">
        <button tabindex="0" id="item1" >Item 1</button>
        <button tabindex="0" id="item2" >Item 2</button>
        <div id="optout" focusgroup="none">
          <button tabindex="0" id="optout_item1" >Opted out item 1</button>
          <div>
            <button tabindex="0" id="optout_item2" >Opted out item 2</button>
          </div>
        </div>
        <button tabindex="0" id="item3" >Item 3</button>
        <button tabindex="0" id="item4" >Item 4</button>
      </div>`;

    getById('item1').focus();
    await userEvent.keyboard('{ArrowRight}');

    getById('item2').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item3')).toHaveFocus();
  });

  test('backward navigation skips opted-out subtree', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar">
        <button tabindex="0" id="item1" >Item 1</button>
        <button tabindex="0" id="item2" >Item 2</button>
        <div id="optout" focusgroup="none">
          <button tabindex="0" id="optout_item1" >Opted out item 1</button>
          <div>
            <button tabindex="0" id="optout_item2" >Opted out item 2</button>
          </div>
        </div>
        <button tabindex="0" id="item3" >Item 3</button>
        <button tabindex="0" id="item4" >Item 4</button>
      </div>`;

    getById('item4').focus();
    await userEvent.keyboard('{ArrowLeft}');

    getById('item3').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('item2')).toHaveFocus();
  });

  test('arrow keys do not work within opted-out sections', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar">
        <button tabindex="0" id="item1" >Item 1</button>
        <div id="optout" focusgroup="none">
          <button tabindex="0" id="optout_item1" >Opted out item 1</button>
          <div>
            <button tabindex="0" id="optout_item2" >Opted out item 2</button>
          </div>
        </div>
        <button tabindex="0" id="item2" >Item 2</button>
      </div>`;

    getById('optout_item1').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('optout_item1')).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(getById('optout_item1')).toHaveFocus();
  });
});

describe('none opt-out direct child', () => {
  test('forward arrow navigation skips opted-out direct child', async () => {
    document.body.innerHTML = `<div id="toolbar" focusgroup="toolbar">
        <button tabindex="0" id="first">First</button>
        <button tabindex="0" id="optedout" focusgroup="none">opted out</button>
        <button tabindex="0" id="last">Last</button>
      </div>`;

    getById('first').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('last')).toHaveFocus();
  });

  test('backward arrow navigation skips opted-out direct child', async () => {
    document.body.innerHTML = `<div id="toolbar" focusgroup="toolbar">
        <button tabindex="0" id="first">First</button>
        <button tabindex="0" id="optedout" focusgroup="none">opted out</button>
        <button tabindex="0" id="last">Last</button>
      </div>`;

    getById('last').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('first')).toHaveFocus();
  });

  test('arrow keys do not work from opted-out element', async () => {
    document.body.innerHTML = `<div id="toolbar" focusgroup="toolbar">
        <button tabindex="0" id="first">First</button>
        <button tabindex="0" id="optedout" focusgroup="none">opted out</button>
        <button tabindex="0" id="last">Last</button>
      </div>`;

    getById('optedout').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('optedout')).toHaveFocus();

    getById('optedout').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('optedout')).toHaveFocus();
  });
});

describe('complex nested opt-out scenarios', () => {
  test('outer focusgroup navigation skips opted-out subtree', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar">
        <button tabindex="0" id="item1" >Item 1</button>
        <div>
          <button tabindex="0" id="item2" >Item 2</button>
          <div id="optout1" focusgroup="none">
            <button tabindex="0" id="optout_item1" >Opted out 1</button>
            <div>
              <button tabindex="0" id="optout_item2" >Opted out 2 (nested)</button>
              <div id="nested_in_optout" focusgroup="menu">
                <button tabindex="0" id="nested_optout_item1" >Nested in opt-out 1</button>
                <button tabindex="0" id="nested_optout_item2" >Nested in opt-out 2</button>
              </div>
            </div>
          </div>
          <button tabindex="0" id="item3" >Item 3</button>
        </div>
        <div>
          <div>
            <button tabindex="0" id="item4" >Item 4 (deeply nested)</button>
          </div>
        </div>
      </div>`;

    getById('item1').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item2')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item3')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item4')).toHaveFocus();
  });

  test('opt-out subtree blocks navigation for its own items', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar">
        <button tabindex="0" id="item1" >Item 1</button>
        <div id="optout1" focusgroup="none">
          <button tabindex="0" id="optout_item1" >Opted out 1</button>
          <div>
            <button tabindex="0" id="optout_item2" >Opted out 2 (nested)</button>
          </div>
        </div>
        <button tabindex="0" id="item2" >Item 2</button>
      </div>`;

    getById('optout_item1').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('optout_item1')).toHaveFocus();

    getById('optout_item2').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('optout_item2')).toHaveFocus();
  });

  test('nested focusgroup inside opted-out subtree still works internally', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar">
        <button tabindex="0" id="item1" >Item 1</button>
        <div id="optout1" focusgroup="none">
          <button tabindex="0" id="optout_item1" >Opted out 1</button>
          <div id="nested_in_optout" focusgroup="toolbar">
            <button tabindex="0" id="nested_optout_item1" >Nested in opt-out 1</button>
            <button tabindex="0" id="nested_optout_item2" >Nested in opt-out 2</button>
          </div>
        </div>
        <button tabindex="0" id="item2" >Item 2</button>
      </div>`;

    getById('nested_optout_item1').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('nested_optout_item2')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('nested_optout_item1')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('nested_optout_item1')).toHaveFocus();
  });

  test('backward outer navigation skips opted-out subtree', async () => {
    document.body.innerHTML = `<div id="root" focusgroup="toolbar">
        <button tabindex="0" id="item1" >Item 1</button>
        <div>
          <button tabindex="0" id="item2" >Item 2</button>
          <div id="optout1" focusgroup="none">
            <button tabindex="0" id="optout_item1" >Opted out 1</button>
          </div>
          <button tabindex="0" id="item3" >Item 3</button>
        </div>
        <div>
          <div>
            <button tabindex="0" id="item4" >Item 4 (deeply nested)</button>
          </div>
        </div>
      </div>`;

    getById('item4').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('item3')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('item2')).toHaveFocus();
  });
});

describe('basic tab behavior', () => {
  test('Tab enters focusgroup at first item in tree order and exits normally', async () => {
    document.body.innerHTML = `<div id="before" tabindex="0">Before focusgroup</div>
        <div id="focusgroup1" focusgroup="toolbar nomemory">
          <span id="item1" tabindex="0">Item 1</span>
          <span id="item2" tabindex="0">Item 2</span>
          <span id="item3" tabindex="0">Item 3</span>
        </div>
        <div id="after" tabindex="0">After focusgroup</div>`;

    getById('before').focus();
    await useTab();
    expect(getById('item1')).toHaveFocus();

    await useTab();
    expect(getById('after')).toHaveFocus();
  });

  test('Shift+Tab enters focusgroup at first item in tree order and exits normally', async () => {
    document.body.innerHTML = `<div id="before" tabindex="0">Before focusgroup</div>
        <div id="focusgroup1" focusgroup="toolbar nomemory">
          <span id="item1" tabindex="0">Item 1</span>
          <span id="item2" tabindex="0">Item 2</span>
          <span id="item3" tabindex="0">Item 3</span>
        </div>
        <div id="after" tabindex="0">After focusgroup</div>`;

    getById('after').focus();
    await useTab({ shift: true });
    expect(getById('item1')).toHaveFocus();

    await useTab({ shift: true });
    expect(getById('before')).toHaveFocus();
  });

  test('arrow key navigation continues to work normally within focusgroup', async () => {
    document.body.innerHTML = `<div id="focusgroup1" focusgroup="toolbar nomemory">
        <span id="item1" tabindex="0">Item 1</span>
        <span id="item2" tabindex="0">Item 2</span>
        <span id="item3" tabindex="0">Item 3</span>
      </div>`;

    getById('item1').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item2')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item3')).toHaveFocus();
  });
});

describe('nested focusgroups sequential navigation', () => {
  test('forward Tab navigation through nested focusgroups', async () => {
    document.body.innerHTML = `<div id="before1" tabindex="0">Before outer</div>
      <div id="outer" focusgroup="toolbar">
        <span id="outer1" tabindex="0" focusgroupstart>Outer 1 (priority)</span>
        <div id="inner" focusgroup="toolbar nomemory">
          <span id="inner1" tabindex="0" focusgroupstart>Inner 1 (priority)</span>
          <span id="inner2" tabindex="0">Inner 2</span>
        </div>
        <span id="outer2" tabindex="0">Outer 2</span>
      </div>
      <div id="after1" tabindex="0">After outer</div>`;

    getById('before1').focus();
    await useTab();
    expect(getById('outer1')).toHaveFocus();

    await useTab();
    expect(getById('inner1')).toHaveFocus();

    await useTab();
    expect(getById('outer2')).toHaveFocus();

    await useTab();
    expect(getById('after1')).toHaveFocus();
  });

  test('reverse Shift+Tab navigation through nested focusgroups', async () => {
    document.body.innerHTML = `<div id="before1" tabindex="0">Before outer</div>
      <div id="outer" focusgroup="toolbar">
        <span id="outer1" tabindex="0" focusgroupstart>Outer 1 (priority)</span>
        <div id="inner" focusgroup="toolbar nomemory">
          <span id="inner1" tabindex="0" focusgroupstart>Inner 1 (priority)</span>
          <span id="inner2" tabindex="0">Inner 2</span>
        </div>
        <span id="outer2" tabindex="0">Outer 2</span>
      </div>
      <div id="after1" tabindex="0">After outer</div>`;

    getById('after1').focus();
    await useTab({ shift: true });
    expect(getById('outer2')).toHaveFocus();

    await useTab({ shift: true });
    expect(getById('inner1')).toHaveFocus();

    await useTab({ shift: true });
    expect(getById('outer1')).toHaveFocus();

    await useTab({ shift: true });
    expect(getById('before1')).toHaveFocus();
  });
});

describe('native arrow key handler elements block arrow exit', () => {
  test('arrow navigation TO text input works', async () => {
    document.body.innerHTML = `<div id="toolbar-text" focusgroup="toolbar">
        <button tabindex="0" id="btn-text-before">Before</button>
        <input id="text-input" type="text" value="test" />
        <button tabindex="0" id="btn-text-after">After</button>
      </div>`;

    getById('btn-text-before').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('text-input')).toHaveFocus();
  });

  test('arrow navigation FROM text input is blocked', async () => {
    document.body.innerHTML = `<div id="toolbar-text" focusgroup="toolbar">
        <button tabindex="0" id="btn-text-before">Before</button>
        <input id="text-input" type="text" value="test" />
        <button tabindex="0" id="btn-text-after">After</button>
      </div>`;

    getById('text-input').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('text-input')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('text-input')).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(getById('text-input')).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    expect(getById('text-input')).toHaveFocus();
  });

  test('arrow navigation TO textarea works', async () => {
    document.body.innerHTML = `<div id="toolbar-textarea" focusgroup="toolbar">
        <button tabindex="0" id="btn-textarea-before">Before</button>
        <textarea id="textarea">Content</textarea>
        <button tabindex="0" id="btn-textarea-after">After</button>
      </div>`;

    getById('btn-textarea-before').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('textarea')).toHaveFocus();
  });

  test('arrow navigation FROM textarea is blocked', async () => {
    document.body.innerHTML = `<div id="toolbar-textarea" focusgroup="toolbar">
        <button tabindex="0" id="btn-textarea-before">Before</button>
        <textarea id="textarea">Content</textarea>
        <button tabindex="0" id="btn-textarea-after">After</button>
      </div>`;

    getById('textarea').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('textarea')).toHaveFocus();
  });

  test('arrow navigation TO select works', async () => {
    document.body.innerHTML = `<div id="toolbar-select" focusgroup="toolbar">
        <button tabindex="0" id="btn-select-before">Before</button>
        <select id="select-input">
          <option>A</option>
          <option>B</option>
        </select>
        <button tabindex="0" id="btn-select-after">After</button>
      </div>`;

    // Make the test less flaky in Safari
    // await getById("select-input").waitFor();

    getById('btn-select-before').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('select-input')).toHaveFocus();
  });

  test('arrow navigation TO contenteditable works', async () => {
    document.body.innerHTML = `<div id="toolbar-editable" focusgroup="toolbar">
        <button tabindex="0" id="btn-editable-before">Before</button>
        <div id="editable" contenteditable="true" tabindex="0">Editable</div>
        <button tabindex="0" id="btn-editable-after">After</button>
      </div>`;

    getById('btn-editable-before').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('editable')).toHaveFocus();
  });

  test('arrow navigation FROM contenteditable is blocked', async () => {
    document.body.innerHTML = `<div id="toolbar-editable" focusgroup="toolbar">
        <button tabindex="0" id="btn-editable-before">Before</button>
        <div id="editable" contenteditable="true" tabindex="0">Editable</div>
        <button tabindex="0" id="btn-editable-after">After</button>
      </div>`;

    getById('editable').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('editable')).toHaveFocus();
  });
});

test('arrow key from only item in focusgroup does not navigate', async () => {
  document.body.innerHTML = `<div id="toolbar" focusgroup="toolbar">
      <button tabindex="0" id="only-item">Only Item</button>
    </div>`;

  getById('only-item').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('only-item')).toHaveFocus();

  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('only-item')).toHaveFocus();
});

test('arrow keys do not work within explicitly opted-out sections', async () => {
  document.body.innerHTML = `<div id="toolbar" focusgroup="toolbar">
      <button tabindex="0" id="item1">Item 1</button>
      <div id="optout" focusgroup="none">
        <button tabindex="0" id="optout-item">Opted out item</button>
      </div>
      <button tabindex="0" id="item2">Item 2</button>
    </div>`;

  getById('optout-item').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('optout-item')).toHaveFocus();

  await userEvent.keyboard('{ArrowLeft}');
  expect(getById('optout-item')).toHaveFocus();
});

describe('focusgroup segments', () => {
  test("arrow key navigation treats opted-out elements as if they don't exist", async () => {
    document.body.innerHTML = `<div id="toolbar" focusgroup="toolbar wrap" aria-label="Text formatting">
        <button tabindex="0" id="bold" type="button">Bold</button>
        <button tabindex="0" id="italic" type="button">Italic</button>
        <span id="help-group" focusgroup="none" aria-label="Help group">
          <button tabindex="0" id="help" type="button">Help</button>
          <button tabindex="0" id="shortcuts" type="button">Shortcuts</button>
        </span>
        <button tabindex="0" id="underline" type="button">Underline</button>
      </div>`;

    getById('bold').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('italic')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('underline')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('italic')).toHaveFocus();
  });

  test('Tab navigation through focusgroup segments - forward direction', async () => {
    document.body.innerHTML = `<div id="before" tabindex="0">Before toolbar</div>
        <div id="toolbar" focusgroup="toolbar wrap" aria-label="Text formatting">
          <button tabindex="0" id="bold" type="button" focusgroupstart>Bold (priority)</button>
          <button tabindex="0" id="italic" type="button">Italic</button>
          <span id="help-group" focusgroup="none" aria-label="Help group">
            <button tabindex="0" id="help" type="button">Help</button>
            <button tabindex="0" id="shortcuts" type="button">Shortcuts</button>
          </span>
          <button tabindex="0" id="underline" type="button" focusgroupstart>Underline (priority)</button>
        </div>
        <div id="after" tabindex="0">After toolbar</div>`;

    getById('before').focus();
    await useTab();
    expect(getById('bold')).toHaveFocus();

    await useTab();
    expect(getById('help')).toHaveFocus();

    await useTab();
    expect(getById('shortcuts')).toHaveFocus();

    await useTab();
    expect(getById('underline')).toHaveFocus();

    // await useTab();
    // expect(getById('after')).toHaveFocus();
  });

  test('arrow keys do not work within opted-out focusgroup sections', async () => {
    document.body.innerHTML = `<div id="toolbar" focusgroup="toolbar wrap" aria-label="Text formatting">
        <button tabindex="0" id="bold">Bold</button>
        <span id="help-group" focusgroup="none">
          <button tabindex="0" id="help">Help</button>
          <button tabindex="0" id="shortcuts">Shortcuts</button>
        </span>
        <button tabindex="0" id="underline">Underline</button>
      </div>`;

    getById('help').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('help')).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(getById('help')).toHaveFocus();
  });

  test('nested group should not segment if it’s invisible', async () => {
    document.body.innerHTML = `
      <div focusgroup="toolbar">
        <div tabindex="0" id="item1">item 1</div>
        <div tabindex="0" id="item2">
          item 2
          <div focusgroup="toolbar" hidden>
            <div tabindex="0" id="item2-1">item 2.1</div>
            <div tabindex="0" id="item2-2">item 2.2</div>
          </div>
        </div>
        <div tabindex="0" id="item3">item 3</div>
      </div>
      <button tabindex="0" id="after">after</button>
      `;

    getById('item1').focus();
    await useTab();
    expect(getById('after')).toHaveFocus();
  });
});

test('hidden items should not be segment tab stop', async () => {
  document.body.innerHTML = `
    <div focusgroup="toolbar">
      <button tabindex="0" id="item1">item 1</button>
      <div focusgroup="toolbar">
        <button tabindex="0">nested item 1</button>
      </div>
      <div hidden>
        <button tabindex="0">item 2</button>
      </div>
      <button tabindex="0" id="item3">item 3</button>
    </div>
  `;

  getById('item1').focus();
  await useTab();
  await useTab();

  expect(getById('item3')).toHaveFocus();
});

describe('memory behavior', () => {
  test('focusgroup with memory remembers last focused item on re-entry', async () => {
    document.body.innerHTML = `<div id="before-memory" tabindex="0">Before memory focusgroup</div>
        <div id="memory-focusgroup" focusgroup="toolbar">
          <button tabindex="0" id="memory-item1">Item 1</button>
          <button tabindex="0" id="memory-item2" focusgroupstart>Item 2 (priority)</button>
          <button tabindex="0" id="memory-item3">Item 3</button>
        </div>
        <div id="between" tabindex="0">Between focusgroups</div>`;

    getById('before-memory').focus();
    await useTab();
    expect(getById('memory-item2')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('memory-item3')).toHaveFocus();

    await useTab();
    expect(getById('between')).toHaveFocus();

    await useTab({ shift: true });
    expect(getById('memory-item3')).toHaveFocus();
  });

  test('focusgroup with nomemory does not remember last focused item', async () => {
    document.body.innerHTML = `<div id="between" tabindex="0">Between focusgroups</div>
        <div id="no-memory-focusgroup" focusgroup="toolbar nomemory">
          <button tabindex="0" id="no-memory-item1">Item 1</button>
          <button tabindex="0" id="no-memory-item2" focusgroupstart>Item 2 (priority)</button>
          <button tabindex="0" id="no-memory-item3">Item 3</button>
        </div>
        <div id="after-no-memory" tabindex="0">After nomemory focusgroup</div>`;

    getById('between').focus();
    await useTab();
    expect(getById('no-memory-item2')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('no-memory-item3')).toHaveFocus();

    await useTab();
    expect(getById('after-no-memory')).toHaveFocus();

    await useTab({ shift: true });
    expect(getById('no-memory-item2')).toHaveFocus();
  });

  test('arrow key navigation updates the current focused item', async () => {
    document.body.innerHTML = `<div id="memory-focusgroup" focusgroup="toolbar">
        <button tabindex="0" id="memory-item1">Item 1</button>
        <button tabindex="0" id="memory-item2" focusgroupstart>Item 2 (priority)</button>
        <button tabindex="0" id="memory-item3">Item 3</button>
      </div>`;

    getById('memory-item2').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('memory-item1')).toHaveFocus();
  });

  test('parent focusgroup memory is preserved when focus traverses through a nested focusgroup', async () => {
    document.body.innerHTML = `<div id="before" tabindex="0">before</div>
        <div id="parent" focusgroup="toolbar">
          <button tabindex="0" id="parent-item1">parent 1</button>
          <button tabindex="0" id="parent-item2">parent 2</button>
          <div id="inner" focusgroup="toolbar">
            <button tabindex="0" id="inner-item1">inner 1</button>
            <button tabindex="0" id="inner-item2">inner 2</button>
          </div>
          <button tabindex="0" id="parent-item3">parent 3</button>
        </div>
        <div id="after" tabindex="0">after</div>`;

    getById('before').focus();
    await useTab();
    expect(getById('parent-item1')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('parent-item2')).toHaveFocus();

    await useTab();
    expect(getById('inner-item1')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('inner-item2')).toHaveFocus();

    await useTab({ shift: true });
    expect(getById('parent-item2')).toHaveFocus();
  });
});

describe('guaranteed tab stop priority', () => {
  test('focusgroupstart element is the guaranteed tab stop entry point', async () => {
    document.body.innerHTML = `<div id="before" tabindex="0">Before</div>
        <div id="focusgroup" focusgroup="toolbar nomemory">
          <button tabindex="0" id="item1">Item 1</button>
          <button tabindex="0" id="item2" focusgroupstart>Item 2 (priority)</button>
          <button tabindex="0" id="item3">Item 3</button>
        </div>
        <div id="after" tabindex="0">After</div>`;

    getById('before').focus();
    await useTab();
    expect(getById('item2')).toHaveFocus();
  });

  test('focusgroupstart element in nested shadow tree is the guaranteed tab stop entry point', async () => {
    setupPageWithShadowRoots(
      `<div id="before" tabindex="0">Before</div>
        <div id="focusgroup" focusgroup="toolbar">
          <button tabindex="0" id="item1">Item 1</button>
          <my-element>
            <template shadowrootmode="open">
              <slot></slot>
              <div>
                <slot name="item"></slot>
              </div>
            </template>
            <div tabindex="0">Item 2</div>
            <button tabindex="0" id="item22" slot="item" focusgroupstart>Item 2.2</button>
          </my-element>
          <button tabindex="0" id="item3">Item 3</button>
        </div>
        <div id="after" tabindex="0">After</div>`,
    );

    getById('before').focus();
    await useTab();
    expect(getById('item22')).toHaveFocus();
    await useTab();
    expect(getById('after')).toHaveFocus();
    await useTab({ shift: true });
    expect(getById('item22')).toHaveFocus();
    await useTab({ shift: true });
    expect(getById('before')).toHaveFocus();
  });

  test('focusgroupstart element in nested shadow tree is the guaranteed tab stop entry point with nomemory', async () => {
    setupPageWithShadowRoots(`<div id="before" tabindex="0">Before</div>
        <div id="focusgroup" focusgroup="toolbar nomemory">
          <button tabindex="0" id="item1">Item 1</button>
          <my-element>
            <template shadowrootmode="open">
              <slot></slot>
              <div>
                <slot name="item"></slot>
              </div>
            </template>
            <div tabindex="0">Item 2</div>
            <button tabindex="0" id="item22" slot="item" focusgroupstart>Item 2.2</button>
          </my-element>
          <button tabindex="0" id="item3">Item 3</button>
        </div>
        <div id="after" tabindex="0">After</div>`);

    getById('before').focus();
    await useTab();
    expect(getById('item22')).toHaveFocus();
    await useTab();
    expect(getById('after')).toHaveFocus();
    await useTab({ shift: true });
    expect(getById('item22')).toHaveFocus();
    await useTab({ shift: true });
    expect(getById('before')).toHaveFocus();
  });

  test('a single item in a group should not lose focusability', async () => {
    document.body.innerHTML = `
      <button tabindex="0" id="before">before</button>
      <div focusgroup="tablist">
        <button tabindex="0" id="item">Item</button>
      </div>
      <button tabindex="0" id="after">after</button>
    `;

    const before = getById('before');
    const after = getById('after');
    const item = getById('item');

    before.focus();
    await useTab();

    expect(item).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');

    expect(item).toHaveFocus();

    await useTab();

    expect(after).toHaveFocus();

    await useTab({ shift: true });

    expect(item).toHaveFocus();
  });

  test('an item nested in another item’s shadow root can be a tab stop', async () => {
    setupPageWithShadowRoots(
      `<button tabindex="0" id="before">before</button>
      <div focusgroup="tablist">
        <my-element id="my-element">
          <template shadowrootmode="open">
            <div tabindex="0" id="item">item</div>
          </template>
        </my-element>
      </div>
      <button tabindex="0">after</button>`,
    );

    const root = getById('my-element').shadowRoot;
    const item = root?.getElementById('item');
    item?.focus();

    await useTab();
    await useTab({ shift: true });
    expect(root?.activeElement).toBe(item);

    await useTab({ shift: true });
    expect(getById('before')).toHaveFocus();
  });

  test('an item deeper nested in another item’s shadow root can be a tab stop', async () => {
    setupPageWithShadowRoots(
      `<button tabindex="0" id="before">before</button>
      <div focusgroup="tablist">
        <my-element id="my-element">
          <template shadowrootmode="open">
            <my-nested id="my-nested">
              <template shadowrootmode="open">
                <div tabindex="0" id="item">item</div>
              </template>
            </my-nested>
          </template>
        </my-element>
      </div>
      <button tabindex="0">after</button>
    `,
    );

    const root = getById('my-element').shadowRoot;
    const nestedRoot = root?.querySelector('my-nested')?.shadowRoot;
    const item = nestedRoot?.getElementById('item');
    item?.focus();
    await useTab();
    await useTab({ shift: true });
    expect(nestedRoot?.activeElement).toBe(item);

    await useTab({ shift: true });
    expect(getById('before')).toHaveFocus();
  });

  test('an item slotted in another item’s shadow root can be a tab stop', async () => {
    setupPageWithShadowRoots(
      `<button tabindex="0" id="before">before</button>
      <div focusgroup="tablist">
        <my-element id="my-element">
          <template shadowrootmode="open">
            <slot></slot>
          </template>
          <div tabindex="0" id="item">item</div>
        </my-element>
      </div>
      <button tabindex="0">after</button>
    `,
    );

    const item = getById('item');
    item.focus();
    await useTab();
    await useTab({ shift: true });
    expect(item).toHaveFocus();

    await useTab({ shift: true });
    expect(getById('before')).toHaveFocus();
  });
});

test('empty focusgroup - navigation stays put if no focusable items nearby', async () => {
  document.body.innerHTML = `<div id="toolbar-with-items" focusgroup="toolbar">
      <button tabindex="0" id="item1">Item 1</button>
      <button tabindex="0" id="item2">Item 2</button>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item2')).toHaveFocus();
});

test('dynamic focusgroupstart changes affect entry element selection', async () => {
  document.body.innerHTML = `
    <div id="before" tabindex="0">Before</div>

    <div focusgroup="toolbar nomemory">
      <span id="item1" tabindex="0">Item 1</span>
      <span id="item2" tabindex="0">Item 2</span>
    </div>

    <div id="after" tabindex="0">After</div>
  `;

  const before = getById('before');
  before.focus();
  await useTab();

  expect(getById('item1')).toHaveFocus();

  before.focus();
  const item2 = getById('item2');
  item2.setAttribute('focusgroupstart', '');

  await useTab();

  expect(item2).toHaveFocus();
});

test('enabling disabled elements makes them available for tab stop', async () => {
  document.body.innerHTML = `
    <div id="before" tabindex="0">Before</div>

    <div focusgroup="toolbar nomemory">
      <button tabindex="0" id="btn1" disabled>Button 1</button>
      <button tabindex="0" id="btn2">Button 2</button>
    </div>

    <div id="after" tabindex="0">After</div>
  `;

  const before = getById('before');
  const btn1 = getById('btn1');
  const btn2 = getById('btn2');

  before.focus();
  await useTab();

  expect(btn2).toHaveFocus();

  before.focus();
  btn1.removeAttribute('disabled');

  await useTab();

  expect(btn1).toHaveFocus();
});

test('Tab from a native arrow key handler moves focus to the next segment with the same focusgroup, if any', async () => {
  document.body.innerHTML = `<div id="before" tabindex="0">Before</div>
      <div id="toolbar" focusgroup="toolbar">
        <button tabindex="0" id="btn-before">Before input</button>
        <input id="text-input" type="text" value="test">
        <button tabindex="0" id="btn-after">After input</button>
      </div>
      <div id="after" tabindex="0">After</div>`;

  getById('text-input').focus();
  await useTab();
  expect(getById('btn-after')).toHaveFocus();
});

test('multiple arrow key handler elements can exist in a segment', async () => {
  document.body.innerHTML = `<div id="toolbar" focusgroup="toolbar">
      <button tabindex="0" id="item1">Item 1</button>
      <input id="input1" type="text" value="a" />
      <input id="input2" type="text" value="b" />
      <button tabindex="0" id="item2">Item 2</button>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('input1')).toHaveFocus();

  // Arrow navigation from input is blocked
  getById('input1').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('input1')).toHaveFocus();
});

test('arrow key handler in nested focusgroup blocks its own navigation', async () => {
  document.body.innerHTML = `<div id="outer" focusgroup="toolbar">
      <button tabindex="0" id="outer-item1">Outer 1</button>
      <div id="inner" focusgroup="toolbar">
        <button tabindex="0" id="inner-item1">Inner 1</button>
        <input id="inner-input" type="text" value="test" />
        <button tabindex="0" id="inner-item2">Inner 2</button>
      </div>
      <button tabindex="0" id="outer-item2">Outer 2</button>
    </div>`;

  getById('inner-item1').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('inner-input')).toHaveFocus();
});

test('navigation works correctly in scrollable container', async () => {
  document.body.innerHTML = `<div id="toolbar" focusgroup="toolbar" style="overflow: scroll; height: 100px;">
      <button tabindex="0" id="item1">Item 1</button>
      <button tabindex="0" id="item2">Item 2</button>
      <button tabindex="0" id="item3">Item 3</button>
    </div>`;

  getById('item1').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(getById('item2')).toHaveFocus();
});

test('respects preventDefault()', async () => {
  document.body.innerHTML = `
    <div focusgroup="toolbar">
      <button tabindex="0" id="item1">item 1</button>
      <input id="item2">
      <button tabindex="0" id="item3">item 3</button>
    </div>
  `;

  const item1 = getById('item1');
  const input = getById('item2');

  item1.focus();
  await userEvent.keyboard('{ArrowRight}');

  expect(input).toHaveFocus();

  await useTab();

  expect(getById('item3')).toHaveFocus();

  input.addEventListener('keydown', (evt) => {
    evt.preventDefault();
  });

  item1.focus();
  await userEvent.keyboard('{ArrowRight}');

  expect(input).toHaveFocus();

  await useTab();

  expect(input).toHaveFocus();

  await useTab({ shift: true });

  expect(input).toHaveFocus();
});

test('clicking on an item makes the item the tab stop for the group', async () => {
  document.body.innerHTML = `
    <button tabindex="0" id="before">before</button>
    <div focusgroup="toolbar">
      <div tabindex="0">item 1</div>
      <div tabindex="0" id="item2">item 2</div>
    </div>
    `;

  const item2 = getById('item2');
  await userEvent.click(item2);
  await useTab({ shift: true });

  expect(getById('before')).toHaveFocus();
});

test('programmatically focusing on an item makes the item the tab stop for the group', async () => {
  document.body.innerHTML = `
    <button tabindex="0" id="before">before</button>
    <div focusgroup="toolbar">
      <div tabindex="0">item 1</div>
      <div tabindex="0" id="item2">item 2</div>
    </div>
    `;

  const item2 = getById('item2');
  item2.focus();
  await useTab({ shift: true });

  expect(getById('before')).toHaveFocus();
});

describe('focusgroup with shadow items', () => {
  let root: ShadowRoot;
  let item1: HTMLElement;
  let item2: HTMLElement;
  let item3: HTMLElement;

  beforeEach(() => {
    setupPageWithShadowRoots(
      `
      <div focusgroup="toolbar inline">
        <my-element id="my-element">
          <template shadowrootmode="open">
            <button tabindex="0" id="item1">One</button>
            <button tabindex="0" id="item2">Two</button>
            <button tabindex="0" id="item3">Three</button>
          </template>
        </my-element>
      </div>
    `,
    );

    root = getById('my-element')?.shadowRoot as ShadowRoot;
    item1 = root?.getElementById('item1') as HTMLElement;
    item2 = root?.getElementById('item2') as HTMLElement;
    item3 = root?.getElementById('item3') as HTMLElement;
  });

  test('ArrowRight navigates between shadow root items', async () => {
    item1.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(root.activeElement).toBe(item2);
  });

  test('ArrowRight does not wrap when at last shadow item (no wrap token)', async () => {
    item3.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(root.activeElement).toBe(item3);
  });

  test('ArrowLeft navigates backward', async () => {
    item2.focus();
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowRight}');

    expect(root.activeElement).toBe(item3);

    await userEvent.keyboard('{ArrowLeft}');

    expect(root.activeElement).toBe(item2);
  });
});

describe('nested shadow focusgroup', () => {
  let root: ShadowRoot;
  let outer1: HTMLElement;
  let outer2: HTMLElement;
  let inner1: HTMLElement;
  let inner2: HTMLElement;

  beforeEach(() => {
    setupPageWithShadowRoots(
      `
      <div focusgroup="toolbar inline">
        <button tabindex="0" id="outer1">Outer 1</button>
        <my-element id="my-element">
          <template shadowrootmode="open">
            <div focusgroup="toolbar inline">
              <button tabindex="0" id="inner1">Inner 1</button>
              <button tabindex="0" id="inner2">Inner 2</button>
            </div>
          </template>
        </my-element>
        <button tabindex="0" id="outer2">Outer 2</button>
      </div>
    `,
    );

    root = getById('my-element')?.shadowRoot as ShadowRoot;
    outer1 = getById('outer1');
    outer2 = getById('outer2');
    inner1 = root?.getElementById('inner1') as HTMLElement;
    inner2 = root?.getElementById('inner2') as HTMLElement;
  });

  test('outer navigation skips shadow host containing inner focusgroup', async () => {
    outer1.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(outer2).toHaveFocus();
  });

  test('inner shadow focusgroup navigation advances within its own scope', async () => {
    inner1.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(root.activeElement).toBe(inner2);
  });

  test('inner shadow navigation does not wrap past last item', async () => {
    inner2.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(root.activeElement).toBe(inner2);
  });
});

describe('focusgroup with slotted items', () => {
  beforeEach(() => {
    setupPageWithShadowRoots(
      `<div focusgroup="toolbar">
        <my-element id="my-element">
          <template shadowrootmode="open">
            <button tabindex="0" id="item1">One</button>
            <slot></slot>
            <button tabindex="0" id="item3">Three</button>
          </template>
        </my-element>
        <button tabindex="0" id="item2">Two</button>
      </div>
    `,
    );
  });

  test('ArrowRight navigates between shadow and slotted items', async () => {
    const root = getById('my-element')?.shadowRoot as ShadowRoot;
    const item1 = root.getElementById('item1') as HTMLElement;
    const item3 = root.getElementById('item3') as HTMLElement;
    item1.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(root.activeElement).toBe(item3);

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item2')).toHaveFocus();
  });
});

describe('focusgroup with light and shadow items', () => {
  test('ArrowRight navigates between light and shadow items', async () => {
    setupPageWithShadowRoots(
      `
      <div focusgroup="toolbar inline">
        <button tabindex="0" id="item1">One</button>
        <my-element id="my-elemenet">
          <template shadowrootmode="open">
            <button tabindex="0" id="item2">Two</button>
          </template>
        </my-element>
        <button tabindex="0" id="item3">Three</button>
      </div>
    `,
    );
    const root = getById('my-elemenet')?.shadowRoot as ShadowRoot;
    const item2 = root.getElementById('item2');
    getById('item1').focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(root.activeElement).toBe(item2);

    await userEvent.keyboard('{ArrowRight}');

    expect(getById('item3')).toHaveFocus();
  });
});

describe('focusgroup with light, shadow, and slotted items', () => {
  test('navigates between light, shadow, and slotted items', async () => {
    setupPageWithShadowRoots(
      `
      <div focusgroup="toolbar inline">
        <button tabindex="0" id="item1">One</button>
        <my-element id="my-element">
          <template shadowrootmode="open">
            <button tabindex="0" id="item2">Two</button>
            <slot></slot>
            <button tabindex="0" id="item4">Four</button>
          </template>
          <button tabindex="0" id="item3">Three</button>
        </my-element>
        <button tabindex="0" id="item5">Five</button>
      </div>
    `,
    );

    const root = getById('my-element')?.shadowRoot as ShadowRoot;
    const item2 = root.getElementById('item2');
    const item4 = root.getElementById('item4');
    getById('item1').focus();

    await userEvent.keyboard('{ArrowRight}');
    expect(root.activeElement).toBe(item2);

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item3')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(root.activeElement).toBe(item4);

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item5')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}'); // Make sure the pointer doesn’t overshoot
    expect(getById('item5')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(root.activeElement).toBe(item4);

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('item3')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(root.activeElement).toBe(item2);

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('item1')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('item1')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(root.activeElement).toBe(item2);
  });
});

describe('focusgroup with nested group mixed with shadow and slotted children', () => {
  test('navigates between parent and nested groups', async () => {
    setupPageWithShadowRoots(`
      <div id="before" tabindex="0">before</div>
      <div focusgroup="toolbar">
        <button tabindex="0" id="item1">item 1</button>
        <button tabindex="0" id="item2">item 2</button>
        <my-element id="my-element">
          <template shadowrootmode="open">
            <span focusgroup="toolbar wrap">
              <button tabindex="0" id="nested-shadow-first">nested shadow first</button>
              <slot></slot>
              <button tabindex="0" id="nested-shadow-last">nested shadow last</button>
            </span>
          </template>
          <button tabindex="0" id="nested-slotted-1">nested slotted 1</button>
          <button tabindex="0" focusgroupstart id="nested-slotted-2">nested slotted 2</button>
          <button tabindex="0" id="nested-slotted-3">nested slotted 3</button>
        </my-element>
        <button tabindex="0" id="item3">item 3</button>
        <button tabindex="0" id="item4">item 4</button>
      </div>
      <div id="after" tabindex="0">after</div>
    `);

    const root = getById('my-element')?.shadowRoot as ShadowRoot;
    const nestedShadowFirst = root.getElementById('nested-shadow-first');
    const nestedShadowLast = root.getElementById('nested-shadow-last');
    getById('before').focus();

    await useTab();

    expect(getById('item1')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowRight}');

    expect(getById('item4')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowLeft}');

    expect(getById('item1')).toHaveFocus();

    await useTab();

    expect(getById('nested-slotted-2')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowLeft}');

    expect(root.activeElement).toBe(nestedShadowFirst);

    await userEvent.keyboard('{ArrowLeft}');

    expect(root.activeElement).toBe(nestedShadowLast);

    await useTab();

    expect(getById('item3')).toHaveFocus();
  });
});

describe('focusable shadow hosts as focusgroup items', () => {
  beforeEach(() => {
    setupPageWithShadowRoots(`
    <button tabindex="0" id="before">before</button>
    <my-element id="my-element" focusgroup="tablist">
      <template shadowrootmode="open"><slot></slot></template>
      <span tabindex="0" id="tab1">
        <template shadowrootmode="open"><slot></slot></template>
        tab 1
      </span>
      <span tabindex="0" id="tab2">
        <template shadowrootmode="open"><slot></slot></template>
        tab 2
      </span>
      <span tabindex="0" id="tab3">
        <template shadowrootmode="open"><slot></slot></template>
        tab 3
      </span>
    </my-element>
    <button tabindex="0" id="after">after</button>
  `);
  });

  test('should have a single tab stop', async () => {
    getById('before').focus();
    await useTab();
    expect(getById('tab1')).toHaveFocus();

    await useTab();
    expect(getById('after')).toHaveFocus();
  });

  test('should gain directional navigation', async () => {
    getById('tab2').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('tab3')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('tab1')).toHaveFocus();
  });
});

describe('top-layer modal dialog', () => {
  test("modal dialog's own focusgroup navigates in both directions while in the top layer", async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <button tabindex="0" id="a">A</button>
        <dialog id="dlg" focusgroup="toolbar inline">
          <button tabindex="0" id="dlg_x">X</button>
          <button tabindex="0" id="dlg_y">Y</button>
          <button tabindex="0" id="dlg_close">Close</button>
        </dialog>
        <button tabindex="0" id="b">B</button>
      </div>`;

    (getById('dlg') as HTMLDialogElement).showModal();

    getById('dlg_x').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('dlg_y')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('dlg_close')).toHaveFocus();

    getById('dlg_close').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('dlg_y')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('dlg_x')).toHaveFocus();
  });
});

describe('top-layer popover excluded from ancestor navigation', () => {
  test('arrow navigation skips a shown popover in ancestor focusgroup', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <button tabindex="0" id="before_pop">Before</button>
        <div id="popover_simple" popover>
          <button tabindex="0" id="pop_item">Inside popover</button>
        </div>
        <button tabindex="0" id="after_pop">After</button>
      </div>`;

    getById('popover_simple').showPopover();

    getById('before_pop').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('after_pop')).toHaveFocus();

    getById('after_pop').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('before_pop')).toHaveFocus();
  });

  test('arrow keys do not navigate from inside a top-layer popover without own focusgroup', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <button tabindex="0" id="before_pop">Before</button>
        <div id="popover_simple" popover>
          <button tabindex="0" id="pop_item">Inside popover</button>
        </div>
        <button tabindex="0" id="after_pop">After</button>
      </div>`;

    getById('popover_simple').showPopover();

    getById('pop_item').focus();
    for (const key of ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp']) {
      await userEvent.keyboard(`{${key}}`);
      expect(getById('pop_item')).toHaveFocus();
    }
  });

  test('popover as the first focusgroup child does not break Home/arrow navigation', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <div id="first_pop" popover>
          <button tabindex="0" id="first_pop_inner">Inside popover</button>
        </div>
        <button tabindex="0" id="first_a">A</button>
        <button tabindex="0" id="first_b">B</button>
      </div>`;

    getById('first_pop').showPopover();

    getById('first_a').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('first_b')).toHaveFocus();

    getById('first_b').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('first_a')).toHaveFocus();

    getById('first_b').focus();
    await userEvent.keyboard('{Home}');
    expect(getById('first_a')).toHaveFocus();
  });

  test('popover sibling of focusgroup does not interfere with arrow navigation', async () => {
    document.body.innerHTML = `<button tabindex="0" id="sib_before">before</button>
      <div focusgroup="tablist nomemory">
        <button tabindex="0" id="sib_info">info</button>
        <button tabindex="0" id="sib_toggle" commandfor="sib_pop" command="toggle-popover">toggle</button>
        <button tabindex="0" id="sib_copy">copy</button>
      </div>
      <button tabindex="0" id="sib_after">after</button>
      <div id="sib_pop" popover focusgroup="none">
        <button tabindex="0" id="sib_share">share</button>
      </div>`;

    getById('sib_pop').showPopover();

    // tablist wraps by default.
    getById('sib_info').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('sib_toggle')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('sib_copy')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('sib_info')).toHaveFocus();

    getById('sib_copy').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('sib_toggle')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('sib_info')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('sib_copy')).toHaveFocus();
  });
});

describe('top-layer element with own focusgroup', () => {
  test('popover with own focusgroup is excluded from ancestor arrow navigation', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <button tabindex="0" id="outer_a">A</button>
        <div id="popover_fg" popover focusgroup="toolbar inline">
          <button tabindex="0" id="inner_x">X</button>
          <button tabindex="0" id="inner_y">Y</button>
        </div>
        <button tabindex="0" id="outer_b">B</button>
      </div>`;

    getById('popover_fg').showPopover();

    getById('outer_a').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('outer_b')).toHaveFocus();
  });

  test('inner focusgroup on a shown popover operates independently', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <button tabindex="0" id="outer_a">A</button>
        <div id="popover_fg" popover focusgroup="toolbar inline">
          <button tabindex="0" id="inner_x">X</button>
          <button tabindex="0" id="inner_y">Y</button>
        </div>
        <button tabindex="0" id="outer_b">B</button>
      </div>`;

    getById('popover_fg').showPopover();

    getById('inner_x').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('inner_y')).toHaveFocus();

    getById('inner_y').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('inner_x')).toHaveFocus();
  });

  test('focusable top-layer element with own focusgroup is not an outer entry', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <button tabindex="0" id="focusable_outer_a">A</button>
        <div id="focusable_pop" tabindex="0" popover focusgroup="toolbar inline">
          <button tabindex="0" id="focusable_inner_x">X</button>
        </div>
        <button tabindex="0" id="focusable_outer_b">B</button>
      </div>`;

    getById('focusable_pop').showPopover();

    getById('focusable_outer_a').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('focusable_outer_b')).toHaveFocus();

    getById('focusable_outer_b').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('focusable_outer_a')).toHaveFocus();
  });
});

describe('top-layer exclusion is dynamic', () => {
  test('show and hide cycles', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline wrap">
        <button tabindex="0" id="a">A</button>
        <div id="pop" popover>
          <button tabindex="0" id="x">X</button>
        </div>
        <button tabindex="0" id="b">B</button>
      </div>`;

    // Hidden popover phase.
    getById('a').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('b')).toHaveFocus();

    // Shown popover phase.
    getById('pop').showPopover();
    getById('a').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('b')).toHaveFocus();

    // After hiding.
    getById('pop').hidePopover();
    getById('a').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('b')).toHaveFocus();
  });

  test('wrapping navigation skips shown popover subtree', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline wrap">
        <button tabindex="0" id="a">A</button>
        <div id="pop" popover>
          <button tabindex="0" id="x">X</button>
        </div>
        <button tabindex="0" id="b">B</button>
      </div>`;
    getById('pop').showPopover();

    getById('a').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('b')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('a')).toHaveFocus();

    getById('b').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('a')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('b')).toHaveFocus();
  });

  test('Home and End keys skip shown popover subtree', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline wrap">
        <button tabindex="0" id="a">A</button>
        <div id="pop" popover>
          <button tabindex="0" id="x">X</button>
        </div>
        <button tabindex="0" id="b">B</button>
      </div>`;
    getById('pop').showPopover();

    getById('a').focus();
    await userEvent.keyboard('{Home}');
    expect(getById('a')).toHaveFocus();

    getById('a').focus();
    await userEvent.keyboard('{End}');
    expect(getById('b')).toHaveFocus();

    getById('b').focus();
    await userEvent.keyboard('{Home}');
    expect(getById('a')).toHaveFocus();
  });

  test('block-axis navigation skips shown popover subtree', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar block">
        <button tabindex="0" id="up">Up</button>
        <div id="pop_block" popover>
          <button tabindex="0" id="block_inner">Inner</button>
        </div>
        <button tabindex="0" id="down">Down</button>
      </div>`;
    getById('pop_block').showPopover();

    getById('up').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(getById('down')).toHaveFocus();

    getById('down').focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(getById('up')).toHaveFocus();
  });

  test('arrow navigation skips multiple simultaneously shown popovers', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <button tabindex="0" id="m_a">A</button>
        <div id="pop_m1" popover>
          <button tabindex="0" id="m_x1">X1</button>
        </div>
        <button tabindex="0" id="m_b">B</button>
        <div id="pop_m2" popover>
          <button tabindex="0" id="m_x2">X2</button>
        </div>
        <button tabindex="0" id="m_c">C</button>
      </div>`;
    getById('pop_m1').showPopover();
    getById('pop_m2').showPopover();

    getById('m_a').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('m_b')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('m_c')).toHaveFocus();

    getById('m_c').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('m_b')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('m_a')).toHaveFocus();
  });

  test('focusgroup memory falls through when the remembered item enters the top layer', async () => {
    document.body.innerHTML = `<button tabindex="0" id="mem_before">Before</button>
      <div focusgroup="toolbar inline">
        <button tabindex="0" id="mem_a">A</button>
        <div id="mem_pop">
          <button tabindex="0" id="mem_x">X</button>
        </div>
        <button tabindex="0" id="mem_b">B</button>
      </div>
      <button tabindex="0" id="mem_after">After</button>`;

    getById('mem_x').focus();
    expect(getById('mem_x')).toHaveFocus();

    getById('mem_pop').setAttribute('popover', '');
    getById('mem_pop').showPopover();

    getById('mem_before').focus();
    await useTab();
    expect(getById('mem_a')).toHaveFocus();
  });
});

describe('popover invoker inside focusgroup', () => {
  test('arrow keys skip a popover opened by a focusgroup-item invoker', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <button tabindex="0" id="before">Before</button>
        <button tabindex="0" id="invoker" popovertarget="pop">Invoker</button>
        <button tabindex="0" id="after">After</button>
      </div>
      <div id="pop" popover>
        <button tabindex="0" id="pop_first">Popover first</button>
        <button tabindex="0" id="pop_last">Popover last</button>
      </div>
      <button tabindex="0" id="outside">Outside</button>`;

    getById('invoker').focus();
    await userEvent.click(getById('invoker'));
    await vi.waitFor(() => expect(getById('pop')).toBeVisible());

    getById('before').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('invoker')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('after')).toHaveFocus();

    getById('after').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('invoker')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('before')).toHaveFocus();
  });

  test('Tab from a focusgroup-item invoker enters the open popover', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <button tabindex="0" id="before">Before</button>
        <button tabindex="0" id="invoker" popovertarget="pop">Invoker</button>
        <button tabindex="0" id="after">After</button>
      </div>
      <div id="pop" popover>
        <button tabindex="0" id="pop_first">Popover first</button>
        <button tabindex="0" id="pop_last">Popover last</button>
      </div>
      <button tabindex="0" id="outside">Outside</button>`;

    getById('invoker').focus();
    await userEvent.click(getById('invoker'));
    expect(getById('pop')).toBeVisible();

    getById('invoker').focus();
    await useTab();
    expect(getById('pop_first')).toHaveFocus();
    await useTab();
    expect(getById('pop_last')).toHaveFocus();
  });

  test('Shift+Tab from popover content opened by an invoker returns to the invoker', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <button tabindex="0" id="before">Before</button>
        <button tabindex="0" id="invoker" popovertarget="pop">Invoker</button>
        <button tabindex="0" id="after">After</button>
      </div>
      <div id="pop" popover>
        <button tabindex="0" id="pop_first">Popover first</button>
        <button tabindex="0" id="pop_last">Popover last</button>
      </div>
      <button tabindex="0" id="outside">Outside</button>`;

    getById('invoker').focus();
    await userEvent.click(getById('invoker'));
    expect(getById('pop')).toBeVisible();

    getById('pop_first').focus();
    await useTab({ shift: true });
    expect(getById('invoker')).toHaveFocus();
  });

  test('Tab and Shift+Tab on a tabindex=-1 popover invoker do not crash', async () => {
    document.body.innerHTML = `<button tabindex="0" id="outside">Outside</button>
      <div focusgroup="menu">
        <button tabindex="-1" id="neg_invoker"
                commandfor="neg_pop" command="toggle-popover">icecream</button>
      </div>
      <div id="neg_pop" popover>popover</div>
      <button tabindex="0" id="neg_after">bread</button>`;

    await userEvent.click(getById('neg_invoker'));
    expect(getById('neg_pop')).toBeVisible();

    getById('neg_invoker').focus();
    await useTab();
    expect(getById('neg_after')).toHaveFocus();

    getById('neg_after').focus();
    await useTab({ shift: true });
    expect(getById('outside')).toHaveFocus();
  });

  test('Tab from a popovertarget invoker reaches the popover even when it precedes the invoker', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <div id="pt_pop" popover>
          <button tabindex="0" id="pt_pop_first">Popover first</button>
        </div>
        <button tabindex="0" id="pt_before">Before</button>
        <button tabindex="0" id="pt_invoker" popovertarget="pt_pop">Invoker</button>
      </div>
      <button tabindex="0" id="pt_outside">Outside</button>`;

    getById('pt_invoker').focus();
    await userEvent.click(getById('pt_invoker'));
    expect(getById('pt_pop')).toBeVisible();

    await useTab();
    expect(getById('pt_pop_first')).toHaveFocus();
  });

  test('Tab from a commandfor invoker reaches the popover even when it precedes the invoker', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <div id="cf_pop" popover>
          <button tabindex="0" id="cf_pop_first">Popover first</button>
        </div>
        <button tabindex="0" id="cf_before">Before</button>
        <button tabindex="0" id="cf_invoker" commandfor="cf_pop" command="toggle-popover">Invoker</button>
      </div>
      <button tabindex="0" id="cf_outside">Outside</button>`;

    getById('cf_invoker').focus();
    await userEvent.click(getById('cf_invoker'));
    expect(getById('cf_pop')).toBeVisible();

    await useTab();
    expect(getById('cf_pop_first')).toHaveFocus();
  });

  test('Tab from a showPopover source invoker reaches the popover even when it precedes the invoker', async () => {
    document.body.innerHTML = `<div focusgroup="toolbar inline">
        <div id="src_pop" popover>
          <button tabindex="0" id="src_pop_first">Popover first</button>
        </div>
        <button tabindex="0" id="src_before">Before</button>
        <button tabindex="0" id="src_invoker" popovertarget="src_pop">Invoker</button>
      </div>
      <button tabindex="0" id="src_outside">Outside</button>`;

    await userEvent.click(getById('src_invoker'));
    expect(getById('src_pop')).toBeVisible();

    await useTab();
    expect(getById('src_pop_first')).toHaveFocus();
  });
});

describe('elements with tabindex=-1 participate in focusgroup navigation when focused, otherwise skipped', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div focusgroup="toolbar">
          <button tabindex="0" id="b1">Button 1</button>
          <div id="b2" tabindex="-1">Button 2</div>
          <button tabindex="0" id="b3">Button 3</button>
        </div>`;
  });

  test('ArrowRight from tabindex=-1 element moves to next item', async () => {
    getById('b2').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('b3')).toHaveFocus();
  });

  test('ArrowLeft from tabindex=-1 element moves to previous item', async () => {
    getById('b2').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('b1')).toHaveFocus();
  });

  test('ArrowRight from b1 skips b2 (tabindex=-1) and goes to b3', async () => {
    getById('b1').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('b3')).toHaveFocus();
  });

  test('ArrowLeft from b3 skips b2 (tabindex=-1) and goes to b1', async () => {
    getById('b3').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('b1')).toHaveFocus();
  });
});

describe('navigation respects bounds when edges are tabindex=-1', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div focusgroup="toolbar">
        <div id="start" tabindex="-1">Start</div>
        <button tabindex="0" id="mid">Mid</button>
        <div id="end" tabindex="-1">End</div>
      </div>`;
  });

  test('ArrowRight from mid stays at mid when end is tabindex=-1 and no wrap', async () => {
    getById('mid').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('mid')).toHaveFocus();
  });

  test('ArrowLeft from mid stays at mid when start is tabindex=-1 and no wrap', async () => {
    getById('mid').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('mid')).toHaveFocus();
  });

  test('ArrowRight from start (tabindex=-1) goes to mid', async () => {
    getById('start').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('mid')).toHaveFocus();
  });

  test('ArrowLeft from end (tabindex=-1) goes to mid', async () => {
    getById('end').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('mid')).toHaveFocus();
  });
});

describe('wrapping logic skips items with tabindex=-1', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div focusgroup="toolbar wrap">
        <div id="w1" tabindex="-1">W1</div>
        <button tabindex="0" id="w2">W2</button>
        <button tabindex="0" id="w3">W3</button>
        <div id="w4" tabindex="-1">W4</div>
      </div>`;
  });

  test('wrapping forward from last focusable item skips tabindex=-1 ends', async () => {
    getById('w3').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('w2')).toHaveFocus();
  });

  test('wrapping backward from first focusable item skips tabindex=-1 ends', async () => {
    getById('w2').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('w3')).toHaveFocus();
  });
});

describe('Toolbar focusgroup', () => {
  beforeEach(
    () =>
      (document.body.innerHTML = `
      <div focusgroup="toolbar">
        <button tabindex="0" id="btn-bold" >Bold</button>
        <button tabindex="0" id="btn-italic">Italic</button>
        <button tabindex="0" id="btn-underline">Underline</button>
      </div>
      <div focusgroup="toolbar">
        <button tabindex="0" id="nested-a">A</button>
        <span><button tabindex="0" id="nested-b">B</button></span>
        <button tabindex="0" id="nested-c">C</button>
      </div>
    `),
  );

  test('ArrowRight moves focus forward', async () => {
    getById('btn-bold').focus();
    expect(getById('btn-bold')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('btn-italic')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('btn-underline')).toHaveFocus();
  });

  test('ArrowLeft moves focus backward', async () => {
    getById('btn-underline').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('btn-italic')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('btn-bold')).toHaveFocus();
  });

  test('ArrowRight at last item without wrap does NOT move', async () => {
    getById('btn-underline').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('btn-underline')).toHaveFocus();
  });

  test('ArrowLeft at first item without wrap does NOT move', async () => {
    getById('btn-bold').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('btn-bold')).toHaveFocus();
  });

  test('Home moves to first item', async () => {
    getById('btn-underline').focus();
    await userEvent.keyboard('{Home}');
    expect(getById('btn-bold')).toHaveFocus();
  });

  test('End moves to last item', async () => {
    getById('btn-bold').focus();
    await userEvent.keyboard('{End}');
    expect(getById('btn-underline')).toHaveFocus();
  });

  test('ArrowDown/ArrowUp do not navigate (inline-only toolbar)', async () => {
    getById('btn-bold').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(getById('btn-bold')).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    expect(getById('btn-bold')).toHaveFocus();
  });

  test('navigates through nested DOM structure', async () => {
    getById('nested-a').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('nested-b')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('nested-c')).toHaveFocus();
  });
});

describe('Toolbar with wrap', () => {
  beforeEach(
    () =>
      (document.body.innerHTML = `
      <div focusgroup="toolbar wrap">
        <button tabindex="0" id="wrap-a">A</button>
        <button tabindex="0" id="wrap-b">B</button>
        <button tabindex="0" id="wrap-c">C</button>
      </div>
    `),
  );

  test('wraps from last to first', async () => {
    getById('wrap-c').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('wrap-a')).toHaveFocus();
  });

  test('wraps from first to last', async () => {
    getById('wrap-a').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('wrap-c')).toHaveFocus();
  });
});

describe('Tablist focusgroup', () => {
  beforeEach(
    () =>
      (document.body.innerHTML = `
      <div id="tablist" focusgroup="tablist">
        <button tabindex="0" id="tab-1">Tab 1</button>
        <button tabindex="0" id="tab-2">Tab 2</button>
        <button tabindex="0" id="tab-3">Tab 3</button>
      </div>
    `),
  );

  test('ArrowRight moves between tabs (inline default)', async () => {
    getById('tab-1').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('tab-2')).toHaveFocus();
  });

  test('wraps by default (tablist default modifier)', async () => {
    getById('tab-3').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('tab-1')).toHaveFocus();
  });
});

describe('Menu focusgroup', () => {
  beforeEach(
    () =>
      (document.body.innerHTML = `
      <div id="menu" focusgroup="menu">
        <button tabindex="0" id="item-cut">Cut</button>
        <button tabindex="0" id="item-copy">Copy</button>
        <button tabindex="0" id="item-paste">Paste</button>
      </div>
    `),
  );

  test('ArrowDown moves forward (block default)', async () => {
    getById('item-cut').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(getById('item-copy')).toHaveFocus();
  });

  test('ArrowUp moves backward', async () => {
    getById('item-paste').focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(getById('item-copy')).toHaveFocus();
  });

  test('wraps by default', async () => {
    getById('item-paste').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(getById('item-cut')).toHaveFocus();
  });

  test('ArrowLeft/ArrowRight do not navigate (block-only)', async () => {
    getById('item-cut').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('item-cut')).toHaveFocus();
  });
});

describe('Memory', () => {
  beforeEach(
    () =>
      (document.body.innerHTML = `
      <div focusgroup="toolbar">
        <button tabindex="0" id="mem-a">A</button>
        <button tabindex="0" id="mem-b">B</button>
        <button tabindex="0" id="mem-c">C</button>
      </div>
      <button tabindex="0" id="middle">Middle</button>
      <div focusgroup="toolbar nomemory">
        <button tabindex="0" id="nomem-a">A</button>
        <button tabindex="0" id="nomem-b" focusgroupstart>B</button>
        <button tabindex="0" id="nomem-c">C</button>
      </div>
      <button tabindex="0" id="after">After</button>
    `),
  );

  test('remembers last focused item on re-entry', async () => {
    // Focus the toolbar and move to C
    getById('mem-a').focus();
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('mem-c')).toHaveFocus();

    // Tab away
    await useTab();
    expect(getById('mem-c')).not.toHaveFocus();

    // Tab back — should return to C (memory)
    await useTab({ shift: true });
    expect(getById('mem-c')).toHaveFocus();
  });

  test('focusgroupstart determines initial focus', async () => {
    // Tab into the nomemory toolbar — should focus B (focusgroupstart)
    getById('middle').focus();
    await useTab();
    expect(getById('nomem-b')).toHaveFocus();
  });

  test('nomemory always returns to focusgroupstart', async () => {
    // Focus B (focusgroupstart), move to C
    getById('middle').focus();
    await useTab();
    expect(getById('nomem-b')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('nomem-c')).toHaveFocus();

    // Tab away and back — should return to B, not C
    await useTab();
    await useTab({ shift: true });
    expect(getById('nomem-b')).toHaveFocus();
  });
});

describe('Nested focusgroups', () => {
  beforeEach(
    () =>
      (document.body.innerHTML = `
      <div focusgroup="toolbar">
        <button tabindex="0" id="outer-a">Outer A</button>
        <button tabindex="0" id="outer-b">Outer B</button>
        <div focusgroup="toolbar">
          <button tabindex="0" id="inner-a">Inner A</button>
          <button tabindex="0" id="inner-b">Inner B</button>
          <button tabindex="0" id="inner-c">Inner C</button>
        </div>
        <button tabindex="0" id="outer-c">Outer C</button>
      </div>
      <div focusgroup="toolbar">
        <button tabindex="0" id="opt-a">A</button>
        <button tabindex="0" id="opt-excluded" focusgroup="none">Excluded</button>
        <button tabindex="0" id="opt-b">B</button>
      </div>
    `),
  );

  test('inner focusgroup navigates independently', async () => {
    getById('inner-a').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('inner-b')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getById('inner-c')).toHaveFocus();
  });

  test('outer focusgroup does not include inner items', async () => {
    getById('outer-a').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('outer-b')).toHaveFocus();

    // Next ArrowRight skips inner focusgroup items and goes to outer-c
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('outer-c')).toHaveFocus();

    // Continuing right stops at the end (no wrap)
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('outer-c')).toHaveFocus();
  });

  test('focusgroup="none" excludes items from navigation', async () => {
    getById('opt-a').focus();
    await userEvent.keyboard('{ArrowRight}');
    // Should skip the excluded button and go to opt-b
    expect(getById('opt-b')).toHaveFocus();
  });
});

describe('RTL support', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div dir="rtl" focusgroup="toolbar">
        <button tabindex="0" id="rtl-a">A</button>
        <button tabindex="0" id="rtl-b">B</button>
      </div>
    `;
  });

  test('ArrowLeft moves forward in RTL', async () => {
    getById('rtl-a').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(getById('rtl-b')).toHaveFocus();
  });

  test('ArrowRight moves backward in RTL', async () => {
    getById('rtl-b').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getById('rtl-a')).toHaveFocus();
  });
});

describe('getItems', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('discovers direct child buttons', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <button>A</button>
        <button>B</button>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(3);
    expect(items.map((el?: Element | null) => el?.textContent)).toEqual([
      'A',
      'B',
      'C',
    ]);
  });

  test('discovers nested focusable descendants', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <div>
          <button>A</button>
          <div>
            <button>B</button>
          </div>
        </div>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(3);
  });

  test('skips non-focusable elements', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <span>Not focusable</span>
        <button>A</button>
        <div>Not focusable</div>
        <button>B</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
  });

  test('skips disabled elements', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <button>A</button>
        <button disabled>Disabled</button>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
  });

  test('skips hidden elements', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <button>A</button>
        <button hidden>Hidden</button>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
  });

  test('skips subtrees with focusgroup="none"', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <button>A</button>
        <div focusgroup="none">
          <button>Excluded</button>
        </div>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
    expect(items.map((el?: Element | null) => el?.textContent)).toEqual([
      'A',
      'C',
    ]);
  });

  test('skips nested focusgroup subtrees', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <button>A</button>
        <div focusgroup="menu">
          <button>Nested</button>
        </div>
        <button>C</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
    expect(items.map((el?: Element | null) => el?.textContent)).toEqual([
      'A',
      'C',
    ]);
  });

  test('includes elements with tabindex="0"', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar">
        <div tabindex="0">Focusable div</div>
        <button>A</button>
      </div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(2);
  });

  test('returns empty array for empty container', () => {
    document.body.innerHTML = `
      <div id="fg" focusgroup="toolbar"></div>
    `;
    const container = document.getElementById('fg');
    const items = getItems(container);
    expect(items).toHaveLength(0);
  });
});

const createGroup = (value: string) => {
  const div = document.createElement('div');
  div.setAttribute('focusgroup', value);
  return div;
};

describe('getGroup', () => {
  test('returns null unknown behavior token', () => {
    expect(getGroup(new Set([createGroup('unknown')]))?.items).toBeUndefined();
  });

  // Toolbar
  test('parses "toolbar" with defaults (block, nowrap)', () => {
    const group = getGroup(new Set([createGroup('toolbar')]));
    expect(group?.items).toBe(null);
    expect(group?.block).toBe(false);
    expect(group?.wrap).toBe(false);
  });

  test('parses "toolbar wrap"', () => {
    const group = getGroup(new Set([createGroup('toolbar wrap')]));
    expect(group?.wrap).toBe(true);
  });

  // Tablist
  test('parses "tablist" with defaults (inline, wrap)', () => {
    const group = getGroup(new Set([createGroup('tablist')]));
    expect(group?.items).toBe('tab');
    expect(group?.block).toBe(false);
    expect(group?.wrap).toBe(true);
  });

  test('parses "tablist nowrap" overrides default wrap', () => {
    const group = getGroup(new Set([createGroup('tablist nowrap')]));
    expect(group?.wrap).toBe(false);
  });

  test('parses "tablist block" overrides default inline', () => {
    const group = getGroup(new Set([createGroup('tablist block')]));
    expect(group?.block).toBe(true);
  });

  // Radiogroup
  test('parses "radiogroup" with defaults (both, wrap)', () => {
    const group = getGroup(new Set([createGroup('radiogroup')]));
    expect(group?.block).toBe(null);
    expect(group?.wrap).toBe(true);
  });

  // Listbox
  test('parses "listbox" with defaults (block, nowrap)', () => {
    const group = getGroup(new Set([createGroup('listbox')]));
    expect(group?.block).toBe(true);
    expect(group?.wrap).toBe(false);
  });

  // Menu
  test('parses "menu" with defaults (block, wrap)', () => {
    const group = getGroup(new Set([createGroup('menu')]));
    expect(group?.block).toBe(true);
    expect(group?.wrap).toBe(true);
  });

  // Menubar
  test('parses "menubar" with defaults (inline, wrap)', () => {
    const group = getGroup(new Set([createGroup('menubar')]));
    expect(group?.block).toBe(false);
    expect(group?.wrap).toBe(true);
  });

  // Modifier combinations
  test('parses multiple modifiers together', () => {
    const group = getGroup(
      new Set([createGroup('toolbar block wrap nomemory')]),
    );
    expect(group?.block).toBe(true);
    expect(group?.wrap).toBe(true);
  });

  test('ignores unknown tokens', () => {
    const group = getGroup(new Set([createGroup('toolbar foo bar')]));
    expect(group?.items).toBe(null);
    expect(group?.block).toBe(false);
  });

  test('is case-insensitive', () => {
    const group = getGroup(new Set([createGroup('TOOLBAR WRAP')]));
    expect(group?.items).toBe(null);
    expect(group?.wrap).toBe(true);
  });

  test('handles extra whitespace', () => {
    const group = getGroup(new Set([createGroup('  toolbar   wrap  ')]));
    expect(group?.items).toBe(null);
    expect(group?.wrap).toBe(true);
  });

  test('explicit modifier matches default (redundant but valid)', () => {
    const group = getGroup(new Set([createGroup('tablist inline wrap')]));
    expect(group?.block).toBe(false);
    expect(group?.wrap).toBe(true);
  });
});

describe('isConflict', () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      writingMode: 'horizontal-tb',
      direction: 'ltr',
      overflowX: 'visible',
      overflowY: 'visible',
    } as CSSStyleDeclaration);
  });

  test('text input is a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'text';
    expect(isConflict(input)).toBe(true);
  });

  test('number input is a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'number';
    expect(isConflict(input)).toBe(true);
  });

  test('button input is NOT a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'button';
    expect(isConflict(input)).toBe(false);
  });

  test('submit input is NOT a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'submit';
    expect(isConflict(input)).toBe(false);
  });

  test('checkbox input is NOT a conflict element', () => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    expect(isConflict(input)).toBe(false);
  });

  test('textarea is a conflict element', () => {
    const textarea = document.createElement('textarea');
    expect(isConflict(textarea)).toBe(true);
  });

  test('select is a conflict element', () => {
    const select = document.createElement('select');
    expect(isConflict(select)).toBe(true);
  });

  test('contenteditable is a conflict element', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    expect(isConflict(div)).toBe(true);
  });

  test('button is NOT a conflict element', () => {
    const btn = document.createElement('button');
    expect(isConflict(btn)).toBe(false);
  });

  test('anchor is NOT a conflict element', () => {
    const a = document.createElement('a');
    a.href = '#';
    expect(isConflict(a)).toBe(false);
  });

  test('plain div is NOT a conflict element', () => {
    const div = document.createElement('div');
    expect(isConflict(div)).toBe(false);
  });
});

describe('isFocusable', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('button is focusable', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);
    expect(isFocusable(btn)).toBe(true);
  });

  test('div is not focusable', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    expect(isFocusable(div)).toBe(false);
  });

  test('div with tabindex="0" is focusable', () => {
    const div = document.createElement('div');
    div.setAttribute('tabindex', '0');
    document.body.appendChild(div);
    expect(isFocusable(div)).toBe(true);
  });

  test('disabled button is not focusable', () => {
    const btn = document.createElement('button');
    btn.disabled = true;
    document.body.appendChild(btn);
    expect(isFocusable(btn)).toBe(false);
  });

  test('anchor with href is focusable', () => {
    const a = document.createElement('a');
    a.href = '#';
    document.body.appendChild(a);
    expect(isFocusable(a)).toBe(true);
  });

  test('disabled input is not focusable', () => {
    const input = document.createElement('input');
    input.disabled = true;
    document.body.appendChild(input);
    expect(isFocusable(input)).toBe(false);
  });

  test('textarea is focusable', () => {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    expect(isFocusable(textarea)).toBe(true);
  });

  test('select is focusable', () => {
    const select = document.createElement('select');
    document.body.appendChild(select);
    expect(isFocusable(select)).toBe(true);
  });

  test('contenteditable element is focusable', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    document.body.appendChild(div);
    expect(isFocusable(div)).toBe(true);
  });

  test('non-Element returns false', () => {
    const text = document.createTextNode('hello');
    expect(isFocusable(text as unknown as HTMLElement)).toBe(false);
  });
});
