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
    'ds-tooltip': DSTooltip;
  }
}

const arrowPseudoElement = {
  name: 'ArrowPseudoElement',
  fn(data: MiddlewareState) {
    const { elements, rects, placement } = data;

    let arrowX = `${Math.round(
      rects.reference.width / 2 + rects.reference.x - data.x,
    )}px`;
    let arrowY = `${Math.round(
      rects.reference.height / 2 + rects.reference.y - data.y,
    )}px`;

    switch (placement) {
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

    elements.floating.style.setProperty('--dsc-tooltip-arrow-x', arrowX);
    elements.floating.style.setProperty('--dsc-tooltip-arrow-y', arrowY);
    return data;
  },
};

const safeAreaElement = {
  name: 'SafeAreaElement',
  fn(data: MiddlewareState) {
    const { elements, placement } = data;

    let width = '100%';
    let height = 'var(--dsc-tooltip-arrow-size)';
    let translate = '0px';

    switch (placement) {
      case 'top':
        translate = `-50% 0%`;
        break;
      case 'right':
        height = '100%';
        width = 'var(--dsc-tooltip-arrow-size)';
        translate = '-100% -50%';
        break;
      case 'bottom':
        translate = '-50% -100%';
        break;
      case 'left':
        height = '100%';
        width = 'var(--dsc-tooltip-arrow-size)';
        translate = '0 -50%';
        break;
    }

    elements.floating.style.setProperty(
      '--_dsc-tooltip-safearea-height',
      height,
    );
    elements.floating.style.setProperty('--_dsc-tooltip-safearea-width', width);
    elements.floating.style.setProperty(
      '--_dsc-tooltip-safearea-translate',
      translate,
    );
    return data;
  },
};

const _tooltipStyle = `
:host {
    --dsc-tooltip-background: var(--ds-color-neutral-text-default);
  --dsc-tooltip-color: var(--ds-color-neutral-background-default);
  --dsc-tooltip-border-radius: var(--ds-border-radius-default);
  --dsc-tooltip-padding: var(--ds-size-1) var(--ds-size-2);
  --dsc-tooltip-arrow-size: var(--ds-size-2);
  --dsc-tooltip-transition-duration: 0.2s;
  --dsc-tooltip-transition-delay: 150ms;

  & [role="tooltip"] {
    position: fixed;
  inset: 0 auto auto 0;
  background: var(--dsc-tooltip-background);
  border-radius: var(--dsc-tooltip-border-radius);
  box-sizing: border-box;
  border: none;
  border-width: 0;
  color: var(--dsc-tooltip-color);
  line-height: var(--ds-line-height-sm);
  padding: var(--dsc-tooltip-padding);
  overflow: visible;
  margin: 0; /* Needed to place tooltip correctly, since popover adds margin */
  transition-property: opacity, visibility;
  transition-delay: var(--dsc-tooltip-transition-delay);
  transition-duration: var(--dsc-tooltip-transition-duration);
  transition-timing-function: ease-in-out;
  opacity: 0;
  visibility: hidden;

  &:popover-open {
    opacity: 1;
    visibility: visible;
  }
  /*for polyfill*/
  .:popover-open {
    opacity: 1;
    visibility: visible;
  }

  &::before {
    content: '';
    background: var(--dsc-tooltip-background);
    box-sizing: border-box;
    height: var(--dsc-tooltip-arrow-size);
    width: var(--dsc-tooltip-arrow-size);
    position: absolute;
    left: var(--dsc-tooltip-arrow-x, 50%);
    top: var(--dsc-tooltip-arrow-y, 100%);
    translate: -50% -50%;
    rotate: 45deg;
  }

  /* Transparent box to make tooltip stay open when mouse is over it */
  &::after {
    content: '';
    background: transparent;
    box-sizing: border-box;
    height: var(--_dsc-tooltip-safearea-height, 0px);
    width: var(--_dsc-tooltip-safearea-width, 0px);
    translate: var(--_dsc-tooltip-safearea-translate);
    position: absolute;
    left: var(--dsc-tooltip-arrow-x, 50%);
    top: var(--dsc-tooltip-arrow-y, 100%);
  }

  @media (forced-colors: active) {
    background: CanvasText;
  }}
}`;

export class DSTooltip extends HTMLElement {
  private cleanupAutoUpdate?: () => void;
  private handleMouseEnterTooltip?: (event: MouseEvent) => void;
  private handleMouseLeaveTooltip?: (event: MouseEvent) => void;
  private handleMouseEnterAnchor?: (event: MouseEvent) => void;
  private handleMouseLeaveAnchor?: (event: MouseEvent) => void;
  private handleBeforeToggle?: (event: Event) => void;
  private handleToggle?: () => void;
  private handleKeydown?: (event: KeyboardEvent) => void;
  private handleFocusAnchor?: (event: FocusEvent) => void;
  private handleBlurAnchor?: (event: FocusEvent) => void;

  constructor() {
    super();
    if (!this.shadowRoot) {
      const dom = document.createElement('span');
      dom.role = 'tooltip';
      dom.className = 'ds-tooltip';
      dom.popover = 'manual';
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.appendChild(dom);
      shadow.appendChild(document.createElement('slot'));
      const style = document.createElement('style');
      style.textContent = _tooltipStyle;
      shadow.appendChild(style);
    }
  }

  get content() {
    return this.getAttribute('content') || '';
  }

  get placement() {
    return (this.getAttribute('placement') as Placement) || 'top';
  }

  get autoPlacement(): boolean {
    return this.hasAttribute('auto-placement')
      ? this.getAttribute('auto-placement') !== 'false'
      : true;
  }

  get anchor() {
    return this.querySelector(`#${this.getAttribute('anchor') || ''}`) || null;
  }

  get tooltip() {
    return this.shadowRoot?.querySelector('[popover]') || null;
  }

  static observedAttributes = ['content', 'placement', 'auto-placement'];

  private updatePosition() {
    const trigger = this.anchor;
    const tooltip = this.tooltip as HTMLElement;

    if (!trigger || !tooltip) return;

    return computePosition(trigger, tooltip, {
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
        shift(),
        arrowPseudoElement,
        safeAreaElement,
      ],
    }).then(({ x, y }) => {
      tooltip.style.translate = `${x}px ${y}px`;
    });
  }

  private startAutoUpdate() {
    this.stopAutoUpdate();

    const trigger = this.anchor;
    const tooltip = this.tooltip as HTMLElement;

    if (!trigger || !tooltip) return;

    this.cleanupAutoUpdate = autoUpdate(trigger, tooltip, () =>
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
    if (!(this.tooltip && this.anchor)) {
      throw new Error('Tooltip and anchor elements must be present');
    }

    const tooltip = this.tooltip as HTMLElement;
    const anchor = this.anchor as HTMLElement;

    if (!tooltip.id) {
      tooltip.id = `tooltip-${Math.random().toString(36).slice(2)}`;
    }
    tooltip.textContent = this.content;

    anchor.setAttribute('popovertarget', tooltip.id);

    this.handleMouseLeaveTooltip = () => {
      if (
        this.anchor &&
        !this.anchor.matches(':hover') &&
        !anchor.matches(':focus-visible')
      ) {
        tooltip.togglePopover?.();
      }
    };

    this.handleMouseLeaveAnchor = () => {
      if (
        tooltip &&
        !tooltip.matches(':hover') &&
        !anchor.matches(':focus-visible')
      ) {
        tooltip.togglePopover?.();
      }
    };

    this.handleMouseEnterTooltip = () => {
      if (!tooltip.matches(':popover-open')) {
        tooltip.togglePopover?.();
      }
    };

    this.handleMouseEnterAnchor = () => {
      if (!tooltip.matches(':popover-open')) {
        tooltip.togglePopover?.();
      }
    };

    this.handleBeforeToggle = (event: Event) => {
      const toggleEvent = event as ToggleEvent;
      if (toggleEvent.newState === 'open') {
        void this.updatePosition();
      }
    };

    this.handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !tooltip.matches(':popover-open')) return;
      event.preventDefault();
      tooltip.togglePopover?.();
    };

    this.handleFocusAnchor = (_event: FocusEvent) => {
      if (!tooltip.matches(':popover-open')) {
        tooltip.togglePopover?.();
      }
    };

    this.handleBlurAnchor = (_event: FocusEvent) => {
      if (tooltip?.matches(':popover-open')) {
        tooltip.togglePopover?.();
      }
    };

    this.handleToggle = () => {
      if (tooltip.matches(':popover-open')) {
        this.startAutoUpdate();
      } else {
        this.stopAutoUpdate();
      }
    };

    addEventListener('keydown', this.handleKeydown);
    anchor.addEventListener('mouseenter', this.handleMouseEnterAnchor);
    anchor.addEventListener('mouseleave', this.handleMouseLeaveAnchor);
    anchor.addEventListener('focus', this.handleFocusAnchor);
    anchor.addEventListener('blur', this.handleBlurAnchor);
    tooltip.addEventListener('mouseenter', this.handleMouseEnterTooltip);
    tooltip.addEventListener('mouseleave', this.handleMouseLeaveTooltip);
    tooltip.addEventListener('beforetoggle', this.handleBeforeToggle);
    tooltip.addEventListener('toggle', this.handleToggle);
  }

  disconnectedCallback() {
    this.stopAutoUpdate();

    if (this.tooltip) {
      if (this.handleBeforeToggle) {
        this.tooltip.removeEventListener(
          'beforetoggle',
          this.handleBeforeToggle,
        );
      }
      if (this.handleToggle) {
        this.tooltip.removeEventListener('toggle', this.handleToggle);
      }
      if (this.handleKeydown) {
        removeEventListener('keydown', this.handleKeydown);
      }
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    if (
      (name === 'placement' || name === 'auto-placement') &&
      this.tooltip?.matches(':popover-open')
    ) {
      this.updatePosition();
    }

    if (name === 'anchor') {
      const tooltip = this.tooltip;
      if (tooltip && this.anchor) {
        this.anchor.setAttribute('popovertarget', tooltip.id);
        if (tooltip.matches(':popover-open')) {
          this.startAutoUpdate();
        }
      }
    }
  }
}
customElements.define('ds-tooltip', DSTooltip);
