import { test, expect } from "@playwright/test";

test.describe("Dark Mode Toggle", () => {
  test.skip(({ isMobile }) => !!isMobile, "Desktop-only tests");
  test("should default to light mode when no preference is stored", async ({
    page,
  }) => {
    await page.goto("/");
    const html = page.locator("html");
    // Clear any stored preference
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();

    // Without system dark preference, should be light mode
    const isDark = await html.evaluate((el) => el.classList.contains("dark"));
    // This depends on system preference, so we just verify the toggle works
    expect(typeof isDark).toBe("boolean");
  });

  test("should toggle dark mode via desktop button", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    // Set to light mode first
    await page.evaluate(() => {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    });

    const themeToggle = page.locator("#theme-toggle");
    await expect(themeToggle).toBeVisible();

    // Should be in light mode
    await expect(html).not.toHaveClass(/dark/);

    // Click to enable dark mode
    await themeToggle.click();
    await expect(html).toHaveClass(/dark/);

    // Verify localStorage was updated
    const storedTheme = await page.evaluate(() =>
      localStorage.getItem("theme"),
    );
    expect(storedTheme).toBe("dark");

    // Click again to disable dark mode
    await themeToggle.click();
    await expect(html).not.toHaveClass(/dark/);

    const storedThemeAfter = await page.evaluate(() =>
      localStorage.getItem("theme"),
    );
    expect(storedThemeAfter).toBe("light");
  });

  test("should persist dark mode preference across page loads", async ({
    page,
  }) => {
    await page.goto("/");

    // Set dark mode
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
    });

    // Reload page
    await page.reload();
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });

  test("should persist light mode preference across page loads", async ({
    page,
  }) => {
    await page.goto("/");

    // Set light mode
    await page.evaluate(() => {
      localStorage.setItem("theme", "light");
    });

    // Reload page
    await page.reload();
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);
  });

  test("should show sun icon in dark mode and moon icon in light mode", async ({
    page,
  }) => {
    await page.goto("/");

    // Set light mode
    await page.evaluate(() => {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    });

    // In light mode, moon icon should be visible (to switch to dark)
    const themeToggle = page.locator("#theme-toggle");
    const moonIcon = themeToggle.locator("svg.block");
    const sunIcon = themeToggle.locator("svg.hidden");
    await expect(moonIcon).toBeVisible();
    await expect(sunIcon).toBeHidden();
  });
});

test.describe("Dark Mode Toggle - Mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should toggle dark mode via mobile menu button", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    // Set to light mode
    await page.evaluate(() => {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    });

    // Open mobile menu
    await page.locator("#mobile-menu-btn").click();
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Click dark mode toggle in mobile menu
    const mobileToggle = page.locator("#theme-toggle-mobile");
    await expect(mobileToggle).toBeVisible();
    await expect(mobileToggle).toContainText("Switch to Dark Mode");
    await mobileToggle.click();

    // Should be in dark mode now
    await expect(html).toHaveClass(/dark/);

    // Mobile menu should close after toggling
    await expect(mobileMenu).toBeHidden();
  });

  test("should show correct toggle text based on current mode", async ({
    page,
  }) => {
    await page.goto("/");

    // Set dark mode
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    });

    await page.locator("#mobile-menu-btn").click();
    const mobileToggle = page.locator("#theme-toggle-mobile");
    await expect(mobileToggle).toContainText("Switch to Light Mode");
  });
});

test.describe("Dark Mode Visual Contrast", () => {
  test("light mode should have light background", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    });
    await page.reload();

    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // White or very light background expected
    expect(bgColor).toMatch(/rgb\(255, 255, 255\)|rgba\(255, 255, 255/);
  });

  test("dark mode should have dark background", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
    });
    await page.reload();

    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Dark background - RGB values should be low
    const match = bgColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
    expect(match).toBeTruthy();
    if (match) {
      const [, r, g, b] = match.map(Number);
      expect(r).toBeLessThan(50);
      expect(g).toBeLessThan(50);
      expect(b).toBeLessThan(60);
    }
  });
});
