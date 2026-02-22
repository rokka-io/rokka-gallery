# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rokka Gallery is a Vue 2 SPA for browsing, managing, and uploading images to the [Rokka](https://rokka.io) image storage platform. It provides a gallery interface with album/category navigation, tag management, search, and image metadata editing.

## Development Commands

```bash
# Setup (first time)
git submodule update --init
npm install
cp config.js.dist config.js   # then edit config.js with your org/key

# Development server (port 3000)
npm run start

# Production build
npm run build

# Lint (ESLint + auto-fix)
npm run lint

# Deploy to S3/CloudFront (production)
npm run deploy
```

Node 18+ required (see `.nvmrc`). No test suite exists in this project.

## Architecture

**Framework**: Vue 2.7 + Vue Router 3 + Vue CLI 5 (Webpack-based).

**Entry flow**: `src/main.js` → registers Rokka SDK as Vue plugin (`this.$rokka()`) → mounts `App.vue` which handles auth, data fetching, and layout → Vue Router renders views.

**State management**: No Vuex. State lives in `App.vue` data (albums, tags, auth) and is passed down as props. Component-to-component communication uses an EventBus (`src/eventBus.js`). Auth tokens and org are persisted in localStorage.

**Routing** (`src/router.js`):
- `/` — Home/image list
- `/_/:search` — Search results
- `/:category+` — Category/album view (supports nested paths)

**Key source files**:
- `src/App.vue` — Root component, auth management, album/tag fetching
- `src/rokkaHelper.js` — Image render URL generation, format detection utilities
- `src/consts.js` — Modal dimension/behavior constants
- `config.js` — Runtime config: org name, API key, per-org feature flags (delete, download, favorites)

**Components structure**:
- `src/views/` — Page-level route components (ImagesList, Category)
- `src/components/` — Reusable components (Header, Nav, ImageModal, UploadModal, SettingsModal, ImageBlock)
- `src/components/common/` — Generic UI (Icon, Loader)

## Styling

SCSS with Liip styleguide (`assets/liip-styleguide/` git submodule). `vue.config.js` prepends shared SCSS variables/mixins from Kanbasu framework into every component. Component styles are scoped.

## Configuration

`config.js` (copied from `config.js.dist`) defines per-organization settings:
- `rokkaOrg` / `rokkaKey` — Default org and optional read-only API key
- `orgOptions[orgName]` — Feature flags per org: `canDelete`, `downloads` (array of render stack configs), `favorites`, `hideImages`

## Build & Deploy

Production builds use `FOR_ROKKA=true` env var which sets public path to `/gallery/` (vs `/` in dev). The `buildAndUpload.sh` script builds and syncs to S3 with CloudFront invalidation using `--profile rokka`.

## Code Style

- Prettier: single quotes, trailing commas (ES5)
- ESLint: `plugin:vue/recommended` + `@vue/prettier`
- `console` calls allowed in dev, disallowed in production
- Lodash imports use `lodash-es` with babel plugin for tree-shaking
