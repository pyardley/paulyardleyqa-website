# QA Portfolio Website — Improved Plan & Implementation Guide

> **Author:** Paul Yardley  
> **Created:** 2026-03-22  
> **Status:** Draft  
> **Estimated effort:** 20–30 hours (phased over 4–6 weeks)

---

## 1. Improvements to the Original Recommendations

### 1.1 Architecture & Technology Choice

**Original suggestion:** "Astro, Next.js, or plain HTML + Tailwind"

**Improved recommendation — Astro + Tailwind CSS v4 + MDX:**

| Criterion                        | Astro | Next.js      | Plain HTML |
| -------------------------------- | ----- | ------------ | ---------- |
| Performance (zero JS by default) | ✅    | ❌           | ✅         |
| Markdown blog built-in           | ✅    | Needs plugin | ❌         |
| Static hosting (free)            | ✅    | ✅ (Vercel)  | ✅         |
| Interactive islands when needed  | ✅    | ✅           | ❌         |
| Learning curve for QA person     | Low   | Medium       | Lowest     |

**Verdict:** Astro is the best fit — ships zero JavaScript by default (great for performance scores you can brag about), has native Markdown/MDX content collections for the blog, and supports interactive islands (React/Svelte) only where needed (e.g., the skills matrix, dark mode toggle, interactive demo).

### 1.2 Content Strategy Improvements

**Original gap:** The recommendations list content sections but don't prioritise or phase them.

**Improved approach — launch in three phases:**

| Phase                                    | Sections                                                                                     | Target          |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- | --------------- |
| **Phase 1 — MVP (Week 1–2)**             | Hero, About, Resume (PDF download), Skills Matrix, Contact                                   | Get online fast |
| **Phase 2 — Differentiation (Week 3–4)** | Portfolio/Case Studies (start with 3), Blog (start with 2 articles)                          | Stand out       |
| **Phase 3 — Polish (Week 5–6)**          | Interactive demo, Certifications, Testimonials, remaining blog posts, "Test My Site" section | Delight         |

### 1.3 Portfolio / Case Studies — Stronger Framework

The original STAR-like format is good but missing a critical element for QA: **the testing strategy rationale**. Each case study should follow this improved template:

```
## [Project Name]
**Industry:** [e.g., Fintech] | **Role:** [e.g., Lead QA] | **Duration:** [e.g., 6 months]

### Context
Why was testing critical for this project? (1–2 sentences)

### Testing Strategy & Rationale
Why did you choose the tools/approach you did? What trade-offs were considered?
(This shows analytical thinking — interviewers love it.)

### Scope
- [ ] Manual exploratory
- [ ] Automation (UI / API / E2E)
- [ ] Performance
- [ ] Accessibility
- [ ] Security

### Tools & Frameworks
Cypress 13, Postman, k6, axe-core, GitHub Actions

### Challenges & How You Solved Them
Specific technical challenges — not generic filler.

### Results (Quantified)
- Regression time: 4 hours → 45 minutes (−81 %)
- Automation coverage: 12 % → 87 %
- Critical bugs caught pre-prod: 34

### Artefacts
- Screenshot / Allure report embed
- Link to public repo (if applicable)
- Loom walkthrough (2–3 min max)
```

### 1.4 Blog Topics — Refreshed for 2026

Some original topics feel dated. Improved list:

1. **"How I Cut Regression Time by 81 % with Playwright + GitHub Actions"** — Playwright has overtaken Cypress in mindshare by 2026; lead with it.
2. **"The 2026 Accessibility Testing Checklist (WCAG 2.2 + EN 301 549)"** — Include UK/EU legal context since you're UK-based.
3. **"AI-Assisted Test Generation: What Actually Works in 2026"** — Hands-on with Copilot, Amazon Q, and custom OpenAI scripts.
4. **"Testing 50 Microservices: Contract Testing with Pact Saved Us"** — More specific and useful than the original title.
5. **"My Postman-to-Playwright Migration Playbook"** — Practical, unique angle.
6. **"A QA's Guide to Observability: Using Grafana + OpenTelemetry to Debug Flaky Tests"** — Shows modern DevOps awareness.
7. **"Book Review: Lessons from 'Exploratory Software Testing' by James Whittaker"** — Evergreen authority content.
8. **"Building a Bug Bounty Habit: What I Learned Reporting Issues to Open-Source Projects"** — Great for credibility.

