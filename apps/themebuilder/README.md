# `@web/themebuilder`

Themebuilder for Designsystemet, hosted on [theme.designsystemet.no](https://theme.designsystemet.no).

## Sharing themes

A theme can be shared as links when the server has a Postgres database to save it in, given as `DATABASE_URL`.
Each shared theme has a link for viewing (`?view=`) and a link that also saves the changes made from it (`?id=`).
Without it the share button is not shown.

The server makes the `shared_themes` table when the database does not have it, which the database user must be
allowed to do the first time. For a hosted database, use `sslmode=verify-full` in the URL so that the connection
is encrypted and the certificate is checked.

In production the URL comes from the GitHub secret `THEMEBUILDER_DATABASE_URL`. The deploy workflow saves it as a
secret on the container app and points `DATABASE_URL` to it.

The previews of pull requests have no database. To try a change to the database in a preview, set the GitHub secret
`THEMEBUILDER_PREVIEW_DATABASE_URL` to the URL of a test database, and remove it afterwards. Previews must never be
given the production database.

### Signing in without a password

In Azure the server can sign in to the database as a managed identity, so that there is no password to keep.
The URL then has no password, and its user is the name of the identity:

```
postgres://<identity>@<server>.postgres.database.azure.com:5432/<database>?sslmode=verify-full
```

The identity is a user-assigned one in the resource group of the container app. Its name is given in the GitHub
variable `THEMEBUILDER_DATABASE_IDENTITY` (`THEMEBUILDER_PREVIEW_DATABASE_IDENTITY` for previews), and the deploy
workflow adds the identity to the container app. The database must have a user for the identity, which an admin
of the database makes once:

```sql
-- In the `postgres` database
select * from pgaadauth_create_principal('<identity>', false, false);
-- In the database of the theme builder
grant usage, create on schema public to "<identity>";
```

### Running it locally

To try it locally, start a database and point the theme builder and its tests at it:

```bash
docker run --rm -d --name themebuilder-db -e POSTGRES_PASSWORD=dev -p 127.0.0.1:5432:5432 postgres:17-alpine
DATABASE_URL=postgres://postgres:dev@127.0.0.1:5432/postgres pnpm dev
TEST_DATABASE_URL=postgres://postgres:dev@127.0.0.1:5432/postgres pnpm test
```

The tests of the database are skipped without `TEST_DATABASE_URL`. They run in a schema of their own, which they
remove afterwards, so they can share a database with the theme builder.

A shared config is saved as it was written, but without the keys the CLI does not know.
