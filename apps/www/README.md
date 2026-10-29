# `@web/www`

Homepage for Designsystemet, hosted on [www.designsystemet.no](https://www.designsystemet.no).

## Archived documentation

When releasing a new major version, preserve the latest website for the previous
major version as a separate Docker deployment, for example `v1.designsystemet.no`.
The archive is a snapshot of the whole website; content outside the component
documentation is not kept in sync with the current website.

Set `DOCUMENTATION_VERSION` to the archived version label (for example `v1`) to
show a banner above the header in Norwegian and English, linking to
<https://www.designsystemet.no/>. Leave it unset for the current website.

The website prerenders pages, so the variable must be set **at build time**, not
only in Azure's runtime environment. The Docker build argument also sets the
runtime default so server-rendered pages show the same version:

```sh
docker build --target www --build-arg APP_ENV=production \
  --build-arg DOCUMENTATION_VERSION=v1 -t designsystemet-www:v1 .
```

Build from the final source revision of the old major version, including this
version-banner support. Retain the resulting image under a version-specific tag
and deploy it to a separate Azure Container App, outside the current website's
deployment target. Configure DNS, the custom domain `v1.designsystemet.no`, and
its HTTPS certificate for that app before publishing the archive link. Do not
overwrite the archive image or deployment when deploying the current website.

For local development, run `DOCUMENTATION_VERSION=v1 pnpm www` from the repository
root. If the version label changes, rebuild the image so prerendered pages and
server-rendered pages remain consistent.
