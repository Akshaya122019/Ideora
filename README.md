# Horizon Abroad — Premium Study Abroad Website

A 5-page, responsive, Bootstrap 5 + jQuery business website for a study-abroad
consultancy. Static HTML/CSS/JS — no build step, no backend required.

## Pages

| File            | Purpose                                                        |
|------------------|------------------------------------------------------------------|
| `index.html`     | Home — hero, about teaser, services, countries, why-us, stats, gallery, testimonials, FAQ, contact |
| `about.html`     | Company story, mission/vision, timeline, values |
| `services.html`  | Full service list with detail + process steps |
| `courses.html`   | Featured courses/programs by destination |
| `contact.html`   | Contact form, info, embedded map |

## Structure

```
studyabroad/
├── index.html
├── about.html
├── services.html
├── courses.html
├── contact.html
├── assets/
│   ├── css/style.css     ← all design tokens + component styles
│   ├── js/main.js        ← nav, reveal animations, counters, carousel,
│   │                        FAQ accordion, lightbox, form validation, dark mode
│   └── img/               ← empty — currently using hosted Unsplash images
└── README.md
```

## Tech used

- Bootstrap 5.3 (grid + utilities, via CDN)
- jQuery 3.7 (via CDN)
- Font Awesome 6.5 (icons, via CDN)
- Google Fonts: Fraunces (display) + Manrope (body)
- Vanilla CSS custom properties for theming — no preprocessor needed

No React, no npm install, no bundler. Open `index.html` in a browser, or
deploy the folder as-is.

## Design system

- **Colors** — deep navy (`--ink-900`), brass gold accent (`--gold-500`),
  cream background (`--cream-50`), teal secondary accent (`--teal-600`).
  All defined as CSS variables at the top of `style.css`.
- **Type** — Fraunces for headings, Manrope for body/UI.
- **Signature motif** — a dotted "flight path" arc (SVG), used in the hero
  background and the Countries section, standing in for the student's
  journey abroad.
- **Dark mode** — toggle in the navbar, remembered via `localStorage`.

## Customizing content

1. **Text** — every section's copy is plain HTML; edit directly in each
   `.html` file.
2. **Images** — currently pulling from Unsplash by URL for placeholders.
   Replace `src="https://images.unsplash.com/..."` with your own images in
   `assets/img/` and update the paths.
3. **Colors/fonts** — change the `:root` variables at the top of
   `assets/css/style.css`; every component references them, so a palette
   swap only needs edits in one place.
4. **Phone/WhatsApp/email** — search-and-replace `+916282607450` and
   `hello@horizonabroad.com` across all 5 HTML files (they're repeated in
   the floating buttons, footer, and contact sections).
5. **Map** — swap the Google Maps embed `src` in `contact.html` for your
   real address.
6. **Nav/footer links** — repeated per-page at the top/bottom of each
   HTML file (no templating, since there's no backend/build step).

## Known placeholders

- Contact form currently only validates and shows a success state client
  side — it does not actually send email. Wire it to a form backend
  (Formspree, Netlify Forms, EmailJS, etc.) before going live.
- WhatsApp/call numbers, map location, and social links are placeholders.
- Gallery, testimonial, and stats numbers are sample content — replace with
  real data before launch.

## Accessibility & performance notes

- Images use `loading="lazy"` where applicable.
- Keyboard-visible focus states are defined globally.
- `prefers-reduced-motion` is respected — animations are disabled for users
  who request it.
- Uses semantic headings and `aria-label`s on icon-only buttons.
- For a production Lighthouse pass: self-host the Google Fonts and Font
  Awesome files (or subset them) instead of pulling from CDNs, and replace
  the Unsplash placeholder images with optimized, properly-sized local
  assets.

See `DEPLOYMENT.md` for how to publish this to Netlify.
