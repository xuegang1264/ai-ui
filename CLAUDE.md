# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + Vite single-page application using JavaScript (ES modules) and the Composition API with `<script setup>` SFCs. The UI is Chinese-language with a "Warm Editorial" design system.

## Common Commands

- `yarn dev` — Start the Vite development server
- `yarn build` — Production build (outputs to `dist/`)
- `yarn preview` — Preview the production build locally

No test runner, linter, or formatter is currently configured.

## Architecture

- **Entry point:** `src/main.js` creates the Vue app, registers Pinia + Vue Router, and mounts to `#app`
- **Root component:** `src/App.vue` is a shell that only renders `<router-view />`
- **Routing:** `src/router/index.js` uses `createWebHistory`. Currently only a `/home` route exists with a redirect from `/`
- **State management:** Pinia with `pinia-plugin-persistedstate` enabled in `main.js`
- **Global styles:** `src/style.css` defines a warm editorial design system using CSS custom properties (OKLCH color palette, 8px spacing scale, Chinese font stacks). There is no `prefers-color-scheme` dark mode — the theme is fixed.
- **Static assets:** `public/` is served at root (e.g., `public/icons.svg` is referenced via `<use href="/icons.svg#icon-id">`)
- **Processed assets:** `src/assets/` are handled by Vite

### Module / Widget System

The main view (`src/views/Home.vue`) renders a draggable grid using `grid-layout-plus`. The source of truth for grid modules is `src/stores/gridStore.js`.

Each module is an object with this shape:
- `instanceId` — unique identifier
- `stableKey` — component type name (e.g. `StatsCard`, `LineChart`, `ProjectList`)
- `layout` — `{ x, y, w, h, draggable, resizable }` for grid positioning
- `props` — data passed to the component instance
- `style` — inline-able CSS object
- `runtime` — visibility, z-index, and other transient state

The store exposes:
- `modules` — raw module array (the source of truth)
- `layoutItems` — computed array derived from `modules` for `v-model:layout` binding with `GridLayout`
- `getModuleById(instanceId)` — lookup helper used inside `GridItem` to render headers/props
- `updateLayout(newLayout)` — syncs grid position changes back into `modules`

**Important:** The grid currently renders generic placeholders. Each `GridItem` displays the `stableKey` and stringified `props` rather than mounting actual Vue components. When adding new module types, you will need to create the corresponding component in `src/components/` and wire it into the grid rendering loop.

### Page Layout

`Home.vue` uses an asymmetric two-column layout:
- **Left sidebar** (380px, sticky): contains `ChatBox`
- **Right content** (flexible): contains the `GridLayout`

The layout collapses to a single column below 900px.
