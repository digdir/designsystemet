import { handleClickDelegate } from './click-delegate';

// Create a mock MouseEvent-like object since isTrusted cannot be set in real browser tests
const createMockEvent = (
  target: EventTarget,
  options: {
    button?: number;
    isTrusted?: boolean;
    metaKey?: boolean;
    ctrlKey?: boolean;
  } = {},
): MouseEvent => {
  const {
    button = 0,
    isTrusted = true,
    metaKey = false,
    ctrlKey = false,
  } = options;
  return {
    target,
    button,
    isTrusted,
    metaKey,
    ctrlKey,
    stopImmediatePropagation: vi.fn(),
  } as unknown as MouseEvent;
};

describe('handleClickDelegate', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should delegate click to target element', () => {
    container.innerHTML = `
      <div data-clickdelegate>
        <a href="#test" data-clicktarget>Link</a>
        <span class="content">Click me</span>
      </div>
    `;

    const link = container.querySelector('a')!;
    const content = container.querySelector('.content')!;
    const clickSpy = vi.fn();
    link.addEventListener('click', clickSpy);

    handleClickDelegate(createMockEvent(content, { button: 0 }));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not delegate click when clicking on interactive elements', () => {
    container.innerHTML = `
      <div data-clickdelegate>
        <a href="#test" data-clicktarget>Link</a>
        <button>Button inside</button>
      </div>
    `;

    const link = container.querySelector('a')!;
    const button = container.querySelector('button')!;
    const linkClickSpy = vi.fn();
    link.addEventListener('click', linkClickSpy);

    handleClickDelegate(createMockEvent(button, { button: 0 }));

    expect(linkClickSpy).not.toHaveBeenCalled();
  });

  it('should not delegate click when clicking directly on the target', () => {
    container.innerHTML = `
      <div data-clickdelegate>
        <a href="#test" data-clicktarget>Link</a>
      </div>
    `;

    const link = container.querySelector('a')!;
    const clickSpy = vi.fn();
    link.addEventListener('click', clickSpy);

    handleClickDelegate(createMockEvent(link, { button: 0 }));

    // Should not trigger an extra click since target contains event.target
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should not delegate right clicks (button: 2)', () => {
    container.innerHTML = `
      <div data-clickdelegate>
        <a href="#test" data-clicktarget>Link</a>
        <span class="content">Click me</span>
      </div>
    `;

    const link = container.querySelector('a')!;
    const content = container.querySelector('.content')!;
    const clickSpy = vi.fn();
    link.addEventListener('click', clickSpy);

    handleClickDelegate(createMockEvent(content, { button: 2 }));

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should not delegate click to nested interactive elements', () => {
    container.innerHTML = `
      <div data-clickdelegate>
        <a href="#test" data-clicktarget>Link</a>
        <input type="text" />
      </div>
    `;

    const link = container.querySelector('a')!;
    const input = container.querySelector('input')!;
    const clickSpy = vi.fn();
    link.addEventListener('click', clickSpy);

    handleClickDelegate(createMockEvent(input, { button: 0 }));

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should work with button as target', () => {
    container.innerHTML = `
      <div data-clickdelegate>
        <button data-clicktarget>Click Target</button>
        <span class="content">Click me</span>
      </div>
    `;

    const button = container.querySelector('button')!;
    const content = container.querySelector('.content')!;
    const clickSpy = vi.fn();
    button.addEventListener('click', clickSpy);

    handleClickDelegate(createMockEvent(content, { button: 0 }));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not delegate when no clicktarget is present', () => {
    container.innerHTML = `
      <div data-clickdelegate>
        <a href="#test">Link without target attribute</a>
        <span class="content">Click me</span>
      </div>
    `;

    const link = container.querySelector('a')!;
    const content = container.querySelector('.content')!;
    const clickSpy = vi.fn();
    link.addEventListener('click', clickSpy);

    handleClickDelegate(createMockEvent(content, { button: 0 }));

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should call stopImmediatePropagation when delegating', () => {
    container.innerHTML = `
      <div data-clickdelegate>
        <a href="#test" data-clicktarget>Link</a>
        <span class="content">Click me</span>
      </div>
    `;

    const content = container.querySelector('.content')!;
    const event = createMockEvent(content, { button: 0 });

    handleClickDelegate(event);

    expect(event.stopImmediatePropagation).toHaveBeenCalled();
  });

  describe('middle click / new tab behavior', () => {
    it('should open link in new tab on middle click', () => {
      const windowOpenSpy = vi
        .spyOn(window, 'open')
        .mockImplementation(() => null);

      container.innerHTML = `
        <div data-clickdelegate>
          <a href="https://example.com/page" rel="noopener" data-clicktarget>Link</a>
          <span class="content">Click me</span>
        </div>
      `;

      const content = container.querySelector('.content')!;

      handleClickDelegate(createMockEvent(content, { button: 1 }));

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://example.com/page',
        undefined,
        'noopener',
      );

      windowOpenSpy.mockRestore();
    });

    it('should open link in new tab on ctrl+click', () => {
      const windowOpenSpy = vi
        .spyOn(window, 'open')
        .mockImplementation(() => null);

      container.innerHTML = `
        <div data-clickdelegate>
          <a href="https://example.com/page" rel="noopener" data-clicktarget>Link</a>
          <span class="content">Click me</span>
        </div>
      `;

      const content = container.querySelector('.content')!;

      handleClickDelegate(
        createMockEvent(content, { button: 0, ctrlKey: true }),
      );

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://example.com/page',
        undefined,
        'noopener',
      );

      windowOpenSpy.mockRestore();
    });

    it('should open link in new tab on meta+click', () => {
      const windowOpenSpy = vi
        .spyOn(window, 'open')
        .mockImplementation(() => null);

      container.innerHTML = `
        <div data-clickdelegate>
          <a href="https://example.com/page" rel="noopener" data-clicktarget>Link</a>
          <span class="content">Click me</span>
        </div>
      `;

      const content = container.querySelector('.content')!;

      handleClickDelegate(
        createMockEvent(content, { button: 0, metaKey: true }),
      );

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://example.com/page',
        undefined,
        'noopener',
      );

      windowOpenSpy.mockRestore();
    });
  });

  describe('skipped interactive elements', () => {
    const interactiveElements = [
      { tag: 'a', attrs: 'href="#"', name: 'anchor' },
      { tag: 'button', attrs: '', name: 'button' },
      { tag: 'label', attrs: '', name: 'label' },
      { tag: 'input', attrs: '', name: 'input' },
      { tag: 'select', attrs: '', name: 'select' },
      { tag: 'textarea', attrs: '', name: 'textarea' },
      { tag: 'dialog', attrs: '', name: 'dialog' },
      { tag: 'div', attrs: 'role="button"', name: 'role=button' },
      { tag: 'div', attrs: 'popover', name: 'popover' },
      { tag: 'div', attrs: 'contenteditable', name: 'contenteditable' },
    ];

    interactiveElements.forEach(({ tag, attrs, name }) => {
      it(`should not delegate click from ${name} element`, () => {
        container.innerHTML = `
          <div data-clickdelegate>
            <button data-clicktarget>Target</button>
            <${tag} ${attrs} class="interactive">Interactive</${tag}>
          </div>
        `;

        const target = container.querySelector('[data-clicktarget]')!;
        const interactive = container.querySelector('.interactive')!;
        const clickSpy = vi.fn();
        target.addEventListener('click', clickSpy);

        handleClickDelegate(createMockEvent(interactive, { button: 0 }));

        expect(clickSpy).not.toHaveBeenCalled();
      });
    });
  });
});
