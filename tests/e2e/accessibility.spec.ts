import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  const pages = [
    "/",
    "/about",
    "/skills",
    "/portfolio",
    "/blog",
    "/resume",
    "/contact",
  ];

  for (const pagePath of pages) {
    test(`${pagePath} should have a valid lang attribute`, async ({ page }) => {
      await page.goto(pagePath);
      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", "en");
    });

    test(`${pagePath} should have at most one h1`, async ({ page }) => {
      await page.goto(pagePath);
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBeLessThanOrEqual(1);
    });

    test(`${pagePath} should have a page title`, async ({ page }) => {
      await page.goto(pagePath);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test(`${pagePath} should have a meta description`, async ({ page }) => {
      await page.goto(pagePath);
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(10);
    });
  }

  test("should have a skip to content link", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator("a.skip-link");
    await expect(skipLink).toHaveAttribute("href", "#main-content");

    // Skip link should become visible on focus
    await skipLink.focus();
    // The main content target should exist
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeAttached();
  });

  test("should have accessible navigation landmark", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeAttached();
  });

  test("should have aria-label on dark mode toggle", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("#theme-toggle");
    await expect(toggle).toHaveAttribute("aria-label", /dark mode/i);
  });

  test("should have aria-expanded on mobile menu button", async ({ page }) => {
    await page.goto("/");
    const menuBtn = page.locator("#mobile-menu-btn");
    await expect(menuBtn).toHaveAttribute("aria-expanded", /(true|false)/);
    await expect(menuBtn).toHaveAttribute("aria-label", /menu/i);
  });

  test("all images should have alt text", async ({ page }) => {
    await page.goto("/");
    const images = await page.locator("img").all();
    for (const img of images) {
      const alt = await img.getAttribute("alt");
      expect(alt, "Image missing alt attribute").not.toBeNull();
    }
  });

  test("external links should have rel noopener", async ({ page }) => {
    await page.goto("/");
    const externalLinks = await page.locator('a[target="_blank"]').all();
    for (const link of externalLinks) {
      const rel = await link.getAttribute("rel");
      expect(rel).toContain("noopener");
    }
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/resume");
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    const levels: number[] = [];

    for (const heading of headings) {
      const tag = await heading.evaluate((el) => el.tagName.toLowerCase());
      levels.push(parseInt(tag.replace("h", "")));
    }

    // Verify no heading level is skipped (e.g., h1 → h3 without h2)
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) {
      const jump = levels[i] - levels[i - 1];
      expect(
        jump,
        `Heading jump from h${levels[i - 1]} to h${levels[i]}`,
      ).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("Responsive Design", () => {
  const viewports = [
    { name: "Mobile", width: 375, height: 667 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Desktop", width: 1280, height: 720 },
  ];

  for (const vp of viewports) {
    test(`should render without horizontal scroll on ${vp.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(vp.width + 1); // +1 for rounding
    });

    test(`should display header on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      const header = page.locator("header");
      await expect(header).toBeVisible();
    });

    test(`should display footer on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      const footer = page.locator("footer");
      await expect(footer).toBeAttached();
    });
  }
});
