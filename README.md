# Arithmix

Timed multiplication and division quizzes, modeled on the "mad minute" worksheets from elementary school. Answer as many of 50 problems as you can before the clock runs out.

Play it at [arithmix.onrender.com](https://arithmix.onrender.com). It works on phones and desktops, installs as an app and plays offline.

## How it plays

- Pick a mode (Multiply, Divide or Mixed) and a time (30, 60 or 90 seconds).
- Numbers run from 0 to 12. Division always comes out even, and there's no dividing by zero.
- Type the answer on the on-screen keypad or your keyboard. A correct answer moves on by itself; there's no Enter key.
- Skip sends a problem to the back of the line, so you'll see it again.
- Leaving the tab mid-quiz voids the run.
- Your score earns a rank from Bronze ★ to Gold ★★★, based on correct answers per second. Accuracy under 90% caps you at Silver.

Runs, personal bests, the leaderboard and achievements are stored in your browser (IndexedDB). There's no account and no server.

## Stack

React 19, TypeScript, Vite, Tailwind v4 and shadcn/ui on Base UI. Dexie for storage, React Router for routing, and `vite-plugin-pwa` for offline support. Vitest and Testing Library for unit tests, Playwright for browser tests.

## Development

You need Node 24 (see `.node-version`) and pnpm, which Corepack provides.

```sh
corepack enable
pnpm install
pnpm dev
```

| Command             | What it does                   |
| ------------------- | ------------------------------ |
| `pnpm dev`          | Start the dev server           |
| `pnpm build`        | Typecheck and build to `dist/` |
| `pnpm preview`      | Serve the production build     |
| `pnpm test`         | Run unit tests                 |
| `pnpm test:e2e`     | Run Playwright browser tests   |
| `pnpm lint`         | Lint with oxlint               |
| `pnpm typecheck`    | Typecheck without building     |
| `pnpm format:check` | Check formatting with Prettier |

The first `pnpm test:e2e` run may need `pnpm exec playwright install` to download browsers.

## Deployment

The app is a static site on Render, set up by the blueprint in `render.yaml`. Render deploys `main` once GitHub Actions passes and builds a preview for each pull request. CI (`.github/workflows/ci.yml`) runs format, lint, typecheck, unit tests, build, a dependency audit and the browser tests.
