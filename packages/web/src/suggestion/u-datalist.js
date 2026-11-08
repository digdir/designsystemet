// ../utils.ts
var isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.navigator !== "undefined";
var IS_BROWSER = isBrowser();
var AGENT = IS_BROWSER ? navigator.userAgent : "";
var IS_SAMSUNGINTERNET = /samsungbrowser/i.test(AGENT);
var IS_ANDROID = /android/i.test(AGENT);
var IS_FIREFOX = /firefox/i.test(AGENT);
var IS_IOS = /iPad|iPhone|iPod/.test(AGENT) || /Macintosh/.test(AGENT) && IS_BROWSER && navigator.maxTouchPoints > 1;
var _a;
var IS_MAC = IS_BROWSER && // @ts-expect-error Typescript has not implemented userAgentData yet https://stackoverflow.com/a/71392474
/^Mac/i.test(((_a = navigator.userAgentData) == null ? void 0 : _a.platform) || navigator.platform);
var SUPPORTS_CONSTRUCTED_CSS = IS_BROWSER && window.CSSStyleSheet && document.adoptedStyleSheets;
var EVENT_ONCE = { once: true, capture: true, passive: true };
var DISPLAY_BLOCK = ":host(:not([hidden])) { display: block }";
var FOCUS_OUTLINE = `outline: 1px dotted; outline: 5px auto Highlight; outline: 5px auto -webkit-focus-ring-color`;
var SAFE_MULTISELECTABLE = `${IS_ANDROID ? "data" : "aria"}-multiselectable`;
var UHTMLElement = typeof HTMLElement === "undefined" ? class {
} : HTMLElement;
var attr = (el, name, value) => {
  if (value === void 0) return el.getAttribute(name);
  if (value === null) el.removeAttribute(name);
  else if (el.getAttribute(name) !== value) el.setAttribute(name, value);
  return null;
};
var on = (el, ...rest) => {
  const [types, ...options] = rest;
  for (const type of types.split(" ")) el.addEventListener(type, ...options);
  return () => off(el, ...rest);
};
var off = (el, ...rest) => {
  const [types, ...options] = rest;
  for (const type of types.split(" ")) el.removeEventListener(type, ...options);
};
var attachStyle = (el, css) => {
  const root = el.shadowRoot || el.attachShadow({ mode: "open" });
  if (!root.querySelector("slot")) root.appendChild(tag("slot"));
  if (!root.querySelector("style")) {
    if (!SUPPORTS_CONSTRUCTED_CSS) root.appendChild(tag("style", null, css));
    else {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      root.adoptedStyleSheets = [sheet];
    }
  }
  return root;
};
var onMutation = (el, callback, options) => {
  const observer = new MutationObserver((records) => {
    if (!isBrowser() || !el.isConnected) return cleanup();
    callback(el, records);
  });
  const cleanup = Object.assign(() => observer.disconnect(), {
    takeRecords: () => observer.takeRecords()
    // Expose takeRecords - useful if mutating a attribute that is observed
  });
  callback(el);
  observer.observe(el, options);
  return cleanup;
};
var getRoot = (node) => {
  var _a2;
  const root = ((_a2 = node.getRootNode) == null ? void 0 : _a2.call(node)) || node.ownerDocument;
  return root instanceof Document || root instanceof ShadowRoot ? root : document;
};
var getFocused = (node) => getRoot(node).activeElement;
var getInputLabel = (el, label = attr(el, "aria-label"), by = attr(el, "aria-labelledby")) => [
  join(by == null ? void 0 : by.split(" ").map((id) => text(getById(el, id)))),
  label == null ? void 0 : label.trim(),
  join(Array.from(el.labels || [], text))
].find(Boolean) || "";
var text = (el) => {
  var _a2;
  return ((_a2 = el == null ? void 0 : el.innerText) == null ? void 0 : _a2.trim()) || "";
};
var join = (texts) => texts == null ? void 0 : texts.filter(Boolean).join(" ");
var getById = (el, id) => getRoot(el).getElementById(id.trim() || "-");
var useId = (el) => {
  if (!el || !IS_BROWSER) return null;
  if (!window.uElementsId) window.uElementsId = {};
  if (!el.id) {
    const node = el.nodeName.toLowerCase();
    if (!window.uElementsId[node]) window.uElementsId[node] = 1;
    el.id = `:${node}${window.uElementsId[node]++}`;
  }
  return el.id;
};
var hasOwn = IS_BROWSER ? Object.prototype.hasOwnProperty : () => false;
var tag = (tagName, attrs, content) => {
  const el = document.createElement(tagName);
  if (content) el.textContent = content;
  if (attrs) {
    for (const key in attrs)
      if (hasOwn.call(attrs, key)) attr(el, key, attrs[key]);
  }
  return el;
};
var customElements = {
  define: (name, instance) => !isBrowser() || window.customElements.get(name) || window.customElements.define(name, instance)
};
var dispatchChange = (input) => input.dispatchEvent(new Event("change", { bubbles: true }));
var setValue = (input, value, inputType, change) => {
  var _a2, _b;
  let last = input.value;
  const data = null;
  const event = { bubbles: true, composed: true, data, inputType };
  const proto = HTMLInputElement.prototype;
  const onChange = () => last = input.value;
  window._uSetValue = true;
  try {
    (_b = (_a2 = Object.getOwnPropertyDescriptor(proto, "value")) == null ? void 0 : _a2.set) == null ? void 0 : _b.call(input, value);
  } finally {
    window._uSetValue = false;
  }
  {
    on(input, "change", onChange, true);
    input.dispatchEvent(new InputEvent("input", event));
    off(input, "change", onChange, true);
  }
  if (input.value !== last) dispatchChange(input);
};
var onFocusLeave = (el, fn, isInside = (node) => el.contains(node)) => {
  let hasBlurred;
  let pending;
  let unPress;
  const check = () => {
    clearTimeout(pending);
    pending = setTimeout(() => {
      pending = void 0;
      if (isInside(getFocused(el))) return;
      if (IS_SAMSUNGINTERNET && document.activeElement === document.body)
        return;
      fn();
    }, 0);
  };
  const cancel = () => {
    if (hasBlurred) check();
    unPress == null ? void 0 : unPress();
    unPress = hasBlurred = void 0;
  };
  const handle = (e) => {
    if (!isInside(e.target)) return;
    if (e.type === "focusout") {
      if (!unPress) check();
      else hasBlurred = true;
    } else if (!unPress)
      unPress = on(document, "pointerup pointercancel", cancel, EVENT_ONCE);
  };
  const unHandle = on(el, "pointerdown focusout", handle, true);
  return () => {
    unHandle();
    unPress == null ? void 0 : unPress();
    clearTimeout(pending);
  };
};
var declarativeShadowRoot = (style, slot = "<slot></slot>") => `<template shadowrootmode="open">${slot}<style>${style}</style></template>`;
var getText = (el) => {
  var _a2;
  return ((_a2 = el == null ? void 0 : el.textContent) == null ? void 0 : _a2.trim()) || "";
};
var srText = (el, key, fallback) => {
  const value = getComputedStyle(el).getPropertyValue(`--sr-${key}`).trim();
  const quote = value[0];
  const quoted = (quote === '"' || quote === "'") && value.endsWith(quote);
  const text2 = quoted ? value.slice(1, -1).replace(/\\(.)/g, "$1") : value;
  return text2 || fallback;
};
var LIVE;
var LIVE_SR_FIX = 0;
var LIVE_CLEAR = 0;
var ariaNotify = (text2) => {
  if (!LIVE) {
    LIVE = tag("div", { "aria-live": "assertive" });
    LIVE.style.overflow = "hidden";
    LIVE.style.position = "fixed";
    LIVE.style.whiteSpace = "nowrap";
    LIVE.style.width = "1px";
  }
  if (!LIVE.isConnected) document.body.appendChild(LIVE);
  if (text2 === void 0) return;
  clearTimeout(LIVE_CLEAR);
  if (text2 === "") LIVE.textContent = "";
  if (text2) {
    LIVE.textContent = `${text2}${LIVE_SR_FIX++ % 2 ? "\xA0" : ""}`;
    LIVE_CLEAR = setTimeout(ariaNotify, !IS_MAC && IS_FIREFOX ? 2e3 : 300, "");
  }
};
var RENDER_QUEUE = [];
var RENDER_PORT;
var afterRender = (callback) => {
  if (typeof MessageChannel === "undefined") {
    Promise.resolve().then(() => setTimeout(callback));
    return;
  }
  if (!RENDER_PORT) {
    const { port1, port2 } = new MessageChannel();
    port1.onmessage = () => {
      const callback2 = RENDER_QUEUE.shift();
      if (!RENDER_QUEUE.length) {
        port1.close();
        port2.close();
        RENDER_PORT = void 0;
      }
      callback2 == null ? void 0 : callback2();
    };
    RENDER_PORT = port2;
  }
  RENDER_QUEUE.push(callback);
  Promise.resolve().then(() => RENDER_PORT == null ? void 0 : RENDER_PORT.postMessage(0));
};

