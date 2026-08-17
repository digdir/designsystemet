import type { Route } from './+types/plugin-telemetry';

/**
 * Receiver for the AI plugin's opt-in telemetry aggregates.
 *
 * The plugin collects usage signals locally (which contracts agents look up
 * and whether they were found, which guard checks fire) and the user chooses
 * to send the aggregate here. The payload is a strict allowlist: any unknown
 * field rejects the whole request, so this endpoint can never be talked into
 * storing code, prompts or paths. No cookies, no auth, nothing identifying
 * beyond the plugin's random install id.
 *
 * Storage is deliberately out of scope: accepted aggregates are written to the
 * application log as one JSON line (prefix `plugin-telemetry:`), which the
 * platform's log pipeline already retains. Aggregation into a dashboard or
 * store is a follow-up decision.
 */

const MAX_BODY_BYTES = 32_768;

/*
 * Every field is bound to a concrete type and length; a validator returning
 * false for any field, or any key outside these maps, rejects the whole
 * request. Free-text-shaped fields get tight caps on purpose: this endpoint
 * must stay useless as a place to smuggle code, prompts or paths.
 */
type FieldValidators = Record<string, (value: unknown) => boolean>;

const boundedString = (max: number) => (value: unknown) =>
  typeof value === 'string' && value.length > 0 && value.length <= max;
const boundedCount = (value: unknown) =>
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value >= 0 &&
  value <= 1_000_000;
const bool = (value: unknown) => typeof value === 'boolean';

const TOP_LEVEL: FieldValidators = {
  installId: boundedString(64),
  pluginVersion: boundedString(32),
  period: boundedString(64),
  lookups: () => true, // shape-checked separately by allowedRows
  guardDenials: () => true,
};
const LOOKUP_FIELDS: FieldValidators = {
  tool: boundedString(64),
  query: boundedString(120),
  found: bool,
  count: boundedCount,
};
const DENIAL_FIELDS: FieldValidators = {
  check: boundedString(64),
  count: boundedCount,
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const allowedFields = (
  obj: Record<string, unknown>,
  fields: FieldValidators,
  required: string[],
): boolean =>
  Object.entries(obj).every(([key, value]) => fields[key]?.(value) === true) &&
  required.every((key) => key in obj);

const allowedRows = (
  rows: unknown,
  fields: FieldValidators,
  required: string[],
  max: number,
): boolean =>
  Array.isArray(rows) &&
  rows.length <= max &&
  rows.every(
    (row) => isPlainObject(row) && allowedFields(row, fields, required),
  );

function isValidAggregate(body: unknown): boolean {
  if (!isPlainObject(body)) return false;
  return (
    allowedFields(body, TOP_LEVEL, ['installId', 'pluginVersion']) &&
    allowedRows(body.lookups ?? [], LOOKUP_FIELDS, ['tool'], 500) &&
    allowedRows(body.guardDenials ?? [], DENIAL_FIELDS, ['check'], 100)
  );
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const declared = Number(request.headers.get('content-length'));
  if (declared > MAX_BODY_BYTES) {
    return new Response('Payload Too Large', { status: 413 });
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return new Response('Payload Too Large', { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response('Bad Request', { status: 400 });
  }
  if (!isValidAggregate(body)) {
    return new Response('Bad Request', { status: 400 });
  }

  console.log(`plugin-telemetry: ${JSON.stringify(body)}`);
  return new Response(null, { status: 204 });
}
