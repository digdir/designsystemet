ARG PORT
ARG HOST
ARG APP_ENV
# find sha for image on https://hub.docker.com/_/node/tags
FROM node:24.22.0-slim@sha256:91acba91b842bec0bf7ea6f5e09c644c7ccad72c4996ed9616d861d1c7cd60d4 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable
RUN corepack install

FROM base AS packages
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

FROM packages AS www-build
WORKDIR /usr/src/app
ARG PORT
ARG HOST
ARG APP_ENV
ARG DOCUMENTATION_VERSION
ENV PORT=$PORT HOST=$HOST APP_ENV=$APP_ENV
ENV DOCUMENTATION_VERSION=$DOCUMENTATION_VERSION
# RR v8 prerenders via an in-process Vite preview server over HTTP. Force IPv4
# localhost resolution so the prerender can connect to it (avoids
# `ECONNREFUSED 127.0.0.1` when `localhost` resolves to IPv6 in the container).
ENV NODE_OPTIONS="--dns-result-order=ipv4first"
RUN pnpm build:www
RUN pnpm deploy --filter=@web/www --prod /prod/@web/www

FROM base AS www
COPY --from=www-build /prod/@web/www /srv/app
WORKDIR /srv/app
ARG DOCUMENTATION_VERSION
ENV DOCUMENTATION_VERSION=$DOCUMENTATION_VERSION
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8000
EXPOSE 8000
CMD [ "node", "server.js" ]

FROM packages AS themebuilder-build
WORKDIR /usr/src/app
ARG PORT
ARG HOST
ARG APP_ENV
ENV PORT=$PORT HOST=$HOST APP_ENV=$APP_ENV
RUN pnpm build:themebuilder
RUN pnpm deploy --filter=@web/themebuilder --prod /prod/@web/themebuilder

FROM base AS themebuilder
COPY --from=themebuilder-build /prod/@web/themebuilder /srv/app
WORKDIR /srv/app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8000
EXPOSE 8000
CMD [ "node", "server.js" ]

FROM packages AS storybook-build
RUN pnpm build:storybook
ARG PORT
ARG HOST
ARG APP_ENV
ENV PORT=$PORT HOST=$HOST APP_ENV=$APP_ENV
ENV PORT=$PORT HOST=$HOST APP_ENV=$APP_ENV
RUN pnpm deploy --filter=@web/storybook --prod /prod/@web/storybook

FROM cgr.dev/chainguard/nginx:latest@sha256:d74ba9e5cf9f6b049807e27a5a14a8cd2550ac428143b7d15ea3dbad282f4ed1 AS storybook
# distroless image (no shell), so replace the default config by overwriting it
COPY /apps/storybook/nginx.conf /etc/nginx/conf.d/nginx.default.conf
COPY --from=storybook-build /prod/@web/storybook/dist /usr/share/nginx/html
EXPOSE 6006
