import { test, expect } from "@playwright/test";

test.describe("Footer Links", () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Skills", href: "/skills" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Resume", href: "/resume" },
  ];

  test("should display all quick links", async ({ page }) => {
    await page.goto("/");
    const quickLinksSection = page.locator(
      'footer h3:has-text("Quick Links") + ul',
    );

    for (const link of quickLinks) {
      const footerLink = quickLinksSection.locator(`a[href="${link.href}"]`);
      await expect(footerLink).toBeVisible();
      await expect(footerLink).toHaveText(link.label);
    }
  });

  test("should have Contact Me link", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    const contactLink = footer.locator('a[href="/contact"]');
    await expect(contactLink).toBeVisible();
  });

  test("should have LinkedIn link with correct URL", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    const linkedinLink = footer.locator('a:has-text("LinkedIn")');
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute(
      "href",
      /linkedin\.com\/in\/paul-yardley/,
    );
    await expect(linkedinLink).toHaveAttribute("target", "_blank");
    await expect(linkedinLink).toHaveAttribute("rel", /noopener/);
  });

  test("should have GitHub link with correct URL", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    const githubLink = footer.locator('a:has-text("GitHub")');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute("href", /github\.com\/pyardley/);
    await expect(githubLink).toHaveAttribute("target", "_blank");
    await expect(githubLink).toHaveAttribute("rel", /noopener/);
  });

  test("should display copyright with current year", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    const currentYear = new Date().getFullYear().toString();
    await expect(footer).toContainText(currentYear);
    await expect(footer).toContainText("Paul Yardley");
  });
});

test.describe("Internal Links - No Dead Links", () => {
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
    test(`should have no broken internal links on ${pagePath}`, async ({
      page,
    }) => {
      await page.goto(pagePath);

      const internalLinks = await page.locator('a[href^="/"]').all();
      const hrefs = new Set<string>();

      for (const link of internalLinks) {
        const href = await link.getAttribute("href");
        if (href && !href.includes(".pdf") && !href.includes("#")) {
          hrefs.add(href);
        }
      }

      for (const href of hrefs) {
        const response = await page.request.get(href);
        expect(
          response.status(),
          `Link ${href} on page ${pagePath} returned ${response.status()}`,
        ).toBeLessThan(400);
      }
    });
  }
});

test.describe("PDF Download", () => {
  test("should have a downloadable resume PDF", async ({ page }) => {
    await page.goto("/resume");
    const downloadLink = page.locator("a[download]");
    const href = await downloadLink.getAttribute("href");
    expect(href).toMatch(/\.pdf$/);

    // Verify PDF is accessible
    const response = await page.request.get(href!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });
});
