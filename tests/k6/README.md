# k6 Performance Test Suite

Performance tests for [paulyardleyqa.co.uk](https://paulyardleyqa.co.uk) using [k6](https://k6.io/) by Grafana.

## Prerequisites

Install k6 locally:

**Windows** (via Chocolatey):

```bash
choco install k6
```

**macOS** (via Homebrew):

```bash
brew install k6
```

**Linux**:

```bash
curl -fsSL https://github.com/grafana/k6/releases/download/v0.55.0/k6-v0.55.0-linux-amd64.tar.gz | tar xzf - --strip-components=1
sudo mv k6 /usr/local/bin/
```

## Running Tests

### Against the live site (default)

```bash
k6 run tests/k6/performance.js
```

### Against a different URL

```bash
BASE_URL=http://localhost:4321 k6 run tests/k6/performance.js
```

### With custom load profile

Override the default stages via CLI:

```bash
k6 run --vus 20 --duration 60s tests/k6/performance.js
```

## Test Configuration

### Load Profile (Default Stages)

| Phase     | Duration | Virtual Users | Purpose               |
| --------- | -------- | ------------- | --------------------- |
| Ramp up   | 10s      | 0 → 5         | Gradual load increase |
| Sustained | 30s      | 5 → 10        | Steady-state load     |
| Ramp down | 10s      | 10 → 0        | Graceful cooldown     |

**Total duration:** ~50 seconds

### Performance Thresholds

| Metric              | Threshold      | Description                               |
| ------------------- | -------------- | ----------------------------------------- |
| `http_req_duration` | p(95) < 2000ms | 95% of requests complete within 2 seconds |
| `http_req_failed`   | rate < 0.05    | Less than 5% of HTTP requests fail        |
| `errors`            | rate < 0.05    | Custom check error rate under 5%          |
| `page_load_time`    | p(95) < 2000ms | 95% of page loads under 2 seconds         |

### Pages Tested

All 7 pages are tested in each iteration:

1. **Homepage** (`/`)
2. **About** (`/about/`)
3. **Skills** (`/skills/`)
4. **Portfolio** (`/portfolio/`)
5. **Blog** (`/blog/`)
6. **Resume** (`/resume/`)
7. **Contact** (`/contact/`)

### Checks Per Page

Each page request verifies:

- HTTP status is 200
- Response time under 2 seconds
- Response body is non-empty
- Response contains HTML content

## CI/CD Integration

The k6 suite runs automatically **after each successful Netlify deployment** in the GitHub Actions pipeline:

1. Build site
2. Run Playwright E2E tests (pre-deploy)
3. Deploy to Netlify
4. **Install k6 → Wait 15s for propagation → Run k6 against live site**
5. Upload results as GitHub Actions artifact (30-day retention)

### Viewing CI Results

1. Go to the GitHub Actions run
2. Download the `k6-performance-report` artifact
3. Open `summary.json` for structured results

## Output

### Console Report

After each run, a formatted report is printed:

```
╔══════════════════════════════════════════════╗
║       k6 Performance Test Results            ║
╚══════════════════════════════════════════════╝

  Target:     https://paulyardleyqa.co.uk
  Timestamp:  2026-03-23T13:00:00.000Z

  ── Response Times ──────────────────────────
  Average:    150ms
  P95:        350ms
  Max:        800ms

  ── Reliability ─────────────────────────────
  Total Reqs: 350
  Error Rate: 0.00%
  Failed:     0.00%

  ── Thresholds ──────────────────────────────
  ✓ http_req_duration: p(95)<2000
  ✓ http_req_failed: rate<0.05
  ✓ errors: rate<0.05
  ✓ page_load_time: p(95)<2000
```

### JSON Summary

A structured JSON report is saved to `tests/k6/results/summary.json` containing:

- Timestamp and target URL
- Response time metrics (avg, p95, max)
- Error rates
- Threshold pass/fail results

## Customising

### Adjusting Load Profile

Edit the `options.stages` array in [`performance.js`](performance.js):

```javascript
export const options = {
  stages: [
    { duration: "30s", target: 20 }, // Ramp to 20 users
    { duration: "1m", target: 50 }, // Hold at 50 users
    { duration: "30s", target: 0 }, // Ramp down
  ],
};
```

### Adding Thresholds

Add new thresholds in the `options.thresholds` object:

```javascript
thresholds: {
  'http_req_duration{page:Homepage}': ['p(95)<1000'],  // Homepage under 1s
},
```

### Adding New Pages

Add entries to the `pages` array:

```javascript
const pages = [
  // ... existing pages
  { name: "New Page", path: "/new-page/" },
];
```
