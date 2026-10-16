// Figma runs plugin code on its main thread, so a long loop blocks Figma until it ends.
// Long loops call the pause function: once `budgetMs` of work has passed it waits briefly,
// so Figma can redraw and the UI can show progress, and then the loop carries on.

/** Pauses if the import has been working for a while. `detail` gives the progress label to show. */
export type Pause = (detail?: () => string) => Promise<void>;

export function createPause(
  onDetail: (detail: string) => void = () => {},
  budgetMs = 100,
): Pause {
  let started = Date.now();
  return async (detail) => {
    if (Date.now() - started < budgetMs) {
      return;
    }
    if (detail) {
      onDetail(detail());
    }
    // About one frame, so Figma gets to render before the next batch.
    await new Promise((resolve) => setTimeout(resolve, 16));
    started = Date.now();
  };
}
