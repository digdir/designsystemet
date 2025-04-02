import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./layouts/root-layout/root-layout.tsx', [
    ...prefix('/:lang', [
      index('routes/home.tsx'),
      layout('./layouts/monstre-layouts.tsx', [
        route('/monstre/:file', 'routes/monstre.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
