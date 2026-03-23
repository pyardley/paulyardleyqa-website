# Cypress E2E Test Suite

End-to-end tests for [paulyardleyqa.co.uk](https://paulyardleyqa.co.uk) using [Cypress](https://www.cypress.io/).

## Prerequisites

- Node.js >= 22.12.0
- Cypress installed (`npm install` will handle this)

```bash
npm install
```

## Running Tests

### Headless mode (all tests)

```bash
npm run test:cypress
```

### Interactive mode (Cypress Test Runner UI)

```bash
npm run test:cypress:open
```

### Run a specific test file

```bash
npx cypress run --config-file cypress.config.cjs --spec "tests/cypress/e2e/navigation.cy.js"
```

### Run against a different URL

```bash
CYPRESS_BASE_URL=http://localhost:4321 npm run test:cypress
```

### Run against local dev server

```bash
npm run dev
# In another terminal:
CYPRESS_BASE_URL=http://localhost:4321 npm run test:cypress:open
```

## Configuration

The configuration is in [`cypress.config.cjs`](../../cypress.config.cjs):

| Setting                | Value                                                            |
| ---------------------- | ---------------------------------------------------------------- |
| **Base URL**           | `https://paulyardleyqa.co.uk` (override with `CYPRESS_BASE_URL`) |
| **Spec pattern**       | `tests/cypress/e2e/**/*.cy.{js,ts}`                              |
| **Default viewport**   | 1280 x 720                                                       |
| **Command timeout**    | 10 seconds                                                       |
| **Retries (run mode)** | 2                                                                |
| **Video**              | Disabled                                                         |
| **Screenshots**        | On failure only                                                  |

## Test Suites

### [`navigation.cy.js`](e2e/navigation.cy.js) — Navigation (15 tests)

**Desktop Navigation** (1280x720)

- Displays the site logo linking to home
- Displays all 7 navigation links in desktop nav
- Navigates to each page when links are clicked
- Highlights the active page with teal styling
- Does not highlight inactive pages
- Has a sticky header

**Mobile Navigation** (375x667)

- Shows hamburger menu button on mobile
- Hides desktop navigation on mobile
- Opens mobile menu when hamburger is clicked
- Closes mobile menu on second click
- Displays all navigation links in mobile menu
- Navigates when mobile menu link is clicked
- Displays dark mode toggle in mobile menu

### [`pages.cy.js`](e2e/pages.cy.js) — Page Content (28 tests)

**Homepage** (8 tests)

- Correct title, hero section, meta description, OG tags, Twitter cards, canonical URL, CTA buttons

**About Page** (4 tests)

- Title, heading, professional background, LinkedIn link

**Skills Page** (5 tests)

- Title, heading, skill categories, individual skills, proficiency levels

**Portfolio Page** (3 tests)

- Title, heading, portfolio description

**Blog Page** (2 tests)

- Title, heading

**Resume Page** (8 tests)

- Title, heading, PDF download link, Professional Profile, Technical Skills, skill categories, work experience, education

**Contact Page** (2 tests)

- Title, "Get In Touch" heading

### [`dark-mode.cy.js`](e2e/dark-mode.cy.js) — Dark Mode (16 tests)

**Desktop Toggle** (10 tests)

- Light mode default with localStorage, dark mode default with localStorage
- Toggle to dark mode, toggle back to light
- Save preferences to localStorage
- Persist across page navigation
- Moon icon in light mode, sun icon in dark mode

**Mobile Toggle** (5 tests)

- "Switch to Dark Mode" text in light mode
- "Switch to Light Mode" text in dark mode
- Toggle dark mode via mobile menu
- Close mobile menu after toggling
- Update localStorage via mobile toggle

**Visual Contrast** (3 tests)

- Light background in light mode (`rgb(255, 255, 255)`)
- Dark background in dark mode (RGB < 50)
- Header background changes between modes

### [`links.cy.js`](e2e/links.cy.js) — Links & Footer (13 tests)

**Footer Links** (6 tests)

- All quick links in correct order, Contact Me link, LinkedIn URL, GitHub URL, copyright, footer logo

**Dead Link Detection** (7 tests)

- Scans all 7 pages for internal links, verifies each returns HTTP < 400

**PDF Download** (1 test)

- Resume PDF accessible with correct content type

**External Links** (1 test)

- All `target="_blank"` links have `rel="noopener"`

### [`accessibility.cy.js`](e2e/accessibility.cy.js) — Accessibility & Responsive (40 tests)

**All Pages** (28 tests — 4 per page)

- `lang="en"` on `<html>`, at most one `<h1>`, non-empty title, meta description

**Global Elements** (8 tests)

- Skip-to-content link, main content landmark, navigation landmark
- ARIA attributes on dark mode toggle and mobile menu button
- Alt text on all images, `noopener` on external links

**Heading Hierarchy** (1 test)

- Resume page has proper heading hierarchy (no skipped levels)

**Responsive Design** (11 tests)

- No horizontal scroll at Mobile/Tablet/Desktop viewports
- Header and footer visible at all sizes
- Mobile menu button visible only on mobile
- Desktop nav visible only on desktop

## Custom Commands

Defined in [`support/e2e.js`](support/e2e.js):

| Command                     | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| `cy.setLightMode()`         | Sets localStorage to 'light' and removes `.dark` class |
| `cy.setDarkMode()`          | Sets localStorage to 'dark' and adds `.dark` class     |
| `cy.checkNoConsoleErrors()` | Spies on `console.error` for monitoring                |

## Differences from Playwright Suite

Both test suites cover similar functionality but use different APIs:

| Feature             | Cypress                                    | Playwright                                          |
| ------------------- | ------------------------------------------ | --------------------------------------------------- |
| **Syntax**          | jQuery-like chaining (`cy.get().should()`) | Async/await (`await expect(locator).toBeVisible()`) |
| **Browsers**        | Chrome, Firefox, Edge, Electron            | Chromium, Firefox, WebKit                           |
| **Mobile testing**  | `cy.viewport()` resizing                   | Separate project with device emulation              |
| **Custom commands** | `Cypress.Commands.add()`                   | Page object model                                   |
| **Test runner**     | Interactive GUI with time travel           | VS Code extension or HTML report                    |
| **Retries**         | Built-in per-test retries                  | Configurable retries                                |

## Known Issues

### Windows 11 Insider Build Compatibility

Cypress has a known issue with Windows 11 Insider/Dev builds (26200+). The `Cypress.exe` binary fails with `bad option: --smoke-test`. This affects all Cypress versions (13.x and 15.x).

**Workarounds:**

- Run tests in GitHub Actions CI (Ubuntu runners work fine)
- Use WSL2 to run Cypress locally
- Wait for Cypress to update their Electron binary for Windows 11 26200+

## Adding New Tests

1. Create a new `.cy.js` file in `tests/cypress/e2e/`
2. Add `/// <reference types="cypress" />` at the top for IntelliSense
3. Use `describe()` and `it()` for test structure
4. Use `cy.visit()`, `cy.get()`, `cy.contains()`, `cy.should()` for assertions
5. Run `npm run test:cypress` to verify
