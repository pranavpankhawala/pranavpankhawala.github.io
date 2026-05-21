# Pranav Pankhawala — Portfolio

Personal portfolio website for Pranav Pankhawala, AI Automation & Cybersecurity Engineer.

Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

## File structure

```
pranavpankhawala.github.io/
├── index.html      # Markup and page structure
├── index.css       # All styles and design tokens (8 color palettes, dark mode)
├── index.js        # Interactive behaviour (theme, palette, nav, filters, command palette)
└── resume.pdf      # Downloadable resume
```

## Features

- **8 color palettes** — Forest (default), Slate, Ember, Plum, Crimson, Ocean, Sand, Mono
- **Dark / light mode** — respects `prefers-color-scheme`, persisted via `localStorage`
- **Command palette** — `⌘K` / `Ctrl+K` for keyboard-driven navigation
- **Project filter** — filter by AI / Vision or Security
- **Grid / list view toggle** for the projects section
- **Scroll-reveal animations** via `IntersectionObserver`
- **Sticky nav** with mobile hamburger menu
- **Copy email** button with toast feedback
- **Responsive** — works on mobile, tablet, and desktop

## Sections

1. Hero
2. About
3. Work experience & education
4. Capabilities
5. Projects
6. Publications
7. Contact

## Deployment

The site is hosted on GitHub Pages at `pranavpankhawala.github.io`.

Any push to `main` deploys automatically.

## Local development

No build tool required — open `index.html` directly in a browser, or serve with any static file server:

```bash
python3 -m http.server
```

## Contact

**Pranav Pankhawala**
- Email: pranav.pankhawala@gmail.com
- GitHub: [github.com/pranavpankhawala](https://github.com/pranavpankhawala)
- LinkedIn: [linkedin.com/in/pranavpankhawala](https://linkedin.com/in/pranavpankhawala)
