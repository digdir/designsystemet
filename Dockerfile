ARG PORT
ARG HOST
ARG APP_ENV
# find sha for image on https://hub.docker.com/_/node/tags
FROM node:24.14.1-slim@sha256:06e5c9f86bfa0aaa7163cf37a5eaa8805f16b9acb48e3f85645b09d459fc2a9f AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

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

FROM nginx:alpine@sha256:645eda1c2477aaa9b879f73909b9222c6f19798dd45be6706268d82a661c6e6d AS storybook
# remove default config
RUN rm /etc/nginx/conf.d/default.conf
COPY /apps/storybook/nginx.conf /etc/nginx/conf.d/storybook.conf
COPY --from=storybook-build /prod/@web/storybook/dist /usr/share/nginx/html
EXPOSE 6006
CMD ["nginx", "-g", "daemon off;"]
