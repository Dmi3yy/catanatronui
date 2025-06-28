# Project Overview

This repository contains the React user interface for **Catanatron**, a web-based implementation of the board game *Settlers of Catan* with AI opponents. The app is built with **React 19** and uses **Vite** for development/build tooling. Styling relies on **Sass** and the Material UI (MUI) component library. Tests run with **Vitest**.

## Directory Structure

```
/ (root)
├─ Dockerfile              – container setup for running the UI
├─ netlify.toml            – redirect rules & environment variables for Netlify
├─ index.html              – HTML entry point loaded by Vite
├─ package.json            – npm dependencies and scripts
├─ tsconfig.json           – TypeScript configuration
├─ vite.config.ts          – Vite build/test settings
├─ public/                 – static assets served as-is
└─ src/                    – application source
```

### `public/`
Contains icons, the site background image and `manifest.json` used for PWA settings.

### `src/`
Main application code. Key files and directories:

- **App.jsx** – top level component configuring React Router routes and theming.
- **main.jsx** – renders `<App/>` and registers the service worker.
- **store.tsx** – global UI state management using React context and a reducer. Handles drawer open state, build modes and other flags.
- **actions.ts** – enumerates reducer action names.
- **configuration.ts** – exposes `API_URL` derived from environment variables.
- **variables.scss** – common Sass variables with breakpoints and color definitions.

#### `src/components/`
Reusable UI pieces:

- `LeftDrawer.jsx` / `RightDrawer.jsx` – swipeable/permanent drawers showing player info and win probability analysis.
- `PlayerStateBox.jsx` – displays per-player cards, statistics and a `<TurnTimer/>`.
- `DiceRoll.tsx` – animates the dice images for the last roll.
- `ResourceSelector.jsx` – dialog used when playing Monopoly or Year of Plenty cards.
- `Prompt.jsx` – renders the current player prompt or logs actions.
- `Snackbar.jsx` – wrappers around Notistack snackbars.
- `Hidden.tsx` – custom replacement for the deprecated MUI `Hidden` component.
- `TurnTimer.tsx` – countdown timer shown next to player stats.

Each component has a corresponding `.scss` stylesheet.

#### `src/pages/`
Components representing full pages or large sections:

- `HomePage.jsx` – landing page where users create a new game choosing the number of players and bot type.
- `GameScreen.jsx` – main game view. Fetches state via the API, drives the bot actions, and coordinates layout of the board, toolbars and analysis drawer.
- `ActionsToolbar.jsx` – toolbar with buttons for building, trading and using development cards.
- `ZoomableBoard.jsx` – wrapper adding zoom/pan via `react-zoom-pan-pinch` and handling clicks on board elements.
- `Board.jsx` – renders the hex tiles, nodes, edges and robber piece using helper components `Tile`, `Node`, `Edge` and `Robber`.
- `Tile.tsx`, `Node.jsx`, `Edge.jsx`, `Robber.tsx` – presentational pieces for board elements.

Associated `.scss` files style these pages, including responsive layouts and board graphics.

#### `src/utils/`
Utility modules:

- `apiClient.ts` – Axios based client for API endpoints (`createGame`, `getState`, `postAction`, `getMctsAnalysis`).
- `coordinates.ts` – math helpers for converting hex coordinates and positioning board elements.
- `stateUtils.ts` – helper functions to determine whose turn it is and to map player colors.
- `useWindowSize.ts` – React hook providing window dimensions.
- `*.test.ts` – Vitest unit tests for utility modules.

## Application Flow

1. **Home Page** – `HomePage` lets the user start a game by calling `createGame` with the chosen player types. The router then navigates to `/games/:gameId`.
2. **Game Screen** – `GameScreen` fetches the latest game state with `getState` and stores it in context. If it is a bot's turn, it automatically posts the next action after a short delay.
3. **Board Interaction** – `ZoomableBoard` computes which nodes or edges are currently buildable based on the state. Clicking a highlighted element posts the corresponding action. The board itself renders hex tiles, roads, settlements, cities and the robber using SVG/PNG assets.
4. **Player Actions** – `ActionsToolbar` shows resource cards and offers buttons to roll dice, build, trade or end the turn. It also opens dialogs like `ResourceSelector` when playing development cards.
5. **Drawers** – On mobile the left drawer slides out showing player states and the game log, while the right drawer can request a Monte Carlo tree search (MCTS) win probability analysis from the backend.
6. **State Updates** – After each action the reducer in `store.tsx` updates UI flags (e.g., build modes) and stores the new `gameState`. Snackbars display recent actions using `humanizeAction` from `Prompt`.

## Running & Testing

- `npm run start` – launches Vite dev server at `localhost:3000`.
- `npm run build` – creates a production build in `dist/`.
- `npm run test` – runs Vitest unit tests defined under `src/`.

The project targets Node 24 and expects environment variables prefixed with `CTRON_` (see `vite.config.ts`).

