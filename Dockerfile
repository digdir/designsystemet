FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=@web/www --prod /prod/@web/www
RUN pnpm deploy --filter=@web/themebuilder --prod /prod/@web/themebuilder

FROM base AS www
COPY --from=build /prod/@web/www /prod/@web/www
WORKDIR /prod/@web/www
EXPOSE 8000
CMD [ "pnpm", "start" ]

FROM base AS themebuilder
COPY --from=build /prod/@web/themebuilder /prod/@web/themebuilder
WORKDIR /prod/@web/themebuilder
EXPOSE 8001
CMD [ "pnpm", "start" ]