// u-option.ts
var DISABLED = "disabled";
var SELECTED = "selected";
var UHTMLOptionElement = class extends UHTMLElement {
  constructor() {
    super(...arguments);
    this._skipAttrChange = false;
  }
  // Using ES2015 syntax for backwards compatibility
  static get observedAttributes() {
    return ["id", DISABLED, SELECTED];
  }
  connectedCallback() {
    if (IS_ANDROID) this.tabIndex = -1;
    if (!this.hasAttribute("role")) attr(this, "role", "option");
    attr(this, "aria-disabled", `${this.disabled}`);
    attr(this, "aria-selected", `${this.selected}`);
    useId(this);
  }
  attributeChangedCallback(name) {
    if (this._skipAttrChange) return;
    this._skipAttrChange = true;
    if (name === "id") useId(this);
    else attr(this, `aria-${name}`, `${this[name]}`);
    this._skipAttrChange = false;
  }
  /** Sets or retrieves whether the option in the list box is the default item. */
  get defaultSelected() {
    return this[SELECTED];
  }
  set defaultSelected(value) {
    this[SELECTED] = value;
  }
  get disabled() {
    return attr(this, DISABLED) !== null;
  }
  set disabled(value) {
    attr(this, DISABLED, value ? "" : null);
  }
  /** Retrieves a reference to the form that the object is embedded in. */
  get form() {
    return this.closest("form");
  }
  /** Sets or retrieves the ordinal position of an option in a list box. */
  get index() {
    var _a2;
    return [
      ...((_a2 = this.parentElement) == null ? void 0 : _a2.options) || [this]
    ].indexOf(this);
  }
  /** Sets or retrieves a value that you can use to implement your own label functionality for the object. */
  get label() {
    var _a2;
    return (_a2 = attr(this, "label")) != null ? _a2 : this.text;
  }
  set label(value) {
    attr(this, "label", value);
  }
  get selected() {
    return attr(this, SELECTED) !== null;
  }
  set selected(value) {
    attr(this, SELECTED, value ? "" : null);
  }
  /** Sets or retrieves the text string specified by the option tag. */
  get text() {
    return getText(this);
  }
  set text(text2) {
    this.textContent = text2;
  }
  /** Sets or retrieves the value which is returned to the server when the form control is submitted. */
  get value() {
    var _a2;
    return (_a2 = attr(this, "value")) != null ? _a2 : this.text;
  }
  set value(value) {
    attr(this, "value", value);
  }
};
customElements.define("u-option", UHTMLOptionElement);

