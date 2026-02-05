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
  private cleanupAutoUpdate?: () => void;
  private handleClick?: (event: MouseEvent) => void;
  private handleKeydown?: (event: KeyboardEvent) => void;
  private handleBeforeToggle?: (event: Event) => void;
  private handleToggle?: () => void;

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

  get autoPlacement(): boolean {
    return this.hasAttribute('auto-placement')
      ? this.getAttribute('auto-placement') !== 'false'
      : true;
  }

  static observedAttributes = ['placement', 'auto-placement', 'anchor'];

  private updatePosition() {
    const trigger = this.anchor;
    const popover = this.popoverElement as HTMLElement;

    if (!trigger || !popover) return;

    return computePosition(trigger, popover, {
      placement: this.placement,
      strategy: 'fixed',
      middleware: [
        offset((data) => {
          // get pseudo element arrow size
          const styles = getComputedStyle(data.elements.floating, '::before');
          return parseFloat(styles.height);
        }),
        ...(this.autoPlacement
          ? [flip({ fallbackAxisSideDirection: 'start' }), shift()]
          : []),
        arrowPseudoElement,
      ],
    }).then(({ x, y }) => {
      popover.style.translate = `${x}px ${y}px`;
    });
  }

  private startAutoUpdate() {
    this.stopAutoUpdate();

    const trigger = this.anchor;
    const popover = this.popoverElement as HTMLElement;

    if (!trigger || !popover) return;

    this.cleanupAutoUpdate = autoUpdate(trigger, popover, () =>
      this.updatePosition(),
    );
  }

  private stopAutoUpdate() {
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = undefined;
    }
  }

  connectedCallback() {
    if (!(this.popoverElement && this.anchor)) {
      throw new Error('Popover and anchor elements must be present');
    }

    const popover = this.popoverElement as HTMLElement;
    popover.classList.add('ds-popover');

    if (!popover.id) {
      popover.id = `popover-${Math.random().toString(36).slice(2)}`;
    }

    this.anchor.setAttribute('popovertarget', popover.id);

    // Set up event handlers
    this.handleClick = (event: MouseEvent) => {
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

    this.handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !popover.matches(':popover-open')) return;
      event.preventDefault(); // Prevent closing fullscreen in Safari
      popover.togglePopover?.();
    };

    this.handleBeforeToggle = (event: Event) => {
      const toggleEvent = event as ToggleEvent;
      if (toggleEvent.newState === 'open') {
        void this.updatePosition();
      }
    };

    this.handleToggle = () => {
      if (popover.matches(':popover-open')) {
        this.startAutoUpdate();
      } else {
        this.stopAutoUpdate();
      }
    };

    addEventListener('click', this.handleClick);
    addEventListener('keydown', this.handleKeydown);
    popover.addEventListener('beforetoggle', this.handleBeforeToggle);
    popover.addEventListener('toggle', this.handleToggle);
  }

  disconnectedCallback() {
    this.stopAutoUpdate();

    if (this.handleClick) {
      removeEventListener('click', this.handleClick);
    }
    if (this.handleKeydown) {
      removeEventListener('keydown', this.handleKeydown);
    }
    if (this.popoverElement) {
      if (this.handleBeforeToggle) {
        this.popoverElement.removeEventListener(
          'beforetoggle',
          this.handleBeforeToggle,
        );
      }
      if (this.handleToggle) {
        this.popoverElement.removeEventListener('toggle', this.handleToggle);
      }
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    if (
      (name === 'placement' || name === 'auto-placement') &&
      this.popoverElement?.matches(':popover-open')
    ) {
      this.updatePosition();
    }

    if (name === 'anchor') {
      const popover = this.popoverElement;
      if (popover && this.anchor) {
        this.anchor.setAttribute('popovertarget', popover.id);
        if (popover.matches(':popover-open')) {
          this.startAutoUpdate();
        }
      }
    }
  }
}

customElements.define('ds-popover', DsPopover);
