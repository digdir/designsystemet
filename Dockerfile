ARG PORT
ARG HOST
ARG APP_ENV
# find sha for image on https://hub.docker.com/_/node/tags
FROM node:24.13.0-slim@sha256:4660b1ca8b28d6d1906fd644abe34b2ed81d15434d26d845ef0aced307cf4b6f AS base
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

FROM nginx:alpine AS storybook
# remove default config
RUN rm /etc/nginx/conf.d/default.conf
COPY /apps/storybook/nginx.conf /etc/nginx/conf.d/storybook.conf
COPY --from=storybook-build /prod/@web/storybook/dist /usr/share/nginx/html
EXPOSE 6006
CMD ["nginx", "-g", "daemon off;"]
