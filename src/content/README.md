# Content Guide — Portfolio & Blog

This guide explains how to add new portfolio case studies and blog posts to the paulyardleyqa.co.uk website.

## Quick Start

1. Create a new `.mdx` file in the appropriate directory
2. Add the required frontmatter
3. Write your content in Markdown/MDX
4. Run `npm run dev` to preview at http://localhost:4321
5. Commit and push to deploy

---

## Adding a Blog Post

### 1. Create the file

Create a new `.mdx` file in `src/content/blog/`:

```
src/content/blog/your-post-slug.mdx
```

The filename becomes the URL slug: `your-post-slug` → `/blog/your-post-slug`

### 2. Add frontmatter

Every blog post requires this frontmatter at the top of the file:

```yaml
---
title: "Your Post Title"
description: "A brief description for SEO and the blog listing card (1-2 sentences)."
pubDate: 2026-03-24
author: "Paul Yardley"
tags: ["Tag1", "Tag2", "Tag3"]
readingTime: "5 min read"
---
```

#### Required fields

| Field         | Type   | Description                               |
| ------------- | ------ | ----------------------------------------- |
| `title`       | string | The post title (displayed as h1)          |
| `description` | string | Short description for cards and meta tags |
| `pubDate`     | date   | Publication date (YYYY-MM-DD format)      |

#### Optional fields

| Field         | Type     | Default        | Description                                       |
| ------------- | -------- | -------------- | ------------------------------------------------- |
| `author`      | string   | "Paul Yardley" | Author name                                       |
| `tags`        | string[] | []             | Tags displayed on the card and post header        |
| `readingTime` | string   | —              | e.g., "5 min read"                                |
| `updatedDate` | date     | —              | Shows "Updated: ..." on the post                  |
| `draft`       | boolean  | false          | Set to `true` to hide from listing (still builds) |

### 3. Write content

Write your post using standard Markdown:

````markdown
This is the introduction paragraph.

## Section Heading

Regular paragraph text with **bold** and _italic_.

### Subsection

- Bullet point 1
- Bullet point 2

