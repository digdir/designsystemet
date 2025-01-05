/**
 * Card component to present content in a structured way.
 * @example
 * <Card>
 *  <Card.Block>Header</Card.Block>
 *  <Card.Block>Content</Card.Block>
 *  <Card.Block>Footer</Card.Block>
 * </Card>
 */
export class Card extends HTMLElement {
  private _handleClick?: (event: MouseEvent) => void;

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('ds-card');
    this._handleClick = ({ ctrlKey, metaKey, target }: MouseEvent) => {
      const link = this.querySelector<HTMLAnchorElement>(
        ':is(h1,h2,h3,h4,h5,h6) a',
      );

      if (!link || link?.contains(target as Node)) return; // Let links handle their own clicks
      if (ctrlKey || metaKey) window.open(link.href, '', 'noreferrer');
      else link.click(); // Using link.click instead of window.location.href as this will trigger the browser's handling of rel=, target=, etc.
    };

    this.addEventListener('click', this._handleClick);
  }
}

customElements.define('ds-card', Card);

