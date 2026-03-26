# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Type-check + build (vue-tsc -b && vite build)
pnpm preview      # Preview production build
pnpm deploy       # Build and deploy to GitHub Pages (gh-pages -d dist)
```

There is no test runner or linter script configured. Formatting is handled by Prettier with `@trivago/prettier-plugin-sort-imports` and `prettier-plugin-tailwindcss`.

## Architecture

**Stack:** Vue 3 (Composition API + `<script setup>`), TypeScript, Vite, Pinia, Vue Router, Tailwind CSS, Vant UI, vue-i18n, ECharts (via vue-echarts), GSAP, VueUse, Axios, Swiper.

### Routing & Localization

All routes are prefixed with a `/:lang?` segment (`zh-TW | zh-CN | en | ja | ko | vi`). The router guard in `src/router/index.ts` auto-detects browser language and redirects if the lang prefix is missing or unsupported. The active locale is synced from the URL param on every navigation. `requiresAuth` meta redirects unauthenticated users to home.

### State (Pinia stores)

| Store | Persistence | Purpose |
|---|---|---|
| `user` | `persist: true` (localStorage) | Auth token, login state, logout (clears cart + wheel) |
| `cart` | — | Shopping cart items |
| `wheel` | `key: 'lucky-wheel-history'` (localStorage) | Lucky spin prize records |
| `popup` | — | Global popup controller (type + props) |

### Global Popup System

A single `<GlobalPopup>` component (mounted in `App.vue`) renders one of three popup types — `'announcement'`, `'login'`, `'wheelRecords'` — based on `usePopupStore`. To open a popup: `popupStore.openPopup('login', props)`.

### Layout

`src/layouts/Default.vue` wraps `<AppHeader>`, `<RouterView>`, and `<AppFooter>`. All main views use this layout.

### i18n

Type-safe via `MessageSchema = typeof zhTW`. `zh-TW` is the canonical locale; all other locales mirror its keys. Fallback is `en`. Translation files live in `src/i18n/locales/`.

### Utilities & Composables

- `src/utils/path.ts` — `getAssetPath(path)`: resolves paths under `public/` correctly with `import.meta.env.BASE_URL` (needed for GitHub Pages subdirectory deploys).
- `src/composables/useDailyStorage.ts` — `useDailyStorage()`: localStorage-based per-day flag (used for "don't show again today" logic).

### Path Alias

`@` is aliased to `src/`. Use `@/` for all internal imports.
