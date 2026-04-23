# Vendored third-party assets

These files are self-hosted copies of upstream libraries, loaded via `<script>` tags with Subresource Integrity (SRI) hashes. Self-hosting eliminates CDN supply-chain risk — a compromised or typosquatted CDN cannot inject code, and the SRI hash ensures any file tampering fails the load.

## Current versions

| File | Upstream | Version | SRI hash |
|---|---|---|---|
| `web-vitals-4.2.4.iife.js` | [web-vitals](https://github.com/GoogleChrome/web-vitals) (attribution build) | 4.2.4 | `sha384-ALGaqjlZLgGM+v0mGDLsxCvv+00nSFUxL1CVB84bH5xde3HIqtPwstojSCWle8GH` |
| `chart-4.4.6.umd.min.js` | [Chart.js](https://www.chartjs.org/) (UMD build) | 4.4.6 | `sha384-Sse/HDqcypGpyTDpvZOJNnG0TT3feGQUkF9H+mnRvic+LjR+K1NhTt8f51KIQ3v3` |

## Upgrade recipe

```bash
# web-vitals
curl -sSL "https://unpkg.com/web-vitals@X.Y.Z/dist/web-vitals.attribution.iife.js" -o "assets/vendor/web-vitals-X.Y.Z.iife.js"
echo "sha384-$(openssl dgst -sha384 -binary assets/vendor/web-vitals-X.Y.Z.iife.js | openssl base64 -A)"

# chart.js
curl -sSL "https://cdn.jsdelivr.net/npm/chart.js@X.Y.Z/dist/chart.umd.min.js" -o "assets/vendor/chart-X.Y.Z.umd.min.js"
echo "sha384-$(openssl dgst -sha384 -binary assets/vendor/chart-X.Y.Z.umd.min.js | openssl base64 -A)"
```

After upgrading, update the `<script src="..." integrity="...">` references in the HTML pages that load them.
