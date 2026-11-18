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
  /** Previous page. `value` is `0` when on the first page */
  prev: PaginationStep;
  /** Next page. `value` is `0` when on the last page */
  next: PaginationStep;
  /** Steps to render. A `value` of `0` marks an ellipsis */
  pages: PaginationStep[];
};

/** A single pagination step */
export type PaginationStep = {
  /** Set to `page` when this is the current page */
  'aria-current'?: 'page';
  /** Page number, or `0` when there is no page (ellipsis, or first/last page) */
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
    prev: { value: now > 1 ? now - 1 : 0 },
    next: { value: now < total ? now + 1 : 0 },
    pages: pages.map((value) => ({
      ...(value === now ? { 'aria-current': 'page' as const } : {}),
      value,
    })),
  };
};