### 1.5 Interactive Demo — Improved Concept

**Original:** "A fake login page or calculator app visitors can break."

**Improved:** A **guided "Bug Safari"** experience:

- A purpose-built mini web app (to-do list or booking form) with **12 intentionally planted bugs** across categories (UI, logic, validation, accessibility, performance).
- Visitors try to find bugs and log them via a simplified bug report form.
- After submission, reveal the full list with your professional bug reports side-by-side.
- Gamification: "You found 8/12 — QA Apprentice!" / "12/12 — You're hired!"
- This is memorable, shareable, and demonstrates your testing taxonomy knowledge.

### 1.6 Performance & Accessibility as Proof

**Addition not in original:** Since you're a QA analyst, the website itself is your most visible test artefact. Commit to:

- **Lighthouse score ≥ 95** on all four categories (Performance, Accessibility, Best Practices, SEO) — display the badge in the footer.
- **WCAG 2.2 AA compliance** — verified with axe-core and manual screen reader testing.
- **Core Web Vitals passing** — LCP < 2.5s, INP < 200ms, CLS < 0.1.
- Document all of this in a public `/testing` page on the site (meta-testing!).

### 1.7 "Test My Site" Section — Enhanced

**Original:** "Add your own bug report template."

**Improved:** Create a full **QA transparency page** (`/quality`):

- Current Lighthouse scores (auto-updated via CI).
- Known issues backlog (public GitHub Issues).
- Bug report template (link to GitHub issue form).
- Test coverage summary: "This site is tested with: Playwright E2E (14 tests), axe-core accessibility scans, Lighthouse CI on every deploy."
- This is unprecedented for a personal site and will get attention.

---

## 2. Technical Architecture

