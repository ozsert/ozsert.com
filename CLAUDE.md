# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Workflow

This is a **pure static website** with no build system, bundlers, or preprocessing. All files are served directly - just open `index.html` in a browser or use a simple static server:

```bash
# Serve locally (if you have Python)
python -m http.server 8000

# Or use any static server
npx serve .
```

## Architecture Overview

**Core Structure:**
- 5 main HTML pages (index, about, topics, blog, contact)
- Single CSS file with CSS custom properties and modern features
- Vanilla JavaScript with i18next for internationalization
- No package.json or build dependencies

**Key Technical Decisions:**
- Client-side internationalization using i18next (loaded via CDN)
- Language preference stored in localStorage with dynamic HTML lang switching
- RSS feed integration via RSS2JSON API for latest AI content
- Pure CSS animations using Intersection Observer for performance

## Internationalization System

The site uses a sophisticated i18next setup:

**Default Language:** Turkish (tr) with English (en) support
**Translation Files:** `/locales/tr.json` and `/locales/en.json`

**Key Translation Patterns:**
- `data-i18n="key"` for text content
- `data-i18n="[content]key"` for meta descriptions
- Email addresses constructed from translated parts for anti-spam
- Translation keys organized by sections: `common_header`, `common_banner`, `index`, `about`, etc.

**When adding new translatable content:**
1. Add the translation key to both tr.json and en.json
2. Use `data-i18n="section.key"` in HTML
3. Test language switching functionality

## JavaScript Functionality

**Main Features in script.js:**
- **Translation Management** - Dynamic language switching with localStorage persistence
- **AI Credits Banner** - Hover effects and scroll-based animations
- **RSS Feed Integration** - Fetches content from Substack using RSS2JSON API
- **Modal System** - Topic detail modals with keyboard navigation (Escape key)
- **Carousel Navigation** - Dot-based navigation for speaking topics

**External Dependencies (CDN):**
- i18next for internationalization (only external dependency)

## Asset Organization

**Images:**
- `/assets/` - Main site images (portraits, topic images, icons)
- `/docs/` - Additional documentation and generated images
- Naming convention: `Main_1.jpg`, `About_1.jpg`, `Topics_1.1.jpeg` etc.

## Content Structure

**Speaking Topics Architecture:**
- Organized in 3 volumes with carousel navigation
- Each topic has preview cards and detailed modal content
- Images follow numbered system (Topics_1.1.jpeg, Topics_1.2.jpeg, etc.)

**RSS Integration:**
- Fetches latest AI newsletter content from Substack (currently: `thenextsignalnewsletter.substack.com`)
- Uses RSS2JSON service for CORS handling
- Displays recent posts on homepage

## CSS Architecture

Single stylesheet using:
- CSS custom properties (variables) for consistent theming
- Modern features: Grid, Flexbox, backdrop-filter
- Mobile-first responsive design
- Advanced animations for AI credits banner with gradient effects

## Email Obfuscation

Email addresses are constructed from translation parts to prevent scraping:
- Split into `email_user` and `email_domain` in translations
- JavaScript combines them on page load
- Maintains functionality while reducing spam

## Testing

**Test Directory:** `/test/`

**RSS Feed Testing:**
- Use `test/test-rss.html` to verify RSS2JSON API integration
- Tests current Substack feed URL and displays sample posts
- Helpful for debugging RSS feed issues or validating new feed URLs
- Open directly in browser (no server required)

**Testing RSS Feed Changes:**
1. Update RSS feed URL in `script.js` 
2. Open `test/test-rss.html` in browser to verify new feed works
3. Check for successful API response and sample post display
4. Test on actual site to ensure proper integration