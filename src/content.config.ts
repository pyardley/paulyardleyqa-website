import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Paul Yardley"),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    readingTime: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    industry: z.string(),
    role: z.string(),
    duration: z.string(),
    tools: z.array(z.string()).default([]),
    scope: z.array(z.string()).default([]),
    order: z.number().default(0),
    draft: z.boolean().default(false),
    results: z
      .array(
        z.object({
          metric: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
  }),
});

export const collections = { blog, projects };
