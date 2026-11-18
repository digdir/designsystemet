# `@web/themebuilder`

Themebuilder for Designsystemet, hosted on [theme.designsystemet.no](https://theme.designsystemet.no).

## Sharing themes

A theme can be shared as links when the server has a Postgres database to save it in, given as `DATABASE_URL`.
Each shared theme has a link for viewing (`?view=`) and a link that also saves the changes made from it (`?id=`).
Without it, as in the previews of pull requests, the share button is not shown.

The server makes the `shared_themes` table when the database does not have it, which the database user must be
allowed to do the first time. For a hosted database, use `sslmode=verify-full` in the URL so that the connection
is encrypted and the certificate is checked.

In production the URL comes from the GitHub secret `THEMEBUILDER_DATABASE_URL`. The deploy workflow saves it as a
secret on the container app and points `DATABASE_URL` to it.

To try it locally, start a database and point the theme builder and its tests at it:

```bash
docker run --rm -d --name themebuilder-db -e POSTGRES_PASSWORD=dev -p 127.0.0.1:5432:5432 postgres:17-alpine
DATABASE_URL=postgres://postgres:dev@127.0.0.1:5432/postgres pnpm dev
TEST_DATABASE_URL=postgres://postgres:dev@127.0.0.1:5432/postgres pnpm test
```
