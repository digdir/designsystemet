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
version-banner and workflow support.

### Deploy from GitHub Actions

Archive deployments are manual only:

1. Open **Actions → Deploy www → Run workflow**.
2. Select the branch or tag containing the snapshot to preserve.
3. Select **production** and set **documentation_version** to the old major
   version, for example `v1` (or `v2` when archiving the next major version).
4. Run the workflow. It passes `DOCUMENTATION_VERSION` to both the Docker build
   and Azure runtime, tags the image with the version and run ID, and deploys to
   a separate Container App such as `www-v1` in the production resource group
   and Container Apps environment. It does not update `www-prod`.
5. Configure DNS, the custom domain `v1.designsystemet.no`, and its HTTPS
   certificate for that app before publishing the archive link. Domain
   provisioning remains manual.

Leave **documentation_version** empty for normal current-site deployments.
Automatic PR previews do not set it or deploy archives. Re-running a manual
deployment with the same version updates that archive; current-site deployments
do not overwrite its image or app.

For local development, run `DOCUMENTATION_VERSION=v1 pnpm www` from the repository
root. If the version label changes, rebuild the image so prerendered pages and
server-rendered pages remain consistent.
