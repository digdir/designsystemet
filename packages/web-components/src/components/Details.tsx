import cl from 'clsx/lite';

export type DetailsAttributes = {
  /**
   * Controls open-state.
   *
   * Using this removes automatic control of open-state
   *
   * @default undefined
   */
  open?: boolean | null;
  /**
   * Defaults the details to open if not controlled
   * @default false
   */
  defaultOpen?: boolean | null;
  /** Callback function when Details toggles due to click on summary or find in page-search */
  onToggle?: (event: Event) => any | null;
  /** Content should be one `<Details.Summary>` and `<Details.Content>` */
  // TODO
};
/**
 * Details component, contains `Details.Summary` and `Details.Content` components.
 * @example
 * <Details>
 *  <DetailsSummary>Header</DetailsSummary>
 *  <DetailsContent>Content</DetailsContent>
 * </Details>
 */
export class Details extends HTMLDetailsElement {
  static observedAttributes = ["open"];

  constructor() {
    super();
  }

  connectedCallback() {
    // this.detailsRef = this.host;
    const defaultOpen = Boolean(this.getAttribute("defaultOpen")); // Allow setting defaultOpen once and render once
    const onToggle = this.getAttribute("onToggle") as unknown as (event: Event) => any;
    const open = Boolean(this.getAttribute("open"));

    const options: DetailsAttributes = {
      defaultOpen,
      onToggle,
      open
    };

    const uDetail = <u-details
      class={cl('ds-details', ...this.classList)}
      open={(open ?? defaultOpen) || undefined} // Fallback to undefined to prevent rendering open="false"
    />

    this.appendChild(uDetail as unknown as Node);

    this.setup(options);
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    console.log(name, oldValue, newValue);
  }

  private setup(options: DetailsAttributes) {
    if (options.onToggle) {
      this.addEventListener('toggle', options.onToggle, true);
    }
  }
}
