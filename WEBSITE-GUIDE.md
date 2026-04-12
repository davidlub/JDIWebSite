# JDI SA Website — Editor's Guide

## Folder Structure

```
NewWebsite/
├── index.html          ← Home page
├── css/
│   └── main.css        ← All styles (edit colours/fonts here)
├── js/
│   └── main.js         ← Interactive behaviour
├── images/             ← Place images here
│   └── (add .jpg/.png files here)
├── pages/
│   ├── about.html      ← About Us
│   ├── statements.html ← Official Statements
│   ├── media.html      ← News & Media / Blog
│   ├── campaigns.html  ← Active Campaigns + Petition forms
│   ├── get-involved.html ← Membership, Volunteer, Events, Contact
│   ├── donate.html     ← Donation page
│   ├── newsletter.html ← Newsletter signup
│   └── partners.html   ← Partner Organisations
└── WEBSITE-GUIDE.md    ← This file
```

---

## How to Update Content

### Adding a New Statement
Open `pages/statements.html` and copy this block, pasting it inside the relevant year section:

```html
<div class="statement-item" data-searchable data-category="CATEGORY">
  <div class="statement-date">Month YYYY</div>
  <div class="statement-body">
    <span class="card-tag">CATEGORY LABEL</span>
    <h3>YOUR STATEMENT TITLE</h3>
    <p>Summary of the statement...</p>
    <a href="#" class="read-more">Read Full Statement →</a>
  </div>
</div>
```

**Available categories** (for the `data-category` attribute):
- `gaza` — Gaza & Conflict
- `occupation` — Occupation
- `south-africa` — South Africa
- `human-rights` — Human Rights
- `community` — Community

---

### Adding a News/Media Article
Open `pages/media.html` and paste inside the `.grid-3` div:

```html
<article class="card" data-category="CATEGORY" data-searchable>
  <div class="card-img-placeholder" style="background:linear-gradient(135deg,#1a3a6b,#2a5298);">
    <span style="font-size:3rem;">📰</span>
  </div>
  <div class="card-body">
    <span class="card-tag">CATEGORY</span>
    <div class="meta"><span>DD Mon YYYY</span><span class="sep">•</span><span>X min read</span></div>
    <h3>ARTICLE TITLE</h3>
    <p>Short summary...</p>
    <a href="#" class="read-more">Read More →</a>
  </div>
</article>
```

**Categories:** `opinion`, `report`, `media`, `event`, `community`

To use a real photo instead of the placeholder icon:
```html
<img src="../images/your-photo.jpg" alt="Description" class="card-img" />
```

---

### Adding an Event
Open `pages/get-involved.html`, find the events section, and paste:

```html
<div class="card card-body" style="display:grid;grid-template-columns:100px 1fr;gap:2rem;align-items:center;">
  <div style="text-align:center;background:var(--color-primary);color:#fff;border-radius:var(--radius-sm);padding:1rem;">
    <div style="font-size:1.8rem;font-weight:700;font-family:var(--font-serif);">DD</div>
    <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;opacity:.8;">MON YYYY</div>
  </div>
  <div>
    <span class="card-tag">TYPE</span>
    <h3>EVENT TITLE</h3>
    <p>Description...</p>
    <p style="font-size:.85rem;color:var(--color-text-muted);">🕖 TIME SAST · LOCATION · PRICE</p>
    <a href="#contact" class="btn btn-outline btn-sm mt-1">RSVP</a>
  </div>
</div>
```

---

## Colours

Edit in `css/main.css` at the top (`:root` section):

| Variable | Value | Used for |
|---|---|---|
| `--color-primary` | `#1a3a6b` | Deep blue — main brand colour |
| `--color-gold` | `#c8a84b` | Gold — accents, CTAs |
| `--color-green` | `#2d6a4f` | Green — South Africa tags |
| `--color-bg-dark` | `#0f2040` | Dark backgrounds (hero, footer) |

---

## Images

1. Add image files to the `images/` folder
2. Reference them in HTML as:
   - From `index.html`: `images/your-file.jpg`
   - From `pages/*.html`: `../images/your-file.jpg`

For a card image, replace the `card-img-placeholder` div with:
```html
<img src="../images/your-photo.jpg" alt="Descriptive text" class="card-img" />
```

---

## Adding Real Links / External URLs

- Replace all `href="#"` placeholders with real URLs
- For external links, add `target="_blank" rel="noopener noreferrer"`

---

## Social Media Links

In each footer, find the three `.social-link` elements and add real URLs:
```html
<a href="https://www.facebook.com/YOURPAGE" class="social-link" target="_blank" rel="noopener noreferrer">f</a>
<a href="https://twitter.com/YOURHANDLE"    class="social-link" target="_blank" rel="noopener noreferrer">𝕏</a>
<a href="https://instagram.com/YOURHANDLE" class="social-link" target="_blank" rel="noopener noreferrer">▣</a>
```

---

## Making the Forms Work

The forms currently show a "Thank you" confirmation in the browser. To send emails or save data, you will need to:

**Option A — Free: Formspree**
1. Sign up at formspree.io
2. Add `action="https://formspree.io/f/YOUR_ID" method="POST"` to each `<form>` tag
3. Remove the `class="jdi-form"` from forms that should submit for real
4. Remove the JS form-intercept for those forms in `js/main.js`

**Option B — Mailchimp newsletter**
Replace the newsletter form action with your Mailchimp embed code.

**Option C — Full CMS (recommended for long term)**
Migrate content into a CMS like WordPress, Webflow, or Squarespace using this design as the template.

---

## Publishing the Website

**Option A: Simple (no backend needed)**
Upload the entire `NewWebsite/` folder to any static web host:
- Netlify (free): drag & drop the folder at app.netlify.com
- GitHub Pages (free): push to a GitHub repo
- Your existing hosting: upload via FTP

**Option B: Replace existing site**
Upload these files to your current jdisa.org hosting account, replacing the existing files.

---

*Website designed April 2025.*
