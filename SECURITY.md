# Security Policy

You can find our security.txt here: [security.txt](https://designsystemet.no/.well-known/security.txt)

**Do not** open a public GitHub issue or submit a public pull request describing the vulnerability.

## Automated Security Measures

We use several automated mechanisms to help detect and reduce risk:

### GitHub Security Features
- GitHub code scanning for static analysis.
- Dependency scanning and alerts for known vulnerabilities.

### Renovate
- Automated dependency updates.
- Renovate is configured to *only propose updates for packages that have been published for at least 3 days*.  
  This allows time for the ecosystem to discover and revert problematic releases.

### Dependency manager 
We use [pnpm](https://pnpm.io) for managing dependencies.

We have cofingured pnpm with the following:
- No dependency version newer than 72 hours is installed.
- Preventing transitive exotic dependencies.
- By default block script execution for dependencies.
  - See `allowedBuilds` in [pnpm-workspace-yaml](./pnpm-workspace.yaml) for whitelisted depedencies
