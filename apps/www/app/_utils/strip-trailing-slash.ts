/**
 * React Router v8 prerenders HTML by requesting each route WITH a trailing slash
 * (see `createRouteRequest` in @react-router/dev). For splat (`*`) routes that
 * trailing slash ends up in the param (e.g. `code/` instead of `code`), which
 * breaks content lookups like `${slug}.mdx`. Strip it so prerendered and runtime
 * requests resolve the same file.
 */
export const stripTrailingSlash = (value?: string): string | undefined =>
  value?.replace(/\/+$/, '');
