# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JavaScript website for JDI SA (jdisa.org), a Jewish democratic non-profit in South Africa. No build tools, no framework, no dependencies — plain files deployable via Netlify drag-and-drop or FTP.

## Deployment

No build step. Deploy by uploading the entire folder to hosting:
- **Netlify**: Drag & drop at app.netlify.com
- **Traditional hosting**: FTP upload to jdisa.org hosting account

## Architecture

### File Structure

```
index.html                # Home page
pages/                    # Inner pages (about, statements, campaigns, media, etc.)
statements/               # Individual statement pages (.html) and source documents (.pdf)
css/main.css              # Single stylesheet — all styles live here
js/main.js                # Single JS file — all interactivity lives here
images/                   # Assets (currently just jdilogo.png)
WEBSITE-GUIDE.md          # Content editor manual
```

### Path Conventions

Links and asset paths are **relative**, so they differ by depth:
- From `index.html`: `pages/about.html`, `images/jdilogo.png`, `css/main.css`
- From `pages/*.html`: `../index.html`, `../images/jdilogo.png`, `../css/main.css`
- From `statements/*.html`: `../index.html`, `../pages/statements.html`

### CSS Design System (`css/main.css`)

All design tokens are CSS custom properties on `:root`:
- `--color-primary: #1a3a6b` — democratic blue
- `--color-gold: #c8a84b` — Jewish gold accent
- `--color-green: #2d6a4f` — South African green
- `--color-bg-dark: #0f2040` — dark section backgrounds
- `--font-sans: Inter`, `--font-serif: Playfair Display` (Google Fonts)
- `--max-width: 1200px`, `--nav-height: 72px`
- Shadow and border-radius scales: `--shadow-sm/md/lg`, `--radius-sm/md/lg/xl`

Layout utilities: `.grid-2`, `.grid-3`, `.grid-4` (CSS Grid), `.flex`, `.flex-center`, `.flex-between`.

### JavaScript (`js/main.js`)

Vanilla JS handling:
- Mobile nav hamburger toggle
- Active nav link detection by current `window.location`
- Donation amount selector buttons
- Content filtering via `data-category` and `data-filter` attributes
- Search via `data-searchable` attribute
- Form submissions (client-side only — shows "Thank you" state; no backend)
- Scroll animations via `IntersectionObserver` on `.animate-on-scroll` elements
- Navbar shadow on scroll

### Page Template Pattern

All pages share the same structure: fixed navbar → hero with breadcrumb → content sections → footer. Copy an existing page when adding new ones.

### Content Patterns

| Content type | Element class | Location |
|---|---|---|
| News/media cards | `.card` | `pages/media.html` |
| Statement list items | `.statement-item` | `pages/statements.html` |
| Campaign cards | `.campaign-card` | `pages/campaigns.html` |
| Core value pillars | `.pillar` | `pages/about.html` |

Filtering is driven by `data-category` on items and `data-filter` on filter buttons — no JS changes needed when adding new items, just match the existing category strings.

### Forms

All forms are client-side only. For real submissions, integrate Formspree (action URL on `<form>`) or Mailchimp (see WEBSITE-GUIDE.md for details).
