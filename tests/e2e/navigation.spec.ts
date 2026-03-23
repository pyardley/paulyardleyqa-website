import { test, expect } from "@playwright/test";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

test.describe("Desktop Navigation", () => {
  test.skip(({ isMobile }) => !!isMobile, "Desktop-only tests");

  test("should display all navigation links in desktop nav", async ({
    page,
  }) => {
    await page.goto("/");
    const desktopNav = page.locator("nav .hidden.md\\:flex");

    for (const item of navItems) {
      const link = desktopNav.locator(`a[href="${item.href}"]`);
      await expect(link).toBeVisible();
      await expect(link).toHaveText(item.label);
    }
  });

  test("should navigate to each page from header", async ({ page }) => {
    for (const item of navItems) {
      await page.goto("/");
      const desktopNav = page.locator("nav .hidden.md\\:flex");
      await desktopNav.locator(`a[href="${item.href}"]`).click();
      await expect(page).toHaveURL(new RegExp(`${item.href}\\/?$`));
    }
  });

  test("should highlight the current page in navigation", async ({ page }) => {
    await page.goto("/about");
    const desktopNav = page.locator("nav .hidden.md\\:flex");
    const aboutLink = desktopNav.locator('a[href="/about"]');
    // Active link should have teal text styling
    await expect(aboutLink).toHaveClass(/text-teal/);
  });

  test("should display logo linking to home", async ({ page }) => {
    await page.goto("/about");
    const logo = page.locator("nav > div > a[href='/']").first();
    await expect(logo).toBeVisible();
    await expect(logo).toContainText("Paul Yardley");
    await logo.click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("Mobile Navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should show hamburger menu on mobile", async ({ page }) => {
    await page.goto("/");
    const menuBtn = page.locator("#mobile-menu-btn");
    await expect(menuBtn).toBeVisible();
  });

  test("should toggle mobile menu open and closed", async ({ page }) => {
    await page.goto("/");
    const menuBtn = page.locator("#mobile-menu-btn");
    const mobileMenu = page.locator("#mobile-menu");

    // Menu should be hidden initially
    await expect(mobileMenu).toBeHidden();

    // Open menu
    await menuBtn.click();
    await expect(mobileMenu).toBeVisible();
    await expect(menuBtn).toHaveAttribute("aria-expanded", "true");

    // Close menu
    await menuBtn.click();
    await expect(mobileMenu).toBeHidden();
    await expect(menuBtn).toHaveAttribute("aria-expanded", "false");
  });

  test("should display all nav links in mobile menu", async ({ page }) => {
    await page.goto("/");
    await page.locator("#mobile-menu-btn").click();
    const mobileMenu = page.locator("#mobile-menu");

    for (const item of navItems) {
      const link = mobileMenu.locator(`a[href="${item.href}"]`);
      await expect(link).toBeVisible();
    }
  });

  test("should navigate when a mobile nav link is clicked", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("#mobile-menu-btn").click();
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    await mobileMenu.locator('a[href="/about"]').click();
    await expect(page).toHaveURL(/\/about\/?$/);
  });

  test("should hide desktop nav on mobile", async ({ page }) => {
    await page.goto("/");
    const desktopNav = page.locator("nav .hidden.md\\:flex");
    await expect(desktopNav).toBeHidden();
  });
});
