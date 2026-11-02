# `@web/www`

Homepage for Designsystemet, hosted on [www.designsystemet.no](https://www.designsystemet.no).

## Social Images

`pnpm --filter @web/www build` generates 1200 x 630 PNG social images in
`dist/client/img/meta` after prerendering. Titles and section icons come from
the rendered pages, with Inter bundled locally for image generation. Section
colors match the website's light-theme banners; the blog index uses its existing artwork.
The Norwegian and English homepages keep `/img/designsystemet-meta.png`.
Blog posts keep their custom `imageSrc` images and are excluded from generation.

Open Graph and Twitter metadata use the generated images. No generated images
need to be committed. Preview them with `pnpm --filter @web/www start` after a build.
