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
      ...prefix('/blog', [
        layout('./layouts/blog/layout.tsx', [
          route('/', 'routes/blog/blog.tsx'),
        ]),
        layout('./layouts/blog/page.tsx', [
          route('/:file', 'routes/blog/page.tsx'),
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
      ...prefix('/god-praksis', [
        layout('./layouts/god-praksis/layout.tsx', [
          route('/', 'routes/god-praksis/god-praksis.tsx', {
            id: 'god-praksis-index',
          }),
          route('/*', 'routes/god-praksis/page.tsx', {
            id: 'god-praksis-page',
          }),
        ]),
      ]),
      route('/components', 'routes/components/components.tsx', {
        id: 'components',
      }),
    ]),
  ]),
  route('/slack', 'routes/slack.tsx', {
    id: 'slack-redirect',
  }),
] satisfies RouteConfig;
