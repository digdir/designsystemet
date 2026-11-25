// Stamps mark the pages and components of the UI kit's source file with what migrations call them, e.g. the page
// `Dialog` and the component `_Header`. They're shared plugin data, which is copied with a duplicated file and with
// copied components, so migrations find them even when people rename pages or components in their copy.
//
// Maintainers stamp the source file with `stampUiKit` before a release. Existing stamps are never changed, so a
// page or component keeps its stamp when it's renamed in the source file later.

const NAMESPACE = 'designsystemet';
const PAGE_KEY = 'page';
const COMPONENT_KEY = 'component';

/** What a page is stamped as, e.g. `Dialog`, or '' if it has no stamp. Works without loading the page. */
export function pageStamp(page: PageNode): string {
  return page.getSharedPluginData(NAMESPACE, PAGE_KEY);
}

/** What a component or component set is stamped as, e.g. `_Header`, or '' if it has no stamp. */
export function componentStamp(node: BaseNode): string {
  return node.getSharedPluginData(NAMESPACE, COMPONENT_KEY);
}

/** A component's name as migrations know it: its stamp, or else its own name. */
export function componentName(node: BaseNode): string {
  return componentStamp(node) || node.name.trim();
}

export type StampResult = {
  /** Pages and components stamped now. */
  pages: number;
  components: number;
  /** Pages and components that already had a stamp, and kept it. */
  kept: number;
};

/**
 * Stamps every page with components, and every component set and component that isn't a variant, with its name.
 * Pages are stamped with their name without the symbols in front, e.g. `Dialog` for `❖  Dialog`. Loads every page.
 */
export async function stampUiKit(): Promise<StampResult> {
  const result: StampResult = { pages: 0, components: 0, kept: 0 };
  for (const page of figma.root.children) {
    await page.loadAsync();
    const components = page
      .findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })
      .filter(
        (node) =>
          node.type === 'COMPONENT_SET' ||
          node.parent?.type !== 'COMPONENT_SET',
      );
    if (components.length === 0) continue;
    if (pageStamp(page)) {
      result.kept += 1;
    } else {
      page.setSharedPluginData(NAMESPACE, PAGE_KEY, pageTitle(page.name));
      result.pages += 1;
    }
    for (const node of components) {
      if (componentStamp(node)) {
        result.kept += 1;
      } else {
        node.setSharedPluginData(NAMESPACE, COMPONENT_KEY, node.name.trim());
        result.components += 1;
      }
    }
  }
  return result;
}

/** A page's name without the symbols it starts with, e.g. `Modal` for `❖  Modal`. */
export function pageTitle(name: string): string {
  return name.replace(/^[^\p{L}\p{N}]+/u, '').trim() || name.trim();
}
