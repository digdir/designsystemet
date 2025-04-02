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
      index('routes/home.tsx'),
      layout('./layouts/monstre/layout.tsx', [
        route('/monstre', 'routes/monstre.tsx'),
      ]),
      layout('./layouts/monstre/page.tsx', [
        route('/monstre/:file', 'routes/monstre-page.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
