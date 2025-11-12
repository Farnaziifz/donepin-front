A minimal, fast, installable PWA for Inbox→Taskizer with Today View, Kanban, People, Analytics, built on React + TS + Vite + Tailwind + React Query + Zustand.

Overview

Purpose: capture short notes, convert to tasks, manage statuses, and surface Today View with ultra-compact actions, installable on mobile as a PWA.

Key pages: Inbox, Today, Board, Task, People, Analytics, Settings with hybrid search and filters.

Tech stack

React + TypeScript + Vite, Tailwind CSS, React Router, React Query, Zustand, vite-plugin-pwa for installable PWA.

Folder structure

src/app: app providers, router, PWA bootstrap.

src/features: inbox, today, board, task, people, analytics modules.

src/components: UI primitives (Button, Input, Modal, Tag, Badge, EmptyState).

src/lib: api client, query keys, store slices, utils, validators.

public: icons, manifest, service worker assets for PWA.

Setup

Prerequisites: Node 20+, pnpm, API base at http://localhost:3000 by default.

Install: pnpm install in monorepo root or apps/web, then create .env files as below.

Env (.env.example)

VITE_API_BASE=http://localhost:3000.

VITE_APP_NAME=Taskizer.

Scripts

pnpm dev: run Vite dev server on 5173 with HMR.

pnpm build: production build and PWA assets.

pnpm preview: local preview of production build.

PWA setup

vite-plugin-pwa: autoUpdate, manifest with name/short_name/theme_color, icons 192/512, workbox caching of app shell.

Background Sync: queue note submissions when offline and sync on reconnect.

Optional Web Push: subscribe via service worker, backend sends reminders.

Styling

Tailwind configured with minimal, harmonious palette; dark mode class strategy; reusable CSS variables for semantic colors.

Component patterns: form elements, compact task cards, kanban columns with drag handle, skeleton loaders.

State and data fetching

React Query for server cache and optimistic updates on task status/tag changes.

Zustand for UI and ephemeral state (dialogs, filters, layout prefs).

Routing

Routes: /inbox, /today, /board, /tasks/:id, /people, /analytics, /settings.

Guarded routes based on auth token presence; redirect to /inbox.

API client

Fetch wrapper with base URL from VITE_API_BASE, typed DTOs, error normalization; retry/backoff for transient failures.

Endpoints used: /auth/login, /notes, /tasks, /tags, /people, /search, /analytics.

Accessibility and UX

Keyboard-first navigation, focus rings, aria-labels, reduced motion options.

Today View emphasizes 2–10 minute actions; snooze/reschedule one click.

Testing and quality

Vitest + React Testing Library for components and hooks; ESLint + Prettier; TS strict mode.

Lighthouse PWA check as CI step for installability and offline capability.

How to run (dev)

cp apps/web/.env.example apps/web/.env, ensure API running at 3000, then pnpm --filter @taskizer/web dev.

Open http://localhost:5173 and login; test Inbox → Task creation and Board drag/drop.

Build and deploy

pnpm --filter @taskizer/web build to produce dist, serve via Docker service or static hosting behind reverse proxy.

Ensure service worker scope and API CORS allowlist include production origin.

Extensibility

Feature flags to enable People Graph/Analytics as they mature, preserving minimal core first.

Theming via Tailwind config and CSS variables; easy brand override later.

Cursor prompts (frontend)

“Create React pages for Inbox, Today, Board with Tailwind components, React Query hooks, and a global toaster for errors/success.”.

“Implement PWA registration and offline queue for POST /notes when navigator.onLine is false.”.

