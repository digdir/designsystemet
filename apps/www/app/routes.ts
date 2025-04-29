import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  route('/slack', 'routes/slack.tsx', {
    id: 'slack-redirect',
  }),
  layout('./layouts/root/layout.tsx', [
    ...prefix('/:lang', [
      index('routes/home/home.tsx', {
        id: 'home',
      }),
      ...prefix('/patterns', [
        layout('./layouts/patterns/layout.tsx', [
          route('', 'routes/patterns/patterns.tsx', {
            id: 'patterns-index',
          }),
          route('/:file', 'routes/patterns/page.tsx', {
            id: 'patterns-page',
          }),
        ]),
      ]),
      ...prefix('/blog', [
        layout('./layouts/blog/layout.tsx', [
          route('/', 'routes/blog/blog.tsx'),
        ]),
        layout('./layouts/blog/page.tsx', [
          route('/:file', 'routes/blog/page.tsx'),
        ]),
      ]),
      ...prefix('/fundamentals', [
        layout('./layouts/fundamentals/layout.tsx', [
          route('/', 'routes/fundamentals/fundamentals.tsx', {
            id: 'fundamentals-index',
          }),
          route('/*', 'routes/fundamentals/page.tsx', {
            id: 'fundamentals-page',
          }),
        ]),
      ]),
      ...prefix('/best-practices', [
        layout('./layouts/best-practices/layout.tsx', [
          route('/', 'routes/best-practices/best-practices.tsx', {
            id: 'best-practices-index',
          }),
          route('/*', 'routes/best-practices/page.tsx', {
            id: 'best-practices-page',
          }),
        ]),
      ]),
      route('/components', 'routes/components/components.tsx', {
        id: 'components',
      }),
    ]),
  ]),
] satisfies RouteConfig;
