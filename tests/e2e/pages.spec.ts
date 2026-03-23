import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Paul Yardley/);
  });

  test("should display hero section", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("text=Paul Yardley");
    await expect(hero.first()).toBeVisible();
  });

  test("should have meta description", async ({ page }) => {
    await page.goto("/");
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);
  });

  test("should have Open Graph meta tags", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(
      page.locator('meta[property="og:description"]'),
    ).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website",
    );
  });
});

test.describe("About Page", () => {
  test("should load with correct heading", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle(/About/);
    const heading = page.locator("h1");
    await expect(heading).toContainText("About");
  });

  test("should contain professional background", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("text=QA")).toBeTruthy();
  });
});

test.describe("Skills Page", () => {
  test("should load with correct title and heading", async ({ page }) => {
    await page.goto("/skills");
    await expect(page).toHaveTitle(/Skills/);
    const heading = page.locator("h2").first();
    await expect(heading).toContainText("Skills");
  });
});

test.describe("Portfolio Page", () => {
  test("should load with correct heading", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page).toHaveTitle(/Portfolio/);
    const heading = page.locator("h1");
    await expect(heading).toContainText("Portfolio");
  });
});

test.describe("Blog Page", () => {
  test("should load with correct heading", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle(/Blog/);
    const heading = page.locator("h1");
    await expect(heading).toContainText("Blog");
  });
});

test.describe("Resume Page", () => {
  test("should load with correct heading", async ({ page }) => {
    await page.goto("/resume");
    await expect(page).toHaveTitle(/Resume/);
    const heading = page.locator("h1");
    await expect(heading).toContainText("Resume");
  });

  test("should have a PDF download link", async ({ page }) => {
    await page.goto("/resume");
    const downloadLink = page.locator("a[download]");
    await expect(downloadLink).toBeVisible();
    await expect(downloadLink).toHaveAttribute("href", /\.pdf$/);
  });

  test("should display technical skills section", async ({ page }) => {
    await page.goto("/resume");
    await expect(page.locator("text=Technical Skills")).toBeVisible();
  });

  test("should display work experience", async ({ page }) => {
    await page.goto("/resume");
    await expect(
      page.locator("text=Senior Test Analyst").first(),
    ).toBeVisible();
  });
});

test.describe("Contact Page", () => {
  test("should load with correct heading", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveTitle(/Contact/);
    const heading = page.locator("h1");
    await expect(heading).toContainText("Get In Touch");
  });
});
