# Security Vulnerabilities

This document tracks known security vulnerabilities and their remediation status.

## Last Audit

**Date**: 2026-02-03
**Total Vulnerabilities**: 9 (down from 18)
- High: 1
- Moderate: 6
- Low: 2

## Current Vulnerabilities

### High Severity

#### fast-xml-parser (CVSS 7.5)
- **CVE**: GHSA-37qj-frw5-hhjh
- **Issue**: RangeError DoS via Numeric Entities Bug
- **Affected Version**: 4.3.6 - 5.3.3
- **Path**: @payloadcms/storage-gcs → @google-cloud/storage → fast-xml-parser
- **Fix Available**: Yes
- **Action Required**: Wait for Payload CMS to update GCS SDK
- **Notes**: Downgrading @payloadcms/storage-gcs to 3.59.1 would fix this but break our GCS configuration

### Moderate Severity

#### esbuild (CVSS 5.3)
- **CVE**: GHSA-67mh-4wv8-2f99
- **Issue**: Enables any website to send requests to dev server and read response
- **Affected Version**: <=0.24.2
- **Path**: @payloadcms/db-postgres → drizzle-kit → @esbuild-kit/esm-loader → @esbuild-kit/core-utils → esbuild
- **Fix Available**: No
- **Action Required**: Wait for Payload CMS to update drizzle-kit
- **Notes**: Only affects development environment (dev server)

#### @esbuild-kit/core-utils (CVSS 5.3)
- **Same as esbuild**: Indirect dependency with no direct fix available

#### @esbuild-kit/esm-loader (CVSS 5.3)
- **Same as esbuild**: Indirect dependency with no direct fix available

#### drizzle-kit (CVSS 5.3)
- **Same as esbuild**: Indirect dependency with no direct fix available

#### @payloadcms/db-postgres (CVSS 5.3)
- **Same as esbuild**: Indirect dependency with no direct fix available

#### Next.js (CVSS 5.9)
- **CVE**: GHSA-5f7q-jpqc-wp7h
- **Issue**: Unbounded Memory Consumption via PPR Resume Endpoint
- **Affected Version**: 15.0.0 - 15.6.0-canary.60
- **Fix Available**: Yes (upgrade to Next.js 16.x)
- **Action Required**: Evaluate Next.js 16 migration
- **Notes**: Major version upgrade - requires testing and potential migration

### Low Severity

#### @eslint/plugin-kit (CVSS 0.0)
- **CVE**: GHSA-xffm-g5w8-qvg7
- **Issue**: Regular Expression Denial of Service
- **Affected Version**: <0.3.4
- **Fix Available**: Yes
- **Action Required**: Minor dependency update
- **Notes**: Low severity (CVSS score 0), development-only

## Remediation Timeline

| Vulnerability | Target Date | Status |
|---------------|-------------|--------|
| fast-xml-parser | Q2 2026 | Monitoring upstream |
| esbuild chain | Q2 2026 | Monitoring upstream |
| Next.js PPR | Q3 2026 | Pending evaluation |
| @eslint/plugin-kit | Asap | Low priority |

## Security Best Practices

### Development
- Never expose development server to the public internet
- Use environment variables for sensitive data
- Rotate secrets regularly

### Production
- Use Content Security Policy (CSP) headers
- Implement rate limiting on API routes
- Keep dependencies updated
- Monitor for security advisories

### CI/CD
- Run `npm audit` in CI pipeline
- Consider using Dependabot or Renovate for automated updates
- Implement security scanning (e.g., Snyk, GitHub Dependabot)

## Resources

- [Payload CMS Security](https://payloadcms.com/docs/security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/security)
- [npm Audit Docs](https://docs.npmjs.com/cli/v9/commands/npm-audit)

## Change Log

- 2026-02-03: Initial security audit, reduced vulnerabilities from 18 to 9
- 2026-02-03: Upgraded Payload packages to 3.74.0 for better compatibility
