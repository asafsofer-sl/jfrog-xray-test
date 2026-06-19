# vuln-demo-app

A minimal Node.js/Express app whose only purpose is to have a handful of
**intentionally outdated** npm dependencies with publicly known CVEs, so you
can practice/test vulnerability scanning (npm audit, JFrog Xray, Snyk, etc.)
before pushing artifacts to a registry like JFrog Artifactory.

## Known-vulnerable dependencies included

| Package  | Version | Example known issue (illustrative, check current advisories) |
|----------|---------|----------------------------------------------------------------|
| lodash   | 4.17.11 | Prototype pollution (CVE-2019-10744) |
| minimist | 1.2.0   | Prototype pollution (CVE-2020-7598) |
| axios    | 0.18.0  | SSRF via redirect handling (CVE-2019-10742-family issues) |
| moment   | 2.19.3  | Regular Expression Denial of Service (ReDoS) |
| request  | 2.87.0  | Deprecated package, transitively pulls in vulnerable deps |
| express  | 4.16.0  | Older release, generally fine but outdated |

Exact CVE IDs/severities shift over time as advisories get republished —
always re-check current databases (npm audit, GitHub Advisory DB, NVD) rather
than trusting a hardcoded list.

## Build locally

```bash
npm install
npm run build      # no-op compile step, just confirms the project is buildable
npm start           # runs the demo server on http://localhost:3000
```

## Find known vulnerabilities

### Option A — npm's built-in auditor
```bash
npm audit
```

### Option B — JFrog Xray (after configuring JFrog CLI / Artifactory repo)
```bash
# Authenticate / configure once:
jf c add

# Build with the JFrog CLI wrapper so build-info is captured:
jf npm-config --repo-resolve=<your-npm-virtual-repo> --repo-deploy=<your-npm-local-repo>
jf npm install
jf npm publish

# Then scan with Xray:
jf scan .
```

(Replace `<your-npm-virtual-repo>` / `<your-npm-local-repo>` with the repo
names configured in your JFrog Artifactory instance.)

### Option C — Snyk (if you have it configured)
```bash
npx snyk test
```

## Upload the package to JFrog Artifactory

1. Configure your `.npmrc` to point at your Artifactory npm repo, e.g.:
   ```
   registry=https://<your-instance>.jfrog.io/artifactory/api/npm/<repo-name>/
   ```
2. Authenticate:
   ```bash
   npm login --registry=https://<your-instance>.jfrog.io/artifactory/api/npm/<repo-name>/
   ```
3. Publish:
   ```bash
   npm publish
   ```

Or use the JFrog CLI (`jf npm publish`) as shown above, which also attaches
build-info metadata so Xray can map vulnerabilities back to this specific
build.
