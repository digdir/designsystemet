// Import log lines are plain strings collected in one array. Lines about something that was
// skipped or could not be applied are prefixed so the UI can surface them as warnings after an
// otherwise successful import, instead of burying them among the informational lines.

const WARNING_PREFIX = 'Warning: ';

export function warn(logs: string[], message: string): void {
  logs.push(`${WARNING_PREFIX}${message}`);
}

export function getWarnings(logs: string[]): string[] {
  return logs
    .filter((line) => line.startsWith(WARNING_PREFIX))
    .map((line) => line.slice(WARNING_PREFIX.length));
}
