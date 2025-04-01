import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./layouts/root-layout/root-layout.tsx', [
    index('routes/home.tsx'),
    ...prefix('/:lang', [
      layout('./layouts/monstre-layouts.tsx', [
        route('/monstre/:file', 'routes/monstre.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
