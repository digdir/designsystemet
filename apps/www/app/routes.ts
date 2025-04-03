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
      index('routes/home/home.tsx'),
      ...prefix('/monstre', [
        layout('./layouts/monstre/layout.tsx', [
          // Index route
          route('', 'routes/monstre.tsx', {
            id: 'monstre-index',
          }),
          // Detail route
          route('/:file', 'routes/monstre-page/monstre-page.tsx', {
            id: 'monstre-page',
          }),
        ]),
      ]),
      ...prefix('/bloggen', [
        layout('./layouts/bloggen/layout.tsx', [
          route('/', 'routes/bloggen.tsx'),
        ]),
        layout('./layouts/bloggen/page.tsx', [
          route('/:file', 'routes/bloggen-page/bloggen-page.tsx'),
        ]),
      ]),
      route('/komponenter', 'routes/components/components.tsx', {
        id: 'components',
      }),
    ]),
  ]),
] satisfies RouteConfig;
