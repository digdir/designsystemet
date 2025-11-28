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

### pnpm Policies
pnpm is configured to ensure **no dependency version newer than 24 hours** is installed.
