# Phase 1 — Site Build & Polish

## Overview

Personal website for **Patricio Zenklussen** — journalist, cultural researcher, and writer. Ultra-minimalist design inspired by [p.cv](https://p.cv) (Paul Macgregor's site). Built with Astro, vanilla JS/TS, and CSS custom properties. No frameworks, no component libraries.

## Tech Stack

- **Astro 5.18** — static site generator with content collections
- **IBM Plex Mono** — sole typeface, self-hosted via `@fontsource`
- **Vanilla TypeScript** — all interactivity (animations, navigation, theme switching)
- **CSS Custom Properties** — theming system with 5 palettes
- **@astrojs/sitemap** + **@astrojs/rss** — SEO and syndication

## Architecture

### Single-Page App Feel

The site behaves like an SPA but is fully static. All content (blog posts, about text, CV) is rendered into hidden `<template>` elements at build time in `index.astro`. JavaScript clones and inserts these templates dynamically when the user navigates. No page reloads ever occur.

### 3-Column Layout

Inspired by Evernote's column navigation:

- **Col 1 (20%)** — Always visible. Navigation menu, identity block, social links, meta buttons. Static (no scroll).
- **Col 2 (20%)** — Content panels (About, CV, Blog, About This Site). Scrollable. Appears/disappears with slide animation.
- **Col 3 (flex: 1)** — Detail view (Extended About, Full CV, blog post content). Scrollable. Appears/disappears with slide animation.

Col 2 and Col 3 have `padding-top: 8.5rem` so their content starts at the same vertical height as the nav links in Col 1 (below the name/subtitle identity block).

### Navigation System (`src/scripts/navigation.ts`)

Central state machine managing which panels and details are visible. Key behaviors:

- **Opening sequence**: inside-out (Col 2 first, then Col 3)
- **Closing sequence**: outside-in (Col 3 first, then Col 2) — 200ms between steps
- **Panel switching**: if Col 3 is open and user switches panels, Col 3 closes first (200ms), then Col 2 content fades out/in (150ms each)
- **Content fades**: `#col-2-inner` and `#detail-content` have `transition: opacity 0.15s ease` for smooth cross-fades when switching content within a column
- **Column slides**: opening slides from left (`translateX(-6px) → 0`), closing slides to right (`0 → translateX(6px)`)
- **Rapid click handling**: `clearSequence()` cancels pending animation timers; `openColumn()` clears close timers

### Panel Type

```typescript
type Panel = 'about' | 'cv' | 'blog' | 'about-site' | null;
```

## File Structure

```
src/
├── content/
│   ├── blog/
│   │   ├── hello-world.md
│   │   └── on-curiosity.md
│   └── content.config.ts          # Blog schema with draft, category fields
├── layouts/
│   └── Base.astro                  # HTML shell, meta tags, OG, font imports
├── pages/
│   ├── index.astro                 # Main page (all panels, templates, scripts)
│   ├── 404.astro                   # Custom 404
│   └── rss.xml.ts                  # RSS feed endpoint
├── scripts/
│   ├── navigation.ts              # Column/panel state machine
│   ├── scramble.ts                # Subtitle rotation + name click easter egg
│   ├── theme.ts                   # Palette cycling with mini-scramble on label
│   └── contact.ts                 # Email obfuscation (char codes)
└── styles/
    └── global.css                 # Reset, palettes, layout, prose, responsive

public/
├── favicon.svg
├── og.svg                         # Open Graph image placeholder
└── robots.txt
```

## Color System

5 palettes, each with 5 variables. Switchable via `data-theme` attribute on `<html>`.

| Variable | Purpose | Applied to |
|---|---|---|
| `--bg` | Background | `body` |
| `--text` | Body text | `body`, `a`, inherited |
| `--text-heading` | Titles, bold, name | `.name`, `.panel-title`, `.post-title`, `.prose h1/h2/h3`, `.prose strong` |
| `--text-muted` | Metadata, subtitle, borders | `.text-muted`, borders, scrollbar |
| `--accent` | Interactive elements | `.read-more`, `.prose a`, `.filter-btn.active` |

### Palette Values

| Theme | `--bg` | `--text` | `--text-heading` | `--text-muted` | `--accent` |
|---|---|---|---|---|---|
| Cyan | `#0a0f14` | `#5de4c7` | `#e2f5ef` | `#2a5e50` | `#88c0d0` |
| Amber | `#1a1409` | `#ffb627` | `#fff1d0` | `#6b5a2a` | `#e07850` |
| Matrix | `#0d1208` | `#00ff41` | `#b8ffcc` | `#1a5c2a` | `#50e8c0` |
| Lavender | `#f0eef6` | `#5b4a9e` | `#2e2066` | `#7b6daa` | `#a8467a` |
| Paper | `#f5f1eb` | `#2c2c2c` | `#1a1a1a` | `#7a7267` | `#a63d2f` |

## Content Sections

### About (Col 2 → Col 3)

- **Col 2**: Short bio — "Argentine-born, Chilean-raised, Globally-educated. Journalist, cultural researcher, and writer..." with two action links: "READ MORE →" (opens Extended About) and "CV →" (opens Full CV)
- **Col 3 (Extended About)**: Full personal statement covering background, methodology, art/music practice, the central question about mediation between art and publics, work philosophy, ROMPÉ EL VIDRIO publication

### CV (Col 2 → Col 3)

- **Col 2**: Profile summary — NYU MA (4.0 GPA), UAI BA, El Mercurio, Tokyo fieldwork. Link: "FULL CV →"
- **Col 3 (Full CV)**: Education (4 entries), Experience (3 positions), Skills (6 categories: Writing & Research, Photography, Audio & Music, Video & AV, Design, Languages)

### Blog (Col 2 → Col 3)

- **Col 2**: Category filter bar (ALL / NOTES / FICTION / IMAGE / LISTS) + post list with date and category metadata
- **Col 3**: Full blog post content rendered from Markdown
- Content collection schema includes `draft` field — drafts hidden in production, visible in dev
- Dates formatted as "MAR 10, 2026" style
- Categories defined in frontmatter: `notes`, `fiction`, `image`, `lists`
- User writes in Obsidian; posts are `.md` files in `src/content/blog/`

### About This Site (Col 2 only)

Tribute to Paul Macgregor / p.cv as design inspiration. Built with Astro, set in IBM Plex Mono.

## Animations & Interactions

| Feature | Implementation |
|---|---|
| Entry fade-in | CSS `@keyframes colFadeIn` on `.col-1` (0.5s) |
| Column open | `translateX(-6px) → 0` + opacity, 200ms `ease-out` |
| Column close | `translateX(0) → 6px` + opacity, 200ms `ease-in` |
| Content cross-fade | `#col-2-inner` / `#detail-content` opacity 0→1, 150ms |
| Hover states | `translateX(2px)` + `opacity: 0.7` on links, buttons, post items |
| Subtitle scramble | Airport split-flap effect cycling through: RESEARCHER / LISTENER / LEARNER / WRITER / PHOTOGRAPHER / READER / WATCHER |
| Theme label scramble | 5 random character cycles (~200ms) before settling on new theme name |
| Name easter egg | Click "PATRICIO ZENKLUSSEN" 5 times total → "YOU LIKE CLICKING, DON'T YOU?" for 10 seconds |
| Email obfuscation | Character codes assembled at click time to prevent bot scraping |

## Accessibility

- ARIA labels on all interactive buttons (theme toggle, back buttons, filters, contact)
- `role="region"` on Col 2 and Col 3
- `aria-hidden="true"` on scramble subtitle + `.sr-only` span with `aria-live="polite"` for screen readers
- Focus management: panel titles receive focus on open (`preventScroll: true`)
- `.sr-only` utility class for visually hidden but accessible content
- `focus-visible` outlines on all interactive elements

## SEO & Infrastructure

- Open Graph + Twitter Card meta tags in `Base.astro` (dynamic title, description, og:image)
- Sitemap via `@astrojs/sitemap` (site: `https://patriciozenklussen.com`)
- RSS feed at `/rss.xml` via `@astrojs/rss`
- `robots.txt` allowing all crawlers
- OG image placeholder at `public/og.svg`
- `@fontsource` handles `font-display: swap` automatically

## Responsive (Mobile)

- Columns stack vertically at `max-width: 768px`
- Back buttons appear on mobile (hidden on desktop)
- `padding-top` resets to `2.5rem` for Col 2/3
- `overflow-y: auto` on all columns
- `fadeIn` animation with slide on column appearance

## Git History

```
0f25de0  feat: expanded color palettes with heading and accent tones
b45d6fc  feat: polished animation system and layout alignment
9aab628  feat: animations, accessibility, SEO, and infrastructure
4fc0f06  Initial commit: complete site rebuild
```

(Plus uncommitted changes: CV section, updated About/Extended About copy)

## Pending Tasks

- **D4**: Image pipeline — configure `astro:assets` for optimization
- **E1**: Create GitHub repo and push
- **E2**: Configure automatic deploy (Cloudflare Pages recommended for LATAM/USA/Japan coverage)
- Mobile testing and refinement
- Production OG image (replace SVG placeholder)
- Real blog content migration from Substack

## Design Principles

1. **Ultra-minimal**: monospace only, no decorative elements, no images in layout
2. **Buttery smooth**: every content change has a fade transition, never instant snaps
3. **Sequential animations**: columns open inside-out (1→2→3), close outside-in (3→2→1)
4. **Consistent hierarchy**: 4-level color system (heading → text → muted → accent)
5. **Static feel**: Col 1 never moves, only Col 2/3 respond to interaction
6. **SPA without SPA**: all content pre-rendered, zero client-side fetching

## Key Decisions

- **No router**: navigation is purely DOM manipulation with templates
- **No CSS framework**: everything hand-written for full control
- **Content in templates**: blog posts and long texts are `<template>` elements cloned on demand
- **Cloudflare Pages**: recommended hosting for global edge coverage (300+ locations including Tokyo, Santiago, Buenos Aires, multiple US cities) at $0/month + ~$10/year domain
