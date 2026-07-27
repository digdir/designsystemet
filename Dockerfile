ARG PORT
ARG HOST
ARG APP_ENV
# find sha for image on https://hub.docker.com/_/node/tags
FROM node:24.17.0-slim@sha256:862263c612aa437e3037674b85419622a9d93bff80aa1eee5398dfe686375532 AS base
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
ENV PORT=$PORT HOST=$HOST APP_ENV=$APP_ENV
# RR v8 prerenders via an in-process Vite preview server over HTTP. Force IPv4
# localhost resolution so the prerender can connect to it (avoids
# `ECONNREFUSED 127.0.0.1` when `localhost` resolves to IPv6 in the container).
ENV NODE_OPTIONS="--dns-result-order=ipv4first"
RUN pnpm build:www
RUN pnpm deploy --filter=@web/www --prod /prod/@web/www

FROM base AS www
COPY --from=www-build /prod/@web/www /srv/app
WORKDIR /srv/app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8000
EXPOSE 8000
CMD [ "pnpm", "start" ]

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
CMD [ "pnpm", "start" ]

FROM packages AS storybook-build
RUN pnpm build:storybook
ARG PORT
ARG HOST
ARG APP_ENV
ENV PORT=$PORT HOST=$HOST APP_ENV=$APP_ENV
ENV PORT=$PORT HOST=$HOST APP_ENV=$APP_ENV
RUN pnpm deploy --filter=@web/storybook --prod /prod/@web/storybook

FROM nginx:alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752 AS storybook
# remove default config
RUN rm /etc/nginx/conf.d/default.conf
COPY /apps/storybook/nginx.conf /etc/nginx/conf.d/storybook.conf
COPY --from=storybook-build /prod/@web/storybook/dist /usr/share/nginx/html
EXPOSE 6006
CMD ["nginx", "-g", "daemon off;"]
