# SolidStart Hackernews Example

Hackernews example powered by [`solid-start`](https://start.solidjs.com);

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/solidjs/solid-start/tree/main/examples/hackernews)

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

SolidStart apps are built with _adapters_, which optimise your project for deployment to different environments.

By default, `pnpm run build` will generate a Node app that you can run with `pnpm start`. To use a different adapter, add it to the `devDependencies` in `package.json` and specify in your `vite.config.ts`.
