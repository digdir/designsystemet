import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
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
      ...prefix('/bloggen', [
        layout('./layouts/bloggen/layout.tsx', [
          route('/', 'routes/bloggen/bloggen.tsx'),
        ]),
        layout('./layouts/bloggen/page.tsx', [
          route('/:file', 'routes/bloggen/page.tsx'),
        ]),
      ]),
      ...prefix('/grunnleggende', [
        layout('./layouts/grunnleggende/layout.tsx', [
          route('/', 'routes/grunnleggende/grunnleggende.tsx', {
            id: 'grunnleggende-index',
          }),
          route('/*', 'routes/grunnleggende/page.tsx', {
            id: 'grunnleggende-page',
          }),
        ]),
      ]),
      route('/komponenter', 'routes/components/components.tsx', {
        id: 'components',
      }),
    ]),
  ]),
  route('/slack', 'routes/slack.tsx', {
    id: 'slack-redirect',
  }),
] satisfies RouteConfig;
