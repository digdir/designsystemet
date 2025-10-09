import type { MiddlewareState, Placement } from '@floating-ui/dom';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

declare global {
  interface HTMLElementTagNameMap {
    'ds-popover': DsPopover;
  }
}

const arrowPseudoElement = {
  name: 'ArrowPseudoElement',
  fn(data: MiddlewareState) {
    const { elements, rects, placement } = data;

    let arrowX = `${Math.round(rects.reference.width / 2 + rects.reference.x - data.x)}px`;
    let arrowY = `${Math.round(rects.reference.height / 2 + rects.reference.y - data.y)}px`;

    if (rects.reference.width > rects.floating.width) {
      arrowX = `${Math.round(rects.floating.width / 2)}px`;
    }

    if (rects.reference.height > rects.floating.height) {
      arrowY = `${Math.round(rects.floating.height / 2)}px`;
    }

    switch (placement.split('-')[0]) {
      case 'top':
        arrowY = '100%';
        break;
      case 'right':
        arrowX = '0';
        break;
      case 'bottom':
        arrowY = '0';
        break;
      case 'left':
        arrowX = '100%';
        break;
    }

    elements.floating.setAttribute('data-placement', placement.split('-')[0]); // We only need top/left/right/bottom
    elements.floating.style.setProperty('--ds-popover-arrow-x', arrowX);
    elements.floating.style.setProperty('--ds-popover-arrow-y', arrowY);
    return data;
  },
};

export class DsPopover extends HTMLElement {
  constructor() {
    super();
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' }).appendChild(
        document.createElement('slot'),
      );
    }
  }

  get anchor() {
    return this.querySelector(`#${this.getAttribute('anchor') || ''}`) || null;
  }

  get popoverElement() {
    return this.querySelector('[popover]') || null;
  }

  get placement(): Placement {
    return (this.getAttribute('placement') as Placement) || 'top';
  }

  connectedCallback() {
    if (!(this.popoverElement && this.anchor)) {
      throw new Error('Popover and anchor elements must be present');
    }

    if (!this.popoverElement.id) {
      this.popoverElement.id = `popover-${Math.random().toString(36).slice(2)}`;
    }

    this.anchor.setAttribute('popovertarget', this.popoverElement.id);
    const trigger = this.anchor;
    const popover = this.popoverElement as HTMLElement;
    const placement = this.placement;
    const autoPlacement = this.hasAttribute('auto-placement')
      ? Boolean(this.getAttribute('auto-placement'))
      : true;

    autoUpdate(trigger, popover, () => {
      computePosition(trigger, popover, {
        placement,
        strategy: 'fixed',
        middleware: [
          offset((data) => {
            // get pseudo element arrow size
            const styles = getComputedStyle(data.elements.floating, '::before');
            return parseFloat(styles.height);
          }),
          ...(autoPlacement
            ? [flip({ fallbackAxisSideDirection: 'start' }), shift()]
            : []),
          arrowPseudoElement,
        ],
      }).then(({ x, y }) => {
        popover.style.translate = `${x}px ${y}px`;
      });
    });

    const handleClick = (event: MouseEvent) => {
      const el = event.target as Element | null;
      const isTrigger = el?.closest?.(`[popovertarget="${popover?.id}"]`);
      const isOutside = !isTrigger && !popover?.contains(el as Node);

      if (isTrigger) {
        event.preventDefault(); // Prevent native Popover API
        popover.togglePopover?.();
      }
      if (isOutside && popover.matches(':popover-open')) {
        popover.togglePopover?.();
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      console.log('keydown!');
      if (event.key !== 'Escape' || !popover.matches(':popover-open')) return;
      event.preventDefault(); // Prevent closing fullscreen in Safari
      popover.togglePopover?.();
    };

    addEventListener('click', handleClick);
    addEventListener('keydown', handleKeydown);
  }
}

customElements.define('ds-popover', DsPopover);
