# Ca Mau Heritage Explorer Frontend

This repository contains the frontend application for a Ca Mau cultural heritage platform. It is built with React and Vite and focuses on multilingual heritage discovery, AI-assisted exploration, interactive maps, quizzes, community contribution flows, and a demo admin CMS.

The project is frontend-only. It depends on external APIs for AI chat and content management, while some user-facing features such as favorites, contributions, admin login state, and gamification progress are stored locally in the browser.

## What the app includes

- Heritage browsing with list and detail pages
- Interactive map experience with Mapbox and a Leaflet/OpenStreetMap fallback
- Timeline and themed content galleries
- AI chat with streaming responses
- Quiz and post-reading knowledge checks
- Text-to-speech related flows
- Favorites stored in `localStorage`
- Community contribution flow stored in `localStorage`
- Gamification, streaks, levels, and achievements stored in `localStorage`
- Progressive Web App support with install/update handling and offline assets
- Demo admin area for managing content categories from the frontend

## Tech stack

| Area | Tools |
| --- | --- |
| App framework | React 18 |
| Build tool | Vite 6 |
| Routing | React Router 6 |
| Styling | Tailwind CSS |
| Motion | Framer Motion |
| Internationalization | i18next, react-i18next |
| Maps | Mapbox GL, Leaflet, react-leaflet |
| PWA | vite-plugin-pwa |
| Charts/UI utilities | Recharts, Lucide React |
| Markdown rendering | react-markdown, remark-gfm |

## Supported languages

The frontend ships with four UI locales:

- `vi` - Vietnamese
- `en` - English
- `zh` - Traditional Chinese
- `km` - Khmer

## Core feature areas

### Public experience

- Home page with hero content and quick access cards
- Heritage listing and heritage detail pages
- Interactive map page with 360 viewer and audio playback support
- Timeline page
- About page
- AI chat page
- Quiz page
- Text-to-speech page
- Contribution page
- Favorites page
- Settings page

### Admin/CMS scope

The admin experience is mounted under `/admin/*` and uses an internal page switcher rather than separate browser routes for every module.

Available admin modules in the current codebase:

- Dashboard
- Heritage management
- Music management
- Fine art management
- Map places management
- People management
- Festival management
- Quiz management
- Audio management
- Tag management
- Economics management
- Geography management
- Literature management
- Settings

## Requirements

- Node.js 18+ recommended
- npm
- A backend API for content and admin data
- Dify-compatible chat API credentials if AI chat should work
- Optional Mapbox public token if you want the Mapbox experience instead of the Leaflet fallback

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and fill in the required values:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser. Vite is configured to use port `5173` by default.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run dev:clean` | Start Vite with `--force` |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run i18n:audit` | Audit locale content |
| `npm run i18n:check` | Check i18n keys and run the audit |

## Environment variables

Create a `.env` file based on `.env.example`.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Required for AI chat | Base URL for the Dify-style chat API used by the streaming chat hook. The frontend posts to `/chat-messages` on this base URL. |
| `VITE_API_KEY` | Required for AI chat | Bearer token used for chat requests to the AI API. |
| `VITE_BACKEND_URL` | Required for content/admin features | Base URL of the backend API. The expected format ends with `/api`, for example `http://localhost:5000/api`. |
| `VITE_STATIC_URL` | Optional | Present in the example env file for static/media hosting scenarios. It is not directly referenced in the checked-in runtime code shown in this repo. |
| `VITE_MAPBOX_PK` | Optional | Public Mapbox token. If omitted, the app falls back to Leaflet with OpenStreetMap data on the map page. |

## Backend and integration notes

### Content and admin API

Most data-driven features use `VITE_BACKEND_URL`. The frontend expects endpoints for areas such as:

- Heritage content
- Admin heritage CRUD
- Languages
- Ranking type constants
- Map places
- Music
- Fine art
- Economics
- Geography
- Literature

The API layer is implemented in [`src/services/api.js`](/Users/Administrator/Downloads/Coding/rag-fe-v4/src/services/api.js) and [`src/services/api.helpers.js`](/Users/Administrator/Downloads/Coding/rag-fe-v4/src/services/api.helpers.js).

### AI chat

AI chat uses a streaming request model and posts to:

- `POST {VITE_API_BASE_URL}/chat-messages`

Requests include a bearer token from `VITE_API_KEY` and maintain a local conversation ID and user ID in the browser.

### Maps

- If `VITE_MAPBOX_PK` is set, the app uses Mapbox GL with the `satellite-streets` style.
- If `VITE_MAPBOX_PK` is missing, the app falls back to a Leaflet + OpenStreetMap experience.

## Route overview

### Public routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/heritage` | Heritage list |
| `/heritage/:id` | Heritage detail |
| `/map` | Interactive map |
| `/timeline` | Timeline view |
| `/about` | About page |
| `/chat` | AI chat |
| `/quiz` | Quiz page |
| `/tts` | Text-to-speech page |
| `/contribute` | Community contribution flow |
| `/favorites` | Favorites page |
| `/settings` | Settings page |
| `/admin/*` | Demo admin area |

### Admin behavior

The admin area is rendered under a single route namespace, then switches between internal modules in the client. It is not a fully server-backed auth system and should be treated as demo/frontend behavior unless the backend/auth model is expanded.

## Project structure

This is the high-level layout of the application:

- [`src/pages`](/Users/Administrator/Downloads/Coding/rag-fe-v4/src/pages) - page-level screens for public and admin flows
- [`src/components`](/Users/Administrator/Downloads/Coding/rag-fe-v4/src/components) - reusable UI, navigation, home, map, admin, and gamification components
- [`src/context`](/Users/Administrator/Downloads/Coding/rag-fe-v4/src/context) - theme, language, auth, favorites, contribution, tags, and gamification state
- [`src/data`](/Users/Administrator/Downloads/Coding/rag-fe-v4/src/data) - local datasets, seed-like content, quiz content, and helpers
- [`src/services`](/Users/Administrator/Downloads/Coding/rag-fe-v4/src/services) - API integration layer for public and admin data
- [`src/i18n`](/Users/Administrator/Downloads/Coding/rag-fe-v4/src/i18n) - i18n setup and locale JSON files
- [`scripts`](/Users/Administrator/Downloads/Coding/rag-fe-v4/scripts) - utility scripts for i18n checks, data generation, and formatting helpers

## Local-only and demo behaviors

These behaviors are implemented entirely in the browser in the current frontend:

- Admin authentication state is stored in `localStorage`
- Demo admin credentials are `admin / admin123`
- Favorites are stored in `localStorage`
- User contributions are stored in `localStorage`
- Gamification progress, streaks, and achievements are stored in `localStorage`

Do not treat these as production-grade security or persistence guarantees.

## PWA and development notes

- The app uses `vite-plugin-pwa` with an auto-update registration strategy.
- The repository includes a web app manifest, icons, screenshots, and offline assets in `public/`.
- Service worker migration logic runs on app startup.
- The current production build succeeds, but Vite warns about large chunks, especially the Mapbox chunk. This is a warning, not a build failure.
- Audio requests are configured to avoid aggressive PWA caching behavior that can interfere with media playback.
- Vite config disables HMR in the dev server to avoid WebSocket issues in restricted environments, so manual browser refresh may be needed during local development.

## Notes for contributors and reviewers

- This repository is the frontend only. Backend behavior, authentication hardening, media storage, and production deployment are outside the scope of this codebase.
- Keep documentation and UI claims aligned with the current code, especially for admin auth and data persistence.
- When documenting setup, prefer exact variable names and scripts from the repo over assumed infrastructure.