// u-datalist.ts
var CSS_SPECIAL = /["\\\n\r\f]/g;
var DATA_ACTIVE = "data-activedescendant";
var ARIA_EXPANDED = "aria-expanded";
var ARIA_INSET = "aria-posinset";
var DATA_INSET = "data-posinset";
var ARIA_SIZE = "aria-setsize";
var DATA_SIZE = "data-setsize";
var ARIA_HIDDEN = "aria-hidden";
var UHTMLDataListStyle = `${DISPLAY_BLOCK}
::slotted([role="option"]) { display:block;cursor:pointer }
::slotted([role="option"][${DATA_ACTIVE}]) { ${FOCUS_OUTLINE} }
::slotted([role="option"][${ARIA_HIDDEN}="true"]),
::slotted([role="option"][disabled]),
::slotted([role="option"][hidden]) { display: none }
::slotted([role="option"][${DATA_INSET}])::after { content: ""/", "attr(${DATA_INSET})" "var(--sr-of, "of")" "attr(${DATA_SIZE}) }
::slotted([role="option"][${DATA_INSET}][aria-setsize="-1"])::after { content: ""/", "attr(${DATA_INSET})" }`;
var UHTMLDataListShadowRoot = declarativeShadowRoot(UHTMLDataListStyle);
var LIVE_TIMER;
var EVENTS_IDLE_CAPTURE = "focus click keydown mousedown";
var EVENTS_ACTIVE_BUBBLE = "input";
var UHTMLDataListElement = class extends UHTMLElement {
  static get observedAttributes() {
    return ["hidden", "id"];
  }
  constructor() {
    super();
    attachStyle(this, UHTMLDataListStyle);
  }
  connectedCallback() {
    this._root = getRoot(this);
    attr(this, "hidden", "");
    attr(this, "role", "listbox");
    attr(this, "tabindex", "-1");
    on(this._root, EVENTS_IDLE_CAPTURE, this, true);
    this._unfocus = onFocusLeave(
      this._root,
      () => onBlurred(this),
      (node) => this._control === node || this.contains(node)
    );
    this._umutate = onMutation(this, onMutations, {
      attributeFilter: [
        "disabled",
        "hidden",
        "label",
        "value",
        ARIA_INSET,
        ARIA_SIZE
      ],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
    syncInputs(this);
  }
  disconnectedCallback() {
    var _a2, _b;
    if (this._root) off(this._root, EVENTS_IDLE_CAPTURE, this, true);
    if (this._root) off(this._root, EVENTS_ACTIVE_BUBBLE, this);
    for (const el of getInputs(this, this.id)) setInputAttr(this, el, false);
    setInputAttr(this, this._control, false);
    (_a2 = this._unfocus) == null ? void 0 : _a2.call(this);
    (_b = this._umutate) == null ? void 0 : _b.call(this);
    this._umutate = this._unfocus = this._root = this._control = void 0;
  }
  attributeChangedCallback(prop, prev, next) {
    if (prop === "hidden") {
      const open = next === null;
      if (this._control) attr(this._control, ARIA_EXPANDED, `${open}`);
      if (!open) setActive(this);
      if (!open) this._announced = void 0;
      if (this.popover && this.isConnected) this.togglePopover(open);
    } else if (this.isConnected) {
      for (const el of getInputs(this, prev)) setInputAttr(this, el, false);
      syncInputs(this);
      afterRender(() => syncInputs(this));
    }
  }
  handleEvent(event) {
    if (event.defaultPrevented) return;
    if (event.type === "focus") onFocus(this, event);
    if (event.type === "click") onClick(this, event);
    if (event.type === "input") onMutations(this);
    if (event.type === "keydown") onKeyDown(this, event);
    if (event.type === "mousedown") onMousedown(this, event);
  }
  get options() {
    const el = !this._options && this.querySelector('[role="option"],option');
    if (el) this._options = this.getElementsByTagName(el == null ? void 0 : el.nodeName);
    return this._options || this.getElementsByTagName("option");
  }
};
var isInput = (el) => el instanceof HTMLInputElement;
var isVisible = (el) => attr(el, ARIA_HIDDEN) !== "true" && el.clientHeight;
var setExpanded = (self, open) => {
  if (self._control) attr(self._control, ARIA_EXPANDED, `${open}`);
  if (!self.isConnected || self.hidden !== open) return;
  if (open) setTimeout(() => clearTimeout(LIVE_TIMER));
  self.hidden = !open;
};
var setActive = (self, opt) => {
  var _a2;
  if (self._control) attr(self._control, "aria-activedescendant", useId(opt));
  for (const o of self.options) attr(o, DATA_ACTIVE, o === opt ? "" : null);
  (_a2 = opt == null ? void 0 : opt.scrollIntoView) == null ? void 0 : _a2.call(opt, { block: "nearest" });
};
var getInputs = (self, id) => {
  if (!self._root || !id) return [];
  const selector = `input[list="${id.replace(CSS_SPECIAL, (c) => `\\${c.charCodeAt(0).toString(16)} `)}"]`;
  return self._root.querySelectorAll(selector);
};
var syncInputs = (self) => {
  const { _control, id } = self;
  if (_control && attr(_control, "list") !== id) {
    setExpanded(self, false);
    setInputAttr(self, _control, false);
    self._control = void 0;
  }
  for (const input of getInputs(self, id)) setInputAttr(self, input);
};
var setInputAttr = (self, input, setup = true) => {
  const hidden = !self._root || self.hidden;
  const set = (value) => setup ? value : null;
  if (!input) return;
  if (self.popover) {
    attr(self, "popover", "manual");
    attr(input, "popovertarget", set(useId(self)));
  }
  attr(input, "aria-autocomplete", set("list"));
  attr(input, "aria-controls", set(useId(self)));
  attr(input, ARIA_EXPANDED, set(`${!hidden}`));
  attr(input, "autocomplete", set("off"));
  attr(input, "enterkeyhint", set("done"));
  attr(input, "role", set("combobox"));
};
var onFocus = (self, { target: el }) => {
  const { _control: prev, _root, id } = self;
  if (prev === el) return;
  if (isInput(el) && el.getAttribute("list") === id) {
    if (prev && attr(prev, "list") !== id) setInputAttr(self, prev, false);
    else if (prev) attr(prev, ARIA_EXPANDED, "false");
    setInputAttr(self, el);
    if (el.readOnly || el.matches(":disabled")) return;
    if (_root) on(_root, EVENTS_ACTIVE_BUBBLE, self);
    attr(self, "aria-label", getInputLabel(el) || null);
    ariaNotify();
    self._control = el;
    if (IS_ANDROID) setExpanded(self, true);
  } else onBlurred(self);
};
var onBlurred = (self) => {
  const focus = getFocused(self);
  if (self._control === focus || self.contains(focus)) return;
  if (self._root) off(self._root, EVENTS_ACTIVE_BUBBLE, self);
  setExpanded(self, false);
  self._control = void 0;
};
var onMousedown = (self, event) => {
  if (self.contains(event.target)) event.preventDefault();
};
var onClick = (self, event) => {
  var _a2, _b;
  const el = event.target;
  if (isInput(el)) onFocus(self, event);
  if (self._control === el) return setExpanded(self, true);
  if (!self.contains(el) || !((_a2 = self._control) == null ? void 0 : _a2.isConnected)) return onBlurred(self);
  for (const opt of self.options)
    if (opt.contains(el)) {
      (_b = self._control) == null ? void 0 : _b.focus();
      if (self._control) {
        const inputType = "insertReplacementText";
        setValue(self._control, opt.value, inputType);
      }
      return setExpanded(self, attr(self, SAFE_MULTISELECTABLE) === "true");
    }
};
var onKeyDown = (self, event) => {
  if (isInput(event.target)) onFocus(self, event);
  if (self._control !== event.target) return;
  const { key, ctrlKey, metaKey, altKey, repeat } = event;
  const isComposing = event.isComposing || event.keyCode === 229;
  const skip = ctrlKey || metaKey || key === "Shift" || key === "Tab";
  if (skip || altKey && !key.startsWith("Arrow")) return;
  if (key === "Escape" && !self.hidden && !isComposing) event.preventDefault();
  const isEnter = key === "Enter";
  if (!repeat && !(isComposing && key === "Escape"))
    setExpanded(self, key !== "Escape");
  if (isComposing) return;
  const active = attr(self._control, "aria-activedescendant");
  const opts = [];
  let prev = -1;
  let next = -1;
  for (const opt of self.options)
    if (isVisible(opt)) {
      opts.push(opt);
      if (opt.id === active) prev = opts.length - 1;
    }
  if (!altKey && key === "ArrowDown") next = (prev + 1) % opts.length;
  if (!altKey && key === "ArrowUp") next = (prev > 0 ? prev : opts.length) - 1;
  if (~prev) {
    if (key === "Home" || key === "PageUp") next = 0;
    if (key === "End" || key === "PageDown") next = opts.length - 1;
    if (isEnter) next = prev;
  }
  if (opts[next]) {
    event.preventDefault();
    self._control.focus();
  }
  if (isEnter && opts[next]) {
    event.stopImmediatePropagation();
    event.preventDefault();
    if (!repeat) opts[next].click();
  } else setActive(self, opts[next]);
};
var onMutations = (self) => {
  var _a2;
  if (!self._control || self.hidden) return;
  const query = self._control.value.toLowerCase().trim() || "";
  const filter = !self.hasAttribute("data-nofilter");
  const hide = [];
  const show = [];
  for (const opt of self.options) (opt.disabled || opt.hidden || filter && !opt.label.toLowerCase().includes(query) ? hide : show).push(opt);
  for (const opt of hide) attr(opt, ARIA_HIDDEN, "true");
  for (const opt of show) attr(opt, ARIA_HIDDEN, "false");
  clearTimeout(LIVE_TIMER);
  LIVE_TIMER = setTimeout(announce, 500, self, show);
  if (IS_IOS) {
    const count = `${getCount(show)}`;
    for (const [index, opt] of show.entries()) {
      attr(opt, DATA_INSET, attr(opt, ARIA_INSET) || `${index + 1}`);
      attr(opt, DATA_SIZE, count);
    }
  }
  (_a2 = self._umutate) == null ? void 0 : _a2.takeRecords();
};
var getCount = (opts) => {
  const sized = opts.find((opt) => opt.hasAttribute(ARIA_SIZE));
  const total = Number(sized == null ? void 0 : sized.getAttribute(ARIA_SIZE)) || opts.length;
  return Number.isFinite(total) && total > 0 ? total : opts.length;
};
var announce = (self, hits) => {
  var _a2, _b;
  if (self.hidden || self._control !== getFocused(self)) return;
  const count = getCount(hits);
  const hint = `${hits.some(({ value }) => value) ? srText(self, count === 1 ? "singular" : "plural", count === 1 ? "%d hit" : "%d hits").replace("%d", `${count}`) : (_a2 = self.innerText) != null ? _a2 : self.textContent}`;
  const announced = JSON.stringify([(_b = self._control) == null ? void 0 : _b.value, count, hint]);
  if (self._announced === announced) return;
  self._announced = announced;
  ariaNotify(hint);
};
if (isBrowser())
  Object.defineProperty(HTMLInputElement.prototype, "list", {
    configurable: true,
    enumerable: true,
    get() {
      const id = attr(this, "list");
      return id && getRoot(this).getElementById(id);
    }
  });
customElements.define("u-datalist", UHTMLDataListElement);

export { UHTMLDataListElement, UHTMLDataListShadowRoot, UHTMLDataListStyle };