```
qa-portfolio/
├── public/
│   ├── resume/
│   │   └── paul-yardley-cv-2026.pdf
│   ├── images/
│   │   ├── hero/
│   │   ├── projects/
│   │   └── certifications/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── SkillsMatrix.astro        # Interactive grid
│   │   ├── ProjectCard.astro
│   │   ├── BlogCard.astro
│   │   ├── ContactForm.astro
│   │   ├── DarkModeToggle.tsx         # React island
│   │   ├── BugCounter.tsx             # React island (animated)
│   │   └── BugSafari/                 # Interactive demo
│   │       ├── BugSafariApp.tsx
│   │       ├── BugReportForm.tsx
│   │       └── ResultsReveal.tsx
│   ├── content/
│   │   ├── blog/
│   │   │   ├── regression-time-playwright.mdx
│   │   │   ├── accessibility-checklist-2026.mdx
│   │   │   └── ...
│   │   ├── projects/
│   │   │   ├── ecommerce-e2e.mdx
│   │   │   ├── fintech-api-testing.mdx
│   │   │   ├── mobile-accessibility-audit.mdx
│   │   │   └── ...
│   │   └── config.ts                  # Astro content collections schema
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── BlogLayout.astro
│   │   └── ProjectLayout.astro
│   ├── pages/
│   │   ├── index.astro                # Hero + highlights
│   │   ├── about.astro
│   │   ├── resume.astro
│   │   ├── portfolio/
│   │   │   └── index.astro
│   │   ├── blog/
│   │   │   └── index.astro
│   │   ├── skills.astro
│   │   ├── certifications.astro
│   │   ├── quality.astro              # "Test My Site" / QA transparency
│   │   ├── contact.astro
│   │   └── bug-safari.astro           # Interactive demo
│   └── styles/
│       └── global.css                 # Tailwind base + custom tokens
├── tests/
│   ├── e2e/
│   │   ├── navigation.spec.ts         # Playwright E2E
│   │   ├── contact-form.spec.ts
│   │   ├── dark-mode.spec.ts
│   │   └── accessibility.spec.ts      # axe-core integration
│   └── lighthouse/
│       └── lighthouse.config.js
├── .github/
│   └── workflows/
│       ├── deploy.yml                 # Build + deploy to Netlify/Vercel
│       ├── lighthouse-ci.yml          # Lighthouse on every PR
│       └── accessibility-audit.yml    # axe-core CI check
├── astro.config.mjs
├── tailwind.config.mjs
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. Technology Stack

| Layer                  | Technology                               | Why                                                |
| ---------------------- | ---------------------------------------- | -------------------------------------------------- |
| Framework              | Astro 5.x                                | Zero-JS default, content collections, fast         |
| Styling                | Tailwind CSS v4                          | Utility-first, responsive, dark mode built-in      |
| Interactive components | React 19 (islands)                       | Only for dark mode toggle, bug counter, Bug Safari |
| Blog/content           | MDX via Astro Content Collections        | Write in Markdown, embed components                |
| Contact form           | Formspree or Netlify Forms               | No backend needed                                  |
| E2E testing            | Playwright                               | Demonstrate your skills                            |
| Accessibility          | axe-core + @axe-core/playwright          | Automated a11y checks                              |
| CI/CD                  | GitHub Actions                           | Free, widely used                                  |
| Hosting                | Netlify (free tier)                      | Auto-deploy from Git, form handling, redirects     |
| Domain                 | `paulyardley.dev` or `paulyardleyqa.com` | Professional, memorable                            |
| Analytics              | Plausible or Fathom (privacy-first)      | GDPR-friendly, no cookie banner needed             |

---

## 4. Implementation Plan

### Phase 1 — Foundation & MVP (Week 1–2, ~10 hours)

| #   | Task                                                                      | Est. Hours |
| --- | ------------------------------------------------------------------------- | ---------- |
| 1.1 | Purchase domain (`paulyardley.dev` or similar)                            | 0.5        |
| 1.2 | Scaffold Astro project with Tailwind CSS v4                               | 1          |
| 1.3 | Create `BaseLayout.astro` with responsive header/footer, dark mode toggle | 2          |
| 1.4 | Build Hero section (tagline, bio, CTA buttons, animated bug counter)      | 1.5        |
| 1.5 | Build About page (story, strengths, personal touch)                       | 1          |
| 1.6 | Build Resume page (web version + PDF download link)                       | 1          |
| 1.7 | Build Skills Matrix page (interactive grid with proficiency levels)       | 1.5        |
| 1.8 | Build Contact page (form + social links)                                  | 1          |
| 1.9 | Set up GitHub repo, Netlify deployment, custom domain DNS                 | 0.5        |

**Milestone:** Site is live with core pages. Shareable on LinkedIn.

### Phase 2 — Content & Differentiation (Week 3–4, ~10 hours)

| #   | Task                                                             | Est. Hours |
| --- | ---------------------------------------------------------------- | ---------- |
| 2.1 | Define Astro content collection schemas for blog + projects      | 1          |
| 2.2 | Write 3 portfolio case studies using the improved template above | 4          |
| 2.3 | Write 2 blog articles (start with highest-impact topics)         | 3          |
| 2.4 | Build Portfolio index page with filterable project cards         | 1          |
| 2.5 | Build Blog index page with date-sorted post list                 | 1          |

**Milestone:** Portfolio and blog sections populated. Site demonstrates depth.

### Phase 3 — Polish & Wow Factor (Week 5–6, ~10 hours)

| #   | Task                                                                         | Est. Hours |
| --- | ---------------------------------------------------------------------------- | ---------- |
| 3.1 | Build Bug Safari interactive demo                                            | 3          |
| 3.2 | Build Certifications page with digital badge links                           | 0.5        |
| 3.3 | Add testimonials section (request from colleagues/managers)                  | 0.5        |
| 3.4 | Build `/quality` page (Lighthouse scores, test summary, bug report template) | 1          |
| 3.5 | Write Playwright E2E tests (navigation, form, dark mode, a11y)               | 2          |
| 3.6 | Set up GitHub Actions: deploy, Lighthouse CI, accessibility audit            | 1.5        |
| 3.7 | Final cross-browser testing (Chrome, Firefox, Edge, Safari) + screen reader  | 1          |
| 3.8 | Add "Tested by the owner" footer note with Lighthouse badge                  | 0.5        |

**Milestone:** Polished, tested, differentiated site ready for job applications.

---

## 5. Design Principles

1. **Mobile-first responsive** — Design for 375px first, scale up.
2. **Minimal colour palette** — 2 brand colours + neutrals. Suggestion: deep navy (#1e293b) + accent teal (#14b8a6) on white/slate.
3. **Typography** — Inter or Geist for body, JetBrains Mono for code snippets.
4. **Whitespace** — Generous padding. Let the content breathe.
5. **Dark mode** — CSS `prefers-color-scheme` + manual toggle. Store preference in `localStorage`.
6. **Animations** — Subtle. `@view-transition` for page navigations (Astro supports this natively). Framer Motion for the bug counter.
7. **No layout shift** — Reserve space for images, use `aspect-ratio`.

---

## 6. SEO & Discoverability

- **Meta tags:** Unique `<title>` and `<meta description>` per page.
- **Open Graph / Twitter cards:** For sharing blog posts on LinkedIn/X.
- **Structured data:** `Person` schema on the homepage, `BlogPosting` schema on articles.
- **Sitemap:** Auto-generated by Astro's `@astrojs/sitemap` integration.
- **RSS feed:** For blog subscribers (Astro has built-in support).
- **Canonical URLs:** Prevent duplicate content if cross-posting to Medium/Dev.to.

---

## 7. Ongoing Maintenance (Post-Launch)

| Cadence         | Activity                                            |
| --------------- | --------------------------------------------------- |
| Every 4–6 weeks | Publish a new blog post                             |
| Quarterly       | Add a new case study or update existing ones        |
| Quarterly       | Update resume PDF and web version                   |
| Every 6 months  | Refresh skills matrix with new tools/certifications |
| On each deploy  | Automated Lighthouse + a11y checks via CI           |

---

## 8. Cost Summary

| Item                               | Cost                          |
| ---------------------------------- | ----------------------------- |
| Domain (`.dev` or `.com`)          | ~£10–15/year                  |
| Hosting (Netlify free tier)        | £0                            |
| Analytics (Plausible)              | ~£7/month (or self-host free) |
| Contact form (Formspree free tier) | £0                            |
| **Total Year 1**                   | **~£10–100**                  |

---

## 9. Success Metrics

| Metric                                         | Target (6 months post-launch) |
| ---------------------------------------------- | ----------------------------- |
| Lighthouse Performance score                   | ≥ 95                          |
| Lighthouse Accessibility score                 | ≥ 98                          |
| Blog posts published                           | ≥ 6                           |
| Case studies published                         | ≥ 4                           |
| Playwright E2E tests passing                   | ≥ 14                          |
| Inbound recruiter messages mentioning the site | ≥ 3                           |

---

## 10. Next Steps

1. **Decide on domain name** — check availability at Namecheap or Cloudflare Registrar.
2. **Scaffold the Astro project** — `npm create astro@latest qa-portfolio`.
3. **Set up GitHub repo** — with branch protection and the CI workflows.
4. **Start writing** — the About page and first case study are the highest-leverage content to draft first.
5. **Request testimonials** — reach out to 2–3 former colleagues/managers now (they take time to respond).
