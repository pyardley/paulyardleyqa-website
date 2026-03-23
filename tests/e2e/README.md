# Playwright E2E Test Suite

End-to-end tests for [paulyardleyqa.co.uk](https://paulyardleyqa.co.uk) using [Playwright](https://playwright.dev/).

## Prerequisites

- Node.js >= 22.12.0
- Playwright browsers installed

```bash
npm install
npx playwright install chromium
```

## Running Tests

### Against the live site (default)

```bash
npm run test:e2e
```

### Against local development server

```bash
npm run dev
# In another terminal:
BASE_URL=http://localhost:4321 npm run test:e2e
```

### With interactive UI mode

```bash
npm run test:e2e:ui
```

### Run a specific test file

```bash
npx playwright test tests/e2e/navigation.spec.ts
```

### Run a specific project (browser)

```bash
npx playwright test --project="Desktop Chrome"
npx playwright test --project="Mobile Chrome"
```

### View HTML report after a test run

```bash
npx playwright show-report
```

## Configuration

The test configuration is defined in [`playwright.config.ts`](../../playwright.config.ts):

| Setting         | Value                                                            |
| --------------- | ---------------------------------------------------------------- |
| **Base URL**    | `https://paulyardleyqa.co.uk` (override with `BASE_URL` env var) |
| **Browsers**    | Desktop Chrome, Mobile Chrome (Pixel 5)                          |
| **Timeout**     | 30 seconds per test                                              |
| **Retries**     | 0 locally, 2 in CI                                               |
| **Workers**     | Auto locally, 1 in CI                                            |
| **Reporter**    | HTML + list                                                      |
| **Screenshots** | On failure only                                                  |
| **Traces**      | On first retry                                                   |

## Test Suites

### [`navigation.spec.ts`](navigation.spec.ts) — Navigation (10 tests)

Tests for both desktop and mobile navigation behaviour.

**Desktop Navigation** _(skipped on mobile viewport)_

- Displays all 7 navigation links (Home, About, Skills, Portfolio, Blog, Resume, Contact)
- Navigates to each page when links are clicked
- Highlights the current page with active styling
- Logo links back to the homepage

**Mobile Navigation**

- Shows hamburger menu button on mobile
- Toggles mobile menu open and closed with correct `aria-expanded` state
- Displays all navigation links in the mobile menu
- Navigates to pages when mobile nav links are clicked
- Hides desktop navigation on mobile viewports

### [`pages.spec.ts`](pages.spec.ts) — Page Content (13 tests)

Verifies each page loads correctly with the expected content.

**Homepage**

- Loads with correct title containing "Paul Yardley"
- Displays hero section
- Has meta description
- Has Open Graph meta tags (title, description, type)

**About Page**

- Loads with "About" in title and h1
- Contains professional background content

**Skills Page**

- Loads with "Skills" in title
- Displays skills heading

**Portfolio Page**

- Loads with "Portfolio" in title and h1

**Blog Page**

- Loads with "Blog" in title and h1

**Resume Page**

- Loads with "Resume" in title and h1
- Has a downloadable PDF link pointing to `.pdf` file
- Displays "Technical Skills" section
- Displays work experience ("Senior Test Analyst")

**Contact Page**

- Loads with "Contact" in title and "Get In Touch" heading

### [`dark-mode.spec.ts`](dark-mode.spec.ts) — Dark Mode (10 tests)

Tests for the dark/light mode toggle functionality.

**Desktop Toggle** _(skipped on mobile viewport)_

- Defaults to light or dark based on system preference
- Toggles dark mode on/off via desktop button
- Updates `localStorage` when toggling
- Persists dark mode preference across page reloads
- Persists light mode preference across page reloads
- Shows correct icon (sun in dark mode, moon in light mode)

**Mobile Toggle**

- Toggles dark mode via mobile menu button
- Closes mobile menu after toggling theme
- Shows correct toggle text ("Switch to Dark Mode" / "Switch to Light Mode")

**Visual Contrast**

- Light mode has white/light background (`rgb(255, 255, 255)`)
- Dark mode has dark background (RGB values < 50)

### [`links.spec.ts`](links.spec.ts) — Links & Footer (10 tests)

Validates all links across the site.

**Footer Links**

- Displays all 6 quick links (Home, About, Skills, Portfolio, Blog, Resume) in correct order
- Has Contact Me link
- LinkedIn link points to correct profile with `target="_blank"` and `rel="noopener"`
- GitHub link points to correct profile with `target="_blank"` and `rel="noopener"`
- Displays copyright with current year

**Dead Link Detection**

- Scans all 7 pages for internal links and verifies each returns HTTP status < 400

**PDF Download**

- Resume PDF is accessible and returns `application/pdf` content type

### [`accessibility.spec.ts`](accessibility.spec.ts) — Accessibility & Responsive (16 tests)

Checks core accessibility requirements and responsive design.

**Accessibility** _(runs on all 7 pages)_

- Every page has `lang="en"` on the `<html>` element
- Every page has at most one `<h1>` element
- Every page has a non-empty `<title>`
- Every page has a meta description longer than 10 characters
- Skip-to-content link exists and targets `#main-content`
- Navigation landmark has `aria-label="Main navigation"`
- Dark mode toggle has `aria-label` containing "dark mode"
- Mobile menu button has `aria-expanded` and `aria-label` containing "menu"
- All `<img>` elements have `alt` attributes
- All external links (`target="_blank"`) have `rel="noopener"`
- Resume page has proper heading hierarchy (no skipped levels)

**Responsive Design** _(tested at 375px, 768px, 1280px)_

- No horizontal scrollbar at any viewport width
- Header is visible at all viewport sizes
- Footer is present at all viewport sizes

## Test Results Summary

| Suite         | Desktop Chrome | Mobile Chrome                    |
| ------------- | -------------- | -------------------------------- |
| Navigation    | 5 pass         | 5 pass, 4 skipped (desktop-only) |
| Pages         | 13 pass        | 13 pass                          |
| Dark Mode     | 8 pass         | 7 pass, 5 skipped (desktop-only) |
| Links         | 10 pass        | 10 pass                          |
| Accessibility | 16 pass        | 16 pass                          |
| **Total**     | **52 pass**    | **51 pass, 9 skipped**           |

## Adding New Tests

1. Create a new `.spec.ts` file in `tests/e2e/`
2. Import from `@playwright/test`:
   ```typescript
   import { test, expect } from "@playwright/test";
   ```
3. Use `test.describe()` to group related tests
4. Use `test.skip(({ isMobile }) => !!isMobile, 'reason')` for desktop-only tests
5. Run `npm run test:e2e` to verify

## Troubleshooting

**Tests fail with DNS errors**

- Ensure the site is deployed and accessible at the base URL
- Try running against local dev server instead

**Tests fail on CI**

- Ensure Playwright browsers are installed: `npx playwright install --with-deps chromium`
- Check that `PLAYWRIGHT_BROWSERS_PATH` is set if using cached browsers

**Flaky tests**

- Increase timeout in `playwright.config.ts` if needed
- Add `await page.waitForLoadState('networkidle')` before assertions if pages load slowly
