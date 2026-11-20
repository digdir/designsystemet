// Expose pagination logic if wanting to do custom rendering (i.e. in React/Vue/etc)

export type PaginationOptions = {
  /** The current page number @default 1 */
  current?: number;
  /** The total number of pages @default 10 */
  total?: number;
  /** The maximum number of steps to show @default 7 */
  show?: number;
};

export type PaginationResult = {
  /** Previous page. `inert` is `true` when on the first page */
  prev: PaginationStep;
  /** Next page. `inert` is `true` when on the last page */
  next: PaginationStep;
  /** Steps to render. `inert` is `true` when ellipsis */
  pages: PaginationStep[];
};

/** A single pagination step */
export type PaginationStep = {
  /** Set to `page` when this is the current page */
  'aria-current'?: 'page';
  /** Whether the step is inert (and thus paint an ellipsis in CSS) */
  inert?: true;
  /** Page number */
  value: number;
};

export const pagination = ({
  current: now = 1,
  total = 10,
  show = 7,
}: PaginationOptions = {}): PaginationResult => {
  const mid = (show - 1) / 2;
  const start = Math.max(Math.min(now - Math.floor(mid), total - show + 1), 1);
  const end = Math.min(Math.max(now + Math.ceil(mid), show), total);
  const pages = Array.from({ length: end + 1 - start }, (_, i) => i + start);

  if (show > 4 && start > 1) pages.splice(0, 2, 1, 0);
  if (show > 3 && end < total) pages.splice(-2, 2, 0, total);

  return {
    prev: { inert: now <= 1 || undefined, value: Math.max(now - 1, 1) },
    next: { inert: now >= total || undefined, value: Math.min(now + 1, total) },
    pages: pages.map((value) => ({
      ...(value === now ? { 'aria-current': 'page' as const } : {}),
      inert: !value || undefined,
      value,
    })),
  };
};
