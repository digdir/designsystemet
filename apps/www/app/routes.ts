import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from '@react-router/dev/routes';

export default [
  route('/slack', 'routes/slack.tsx', {
    id: 'slack-redirect',
  }),
  ...prefix('/schemas', [
    route('/cli/:version', 'routes/cli-schema.tsx', {
      id: 'schemas-cli',
    }),
  ]),
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
      layout('./layouts/components/layout.tsx', [
        route('/components', 'routes/components/components.tsx', {
          id: 'components',
        }),
        ...prefix('/components', [
          ...prefix('/docs/:component', [
            route('/*', 'routes/components/component.tsx', {
              id: 'components-page',
            }),
          ]),
          route('/changelog', 'routes/components/changelog.tsx', {
            id: 'changelog-page',
          }),
          route('/*', 'routes/components/text.tsx', {
            id: 'component-text-page',
          }),
        ]),
      ]),
      route('*', 'routes/not-found.tsx', {
        id: 'not-found-lang',
      }),
    ]),
    index('routes/not-found.tsx'),
    route('*', 'routes/not-found.tsx', {
      id: 'not-found',
    }),
  ]),
] satisfies RouteConfig;
