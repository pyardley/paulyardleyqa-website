import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");
const pageLoadTrend = new Trend("page_load_time", true);

// Test configuration
const BASE_URL = __ENV.BASE_URL || "https://paulyardleyqa.co.uk";

export const options = {
  stages: [
    { duration: "10s", target: 5 }, // Ramp up to 5 users
    { duration: "30s", target: 10 }, // Hold at 10 users
    { duration: "10s", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% of requests under 2s
    http_req_failed: ["rate<0.05"], // Less than 5% failure rate
    errors: ["rate<0.05"], // Custom error rate under 5%
    page_load_time: ["p(95)<2000"], // 95% page loads under 2s
  },
};

const pages = [
  { name: "Homepage", path: "/" },
  { name: "About", path: "/about/" },
  { name: "Skills", path: "/skills/" },
  { name: "Portfolio", path: "/portfolio/" },
  { name: "Blog", path: "/blog/" },
  { name: "Resume", path: "/resume/" },
  { name: "Contact", path: "/contact/" },
];

export default function () {
  for (const page of pages) {
    group(page.name, function () {
      const res = http.get(`${BASE_URL}${page.path}`, {
        tags: { page: page.name },
      });

      pageLoadTrend.add(res.timings.duration);

      const passed = check(res, {
        [`${page.name} - status 200`]: (r) => r.status === 200,
        [`${page.name} - response time < 2s`]: (r) => r.timings.duration < 2000,
        [`${page.name} - has content`]: (r) => r.body.length > 0,
        [`${page.name} - has HTML content`]: (r) =>
          r.body.includes("<!doctype html>") ||
          r.body.includes("<!DOCTYPE html>"),
      });

      errorRate.add(!passed);
    });

    sleep(0.5);
  }
}

export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    metrics: {
      http_req_duration: {
        avg: data.metrics.http_req_duration?.values?.avg,
        p95: data.metrics.http_req_duration?.values["p(95)"],
        max: data.metrics.http_req_duration?.values?.max,
      },
      http_req_failed: data.metrics.http_req_failed?.values?.rate,
      http_reqs: data.metrics.http_reqs?.values?.count,
      errors: data.metrics.errors?.values?.rate,
      page_load_time: {
        avg: data.metrics.page_load_time?.values?.avg,
        p95: data.metrics.page_load_time?.values["p(95)"],
      },
    },
    thresholds: {},
  };

  // Collect threshold results
  for (const [key, value] of Object.entries(data.metrics)) {
    if (value.thresholds) {
      for (const [threshold, passed] of Object.entries(value.thresholds)) {
        summary.thresholds[`${key}: ${threshold}`] = passed.ok;
      }
    }
  }

  return {
    stdout: generateTextReport(summary),
    "tests/k6/results/summary.json": JSON.stringify(summary, null, 2),
  };
}

function generateTextReport(summary) {
  const lines = [
    "",
    "╔══════════════════════════════════════════════╗",
    "║       k6 Performance Test Results            ║",
    "╚══════════════════════════════════════════════╝",
    "",
    `  Target:     ${summary.baseUrl}`,
    `  Timestamp:  ${summary.timestamp}`,
    "",
    "  ── Response Times ──────────────────────────",
    `  Average:    ${Math.round(summary.metrics.http_req_duration.avg)}ms`,
    `  P95:        ${Math.round(summary.metrics.http_req_duration.p95)}ms`,
    `  Max:        ${Math.round(summary.metrics.http_req_duration.max)}ms`,
    "",
    "  ── Reliability ─────────────────────────────",
    `  Total Reqs: ${summary.metrics.http_reqs}`,
    `  Error Rate: ${(summary.metrics.errors * 100).toFixed(2)}%`,
    `  Failed:     ${(summary.metrics.http_req_failed * 100).toFixed(2)}%`,
    "",
    "  ── Thresholds ──────────────────────────────",
  ];

  for (const [name, passed] of Object.entries(summary.thresholds)) {
    lines.push(`  ${passed ? "✓" : "✗"} ${name}`);
  }

  lines.push("", "");
  return lines.join("\n");
}
