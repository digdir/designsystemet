# Security Policy

This document covers all packages published under `@digdir/designsystemet` on npm.

## Supported Versions

We actively maintain the latest major versions of all publicly released packages.

In general:

- The **latest major version** receives both security fixes and regular bug fixes.
- **Older major versions** may receive security fixes when feasible.
- **Deprecated versions and `0.*` versions** receive no further maintenance.

If you are using an older version, we recommend upgrading to the latest stable release before reporting a security issue, as it may already be resolved.

## Reporting a Vulnerability

If you believe you have found a security vulnerability in any of our packages, we would like to hear from you.

**Do not** open a public GitHub issue or submit a public pull request describing the vulnerability.

If the security issue is with a third-party dependency, please report it to the maintainer of that package.

Instead, please contact us via email:

**designsystem@digdir.no**  

Your report should ideally include:
- The affected package and version (`@digdir/...` with exact version).
- A short, reproducible description of the issue.
- What you expected to happen vs. what actually happened.
- A minimal Proof-of-Concept, if applicable.
- Relevant environment details (Node version, browser, OS, etc.), if applicable.

### How We Handle Reports

Our typical process is:
1. **Initial Response:** We aim to reply within a few business days.
2. **Triage:** We assess the severity (critical / high / medium / low / non-vulnerable).
3. **Remediation:** We develop a fix or provide mitigation guidance.
4. **Release:**  
   - We publish a patched version to npm.  
   - We update changelogs and relevant documentation.
5. **Coordination:** For critical findings, we may coordinate disclosure with the reporter to ensure users can update before details become public.

We cannot guarantee specific timelines, but critical issues are prioritized.

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

## Out-of-Scope Reports

The following are generally considered out of scope:
- Non-security bugs (general functional issues).
- Issues requiring configurations contrary to documented recommendations.
- Vulnerabilities in third-party systems or libraries we depend on but do not control.

If in doubt, feel free to contact us. When in question, it is better to report than to assume.

## Responsible Disclosure

We ask that reporters:
- Give us adequate time to investigate and remediate before public disclosure.
- Avoid testing on systems or data without authorization.
- Avoid attempting to access personal or sensitive information beyond what is necessary to demonstrate the issue.

We appreciate responsible security research and may credit contributors in release notes if desired.

## Rewards
We do not offer monetary or swag as rewards for vulnerability reports at this time.
