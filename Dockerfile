FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

FROM base AS www
RUN pnpm build:www
RUN pnpm deploy --filter=@web/www --prod /prod/@web/www
COPY --from=build /prod/@web/www /srv/app
WORKDIR /srv/app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8000
EXPOSE 8000
CMD ["pnpm","start"]

FROM base AS themebuilder
RUN pnpm build:themebuilder
RUN pnpm deploy --filter=@web/themebuilder --prod /prod/@web/themebuilder
COPY --from=build /prod/@web/themebuilder /srv/app
WORKDIR /srv/app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8000
EXPOSE 8000
CMD [ "pnpm", "start" ]
