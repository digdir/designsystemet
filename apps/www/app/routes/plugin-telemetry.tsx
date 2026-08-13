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

const TOP_LEVEL = new Set([
  'installId',
  'pluginVersion',
  'period',
  'lookups',
  'guardDenials',
]);
const LOOKUP_FIELDS = new Set(['tool', 'query', 'found', 'count']);
const DENIAL_FIELDS = new Set(['check', 'count']);

const allowedRows = (
  rows: unknown,
  fields: Set<string>,
  max: number,
): boolean =>
  Array.isArray(rows) &&
  rows.length <= max &&
  rows.every(
    (row) =>
      row !== null &&
      typeof row === 'object' &&
      Object.keys(row).every((key) => fields.has(key)) &&
      Object.values(row).every(
        (value) =>
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean',
      ),
  );

function isValidAggregate(body: unknown): boolean {
  if (body === null || typeof body !== 'object' || Array.isArray(body))
    return false;
  const aggregate = body as Record<string, unknown>;
  return (
    Object.keys(aggregate).every((key) => TOP_LEVEL.has(key)) &&
    typeof aggregate.installId === 'string' &&
    aggregate.installId.length <= 64 &&
    typeof aggregate.pluginVersion === 'string' &&
    aggregate.pluginVersion.length <= 32 &&
    allowedRows(aggregate.lookups ?? [], LOOKUP_FIELDS, 500) &&
    allowedRows(aggregate.guardDenials ?? [], DENIAL_FIELDS, 100)
  );
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
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
