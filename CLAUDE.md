# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for Global Steps NGO - an organization empowering communities in 25 countries through education, sustainable development, and collaborative action.

**Tech Stack:** Vanilla HTML5, CSS3, JavaScript (ES6+) - No build system or package manager.

## File Structure

```
global-steps/
  index.html           # Homepage (stays at root)
  css/
    styles.css         # Main stylesheet with design tokens
  js/
    main.js            # All JavaScript functionality
  pages/               # All other HTML pages
    about.html
    programs.html
    donate.html
    ... (13 more pages)
```

## Architecture

### Design System (css/styles.css)

CSS custom properties define the complete design token system:
- **Colors:** Primary forest green (#0d4a3e), accent amber (#f59e0b), warm neutrals
- **Spacing:** 4px-based scale (--sp-1 through --sp-10)
- **Typography:** Fraunces (display), Inter (body) via Google Fonts
- **Elevation:** 5 shadow levels including glow effects
- **Motion:** Defined easing and durations with reduced-motion support

### JavaScript (js/main.js)

Vanilla JS handles:
- Mobile navigation toggle with keyboard accessibility (arrow keys, escape, focus trap)
- Smooth scroll with header offset and reduced motion support
- Header scroll effect using requestAnimationFrame
- Form validation with loading states
- Toast notifications
- FAQ accordion with ARIA support
- IntersectionObserver animations with counter animation

### Path References

- From `index.html`: use `css/styles.css`, `js/main.js`, `pages/*.html`
- From `pages/*.html`: use `../css/styles.css`, `../js/main.js`, `../index.html`

## Development

No build commands - files are served directly. Use any local server:
```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve
```

## Key Patterns

- Semantic HTML with ARIA labels for accessibility
- Mobile-first responsive design with hamburger navigation
- Forms use client-side validation with loading states and toast feedback
- All interactive elements support keyboard navigation
- Skip-to-content link for screen readers
- Respects `prefers-reduced-motion` media query
- SEO: Open Graph tags, Twitter Cards, JSON-LD structured data on index.html
