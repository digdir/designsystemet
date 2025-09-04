FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/app

FROM base AS deps
# copy only manifests for max cache hit
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/*/package.json packages/*/
COPY apps/*/package.json apps/*/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- build (shared libs) ----------
FROM deps AS build
COPY . .
RUN pnpm run build

# ---------- app-specific builds ----------
FROM build AS www-build
RUN pnpm --filter @web/www run build:www
RUN pnpm deploy --filter @web/www --prod /prod/www

FROM build AS themebuilder-build
RUN pnpm --filter @web/themebuilder run build:themebuilder
RUN pnpm deploy --filter @web/themebuilder --prod /prod/themebuilder

FROM base AS www
WORKDIR /srv/app
COPY --from=www-build /prod/www ./
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8000
EXPOSE 8000
CMD ["pnpm","start"]

FROM base AS themebuilder
WORKDIR /srv/app
COPY --from=themebuilder-build /prod/themebuilder ./
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8000
EXPOSE 8000
CMD ["pnpm","start"]
