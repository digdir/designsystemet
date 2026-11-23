---

name: www-content
description: Rules for pages and blog posts on designsystemet.no. Use when adding, editing, moving or renaming anything under apps/www/app/content, including component documentation.
---

# Content on designsystemet.no

## Two languages

- Every page exists as the same file under `no/` and `en/`. Change both in the same pull request. Nothing checks that they match.

## Pages

- A page is only shown in the sidebar when its frontmatter has `published: true` and a `category`. Without them it is hidden, with no error.
- `order` sorts the page within its category, `sidebar_title` gives a shorter name in the sidebar, and `search_terms` is a comma-separated list of extra words for the search.
- When you move or rename a page, add a redirect from the old address in `apps/www/app/_utils/redirects.server.ts`, and update the links to it in both languages.

## Blog posts

- The frontmatter needs `title`, `description`, `date`, `author`, `imageSrc` and `imageAlt`. A missing author or date does not fail; the post is shown with "Unknown Author" or the year 2000.
- Images go in `apps/www/public/img/blog/<post name>/` as `.webp`. Both languages use the same file, with `alt` and captions translated.
- The avatars are picked from the names in `author:`. A new organisation needs an svg in `apps/www/public/img/avatars/` and an entry for its Norwegian and English name in `apps/www/app/_components/avatar-stack/avatar-stack.tsx`.

## Component documentation (`content/components/<name>/`)

- Each component has `metadata.json`, `<name>.stories.tsx`, and `overview.mdx`, `code.mdx` and `accessibility.mdx` in both `no/` and `en/`.
- `<Story story="X" />` shows the export `X` from the stories file. When a story has text, the English pages use a translated copy named `XEn`.
- A wrong story name does not fail the build. The page shows "Story not found", so look at the page in both languages.
- Readers see the story's source as it is written, so keep each story complete and good enough to copy.
- Do not write tables of props, CSS variables or data attributes by hand. They are generated from the code.

## Going live

- Merging to `main` does not publish the site. It is deployed with the next release, or by running the "Deploy www" workflow by hand.