````javascript
// Code blocks with syntax highlighting
const greeting = "Hello, QA world!";
```​

| Column 1 | Column 2 |
|----------|----------|
| Data     | Data     |

> Blockquote for emphasis
````
````

### 4. MDX-specific notes

Since files are `.mdx`, be aware of these differences from standard Markdown:

- **Escape `<` in text** — Use `&lt;` instead of `<` when it appears outside code blocks (e.g., `&lt;1%` instead of `<1%`)
- **Curly braces `{}`** — These are interpreted as JSX expressions. Use `{'{'}` to display a literal `{`
- **You can import components** — MDX supports importing and using Astro/React components within posts

### 5. Example blog post

````mdx
---
title: "Getting Started with Playwright"
description: "A beginner's guide to setting up Playwright for E2E testing."
pubDate: 2026-04-01
tags: ["Playwright", "Testing", "Tutorial"]
readingTime: "6 min read"
---

Playwright is a powerful E2E testing framework...

## Installation

````bash
npm init playwright@latest
```​

## Writing Your First Test

```typescript
import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My App/);
});
```​

## Summary

Playwright makes E2E testing straightforward...
````
````

---

## Adding a Portfolio Case Study

### 1. Create the file

Create a new `.mdx` file in `src/content/projects/`:

```
src/content/projects/your-project-slug.mdx
```

The filename becomes the URL slug: `your-project-slug` → `/portfolio/your-project-slug`

### 2. Add frontmatter

Every case study requires this frontmatter:

```yaml
---
title: "Project Title"
description: "Brief description for the portfolio card and SEO (1-2 sentences)."
industry: "E-Commerce"
role: "Senior Test Analyst"
duration: "6 months"
tools: ["Playwright", "TypeScript", "GitHub Actions"]
scope: ["Automation (UI / API / E2E)", "Performance", "Accessibility"]
order: 1
results:
  - metric: "Regression Time"
    value: "4 hours → 45 min"
  - metric: "Coverage"
    value: "12% → 87%"
---
```

#### Required fields

| Field         | Type   | Description                                 |
| ------------- | ------ | ------------------------------------------- |
| `title`       | string | Project name                                |
| `description` | string | Short description for cards and meta        |
| `industry`    | string | e.g., "E-Commerce", "Fintech", "Healthcare" |
| `role`        | string | Your role on the project                    |
| `duration`    | string | e.g., "6 months", "3 months"                |

#### Optional fields

| Field     | Type     | Default | Description                                      |
| --------- | -------- | ------- | ------------------------------------------------ |
| `tools`   | string[] | []      | Technologies and tools used                      |
| `scope`   | string[] | []      | Testing types (displayed as badges)              |
| `order`   | number   | 0       | Sort order on the portfolio page (lower = first) |
| `results` | object[] | —       | Key metrics shown in the results card            |
| `draft`   | boolean  | false   | Set to `true` to hide from listing               |

#### Results format

Each result is an object with `metric` and `value`:

```yaml
results:
  - metric: "Regression Time"
    value: "4 hours → 45 minutes (−81%)"
  - metric: "Automation Coverage"
    value: "12% → 87%"
  - metric: "Bugs Caught"
    value: "34 pre-production"
  - metric: "Release Frequency"
    value: "Weekly (was fortnightly)"
```

Up to 4 results are shown in the header card. The first 3 are shown on the portfolio listing page.

### 3. Write the case study content

Follow this recommended structure:

```markdown
## Context

Why was testing critical for this project? (1-2 paragraphs)

## Testing Strategy & Rationale

Why did you choose the tools/approach? What trade-offs were considered?
(This shows analytical thinking — interviewers love it.)

## Scope

Detailed breakdown of what was tested.

## Challenges & How I Solved Them

### Challenge 1: [Specific Technical Challenge]

Description of the problem...

**Solution:** How you solved it...

### Challenge 2: [Another Challenge]

...

## Results

| Metric | Before | After | Improvement |
| ------ | ------ | ----- | ----------- |
| ...    | ...    | ...   | ...         |

## Key Takeaways

1. **Lesson 1** — What you learned...
2. **Lesson 2** — What you'd do differently...
```

### 4. Example case study

```mdx
---
title: "API Testing for Fintech Platform"
description: "Implemented contract testing with Pact for 50+ microservices."
industry: "Fintech"
role: "QA Lead"
duration: "4 months"
tools: ["Pact", "Postman", "Newman", "GitHub Actions"]
scope: ["API Contract Testing", "Integration Testing"]
order: 2
results:
  - metric: "API Coverage"
    value: "0% → 94%"
  - metric: "Integration Bugs"
    value: "−67%"
---

## Context

The fintech platform comprised 50+ microservices...

## Testing Strategy & Rationale

I chose Pact for consumer-driven contract testing because...

## Results

| Metric            | Before   | After   |
| ----------------- | -------- | ------- |
| API test coverage | 0%       | 94%     |
| Integration bugs  | 12/month | 4/month |
```

---

## Sorting & Display

### Blog posts

- Sorted by `pubDate` (newest first) on the blog listing page
- All non-draft posts are displayed

### Portfolio projects

- Sorted by `order` field (lowest first) on the portfolio listing page
- Set `order: 1` for your most impressive project

---

## Drafts

Set `draft: true` in the frontmatter to hide a post/project from the listing pages:

```yaml
---
title: "Work in Progress"
draft: true
---
```

Draft content still builds (so you can preview it at its direct URL), but it won't appear on the blog or portfolio listing pages.

---

## Previewing Locally

```bash
npm run dev
```

Then visit:

- Blog listing: http://localhost:4321/blog
- Blog post: http://localhost:4321/blog/your-post-slug
- Portfolio listing: http://localhost:4321/portfolio
- Case study: http://localhost:4321/portfolio/your-project-slug
