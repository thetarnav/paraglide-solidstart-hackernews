# SolidStart Hackernews Example

Hackernews example powered by [`solid-start`](https://start.solidjs.com) and [`paraglide-js`](https://inlang.com/m/gerre34r/library-inlang-paraglideJs);

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/solidjs/solid-start/tree/main/examples/hackernews)
[![Netlify Status](https://api.netlify.com/api/v1/badges/d1707969-7c26-427c-b615-a289a1c89d77/deploy-status)](https://app.netlify.com/sites/paraglide-solidstart-hackernews/deploys)

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```bash
# generate the i18n functions
pnpm run build:i18n

# start the server
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

TODO:

-   [x] translate href links for ssr
-   [ ] locale switching when offline
-   [ ] outing out of prefixing the locale in the url
-   [ ] mapping api routes
