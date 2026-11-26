// A restore point: a named version in the file's version history, saved before the plugin changes the file.
// The user can restore it from File → Show version history, also after Undo is no longer possible.

/**
 * Saves the file as it is now to its version history, under the given name. Call it before changing anything:
 * Figma doesn't promise that changes made just before the call are in the version.
 *
 * Returns the name, or undefined when no version was saved. That isn't an error: what comes next can still run.
 */
export async function saveVersion(name: string): Promise<string | undefined> {
  try {
    const version = await figma.saveVersionHistoryAsync(
      name,
      'Saved by the Designsystemet plugin before it updated the file.',
    );
    return version ? name : undefined;
  } catch (error) {
    console.error(`Could not save the version "${name}":`, error);
    return undefined;
  }
}

/** A sentence for the user about the version that was saved. */
export const savedVersionText = (name: string): string =>
  `The file as it was before is saved in its version history, as "${name}".`;
