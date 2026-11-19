# Platform spec: what every page shares

Every page of ozsert.com sits on two small shared pieces: the **top bar** and the **`window.OZ`
API**. Pages use them as they are and build everything visual themselves.

## The top bar: `<oz-topbar>`

Load `/shared/topbar.js` (deferred) and put `<oz-topbar></oz-topbar>` first in `<body>`. It's a web
component in Shadow DOM, so its styles and the page's styles never affect each other.

- 40px tall, sticky, translucent with blur.
- Left: **ozsert.com**, linking to `/`.
- Right: **TR / EN**, **theme** (light / dark), **"Built with [model ▾]"** to switch between the homepage
  versions built by different models, and **"view specs"**, which opens these specs.
- On mobile (<640px) the model switcher and specs button move to a fixed bottom bar, so pages leave
  `padding-bottom: 64px` on mobile.

## The `window.OZ` API: `/shared/core.js`

Load it **not deferred** in `<head>`, so theme, language and accent are set before the first paint:
`<script src="/shared/core.js"></script>`. All copy comes from `/content/tr.json` and `/content/en.json`,
generated from the `### key` blocks in these specs.

| API | Behaviour |
|---|---|
| `OZ.ready` | Promise that resolves once the copy is loaded and `[data-i18n]` is filled (also fires `oz:ready`). Start your code here. |
| `OZ.lang` / `OZ.setLang(l)` | `tr` \| `en`, default `en`, remembered. `?lang=en` overrides it. Sets `<html lang>`. |
| `OZ.t(key)` | Copy for the current language. |
| `[data-i18n]` | `"key"` → text · `"[html]key"` → innerHTML · `"[alt]key"` → an attribute. `;` combines several. Re-filled on language change. |
| `[data-oz-email]` | Gets the email address as text, and as a `mailto:` link on `<a>`. |
| `OZ.theme` / `OZ.setTheme(p)` / `OZ.toggleTheme()` | Sets `html[data-theme="light\|dark"]`, default dark; the preference (`system\|light\|dark`) is remembered. `?theme=` overrides it. |
| `OZ.accent` / `OZ.setAccent(id)` / `OZ.accents` | Sets `html[data-accent]`, remembered. `OZ.accents` = `[{id, name:{tr,en}, light, dark}]`. The CSS variable `--oz-accent` always holds the current accent colour. `?accent=` overrides it. |
| `OZ.email()` | Builds the email address from its parts (anti-scraping). |
| `OZ.latestPosts(n)` | Promise of `[{title, link, date, excerpt, image}]` from the newsletter feed (`image` = the issue's cover or `null`). It rejects on error, so show `newsletter.error`. |
| `OZ.model` / `OZ.isRoot` | This page's model id (from `<meta name="oz-model">`), and whether it's the version shown at `/`. |
| `OZ.models()` | Promise of the list of model versions. |
| Events | `oz:ready`, `oz:langchange`, `oz:themechange`, `oz:accentchange` on `document`. |

Pages **must** use this API for language, theme, accent, email and the newsletter, and **must not**
reimplement them.
