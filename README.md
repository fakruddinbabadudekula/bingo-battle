# Bingo Battle

Bingo Battle is a browser-based game where you play Bingo against a computer opponent. Choose a board size, pick numbers from your board, and try to complete enough lines to spell BINGO before the computer does.

## Features

- Play on 5 × 5, 6 × 6, or 7 × 7 boards.
- Choose between Easy and Hard computer opponents.
- Easy difficulty selects an available number at random.
- Hard difficulty favors moves that advance a line toward a win.
- Track completed rows, columns, and diagonals for both players.
- Optional click sounds and background music.
- Responsive layout with keyboard-accessible controls and visible focus states.

## How to play

1. Select a board size and difficulty from the settings.
2. Select **Start game** to deal both boards.
3. On your turn, choose an unmarked number on your board. That number is marked on both boards.
4. The computer then chooses a number and marks it on both boards.
5. Complete as many lines as the selected board size to spell BINGO and win. Lines can run horizontally, vertically, or diagonally.
6. Select **New game** to deal a fresh round.

## Run locally

Requirements: Node.js and npm.

```bash
npm ci
npm start
```

The development server opens the app at `http://localhost:3000`.

Create an optimized production build with:

```bash
npm run build
```

## Deploy to GitHub Pages

The project includes a `gh-pages` deployment script:

```bash
npm run deploy
```

Before deploying, confirm the `homepage` value in `package.json` matches the GitHub Pages URL for your repository.

## Project structure

```text
src/
├── Components/
│   ├── Bingo.jsx       # Game screen, turn scheduling, and game controls
│   ├── Navbar.jsx      # Responsive game settings and audio controls
│   └── Table.jsx       # Accessible Bingo board and progress display
├── game/
│   └── game.js         # Board generation, win lines, computer strategy, reducer
├── Audio/              # Optional click and background sounds
├── App.js              # App-level settings and layout
├── App.css             # Responsive visual design
└── index.js            # React entry point
```

Game rules and the computer's move-selection strategy are kept in `src/game/game.js`, separately from the React components. The app uses a reducer to transition between setup, player turn, computer turn, and finished states.

## Technology

React 18, JavaScript, CSS, Create React App, and GitHub Pages (`gh-pages`).

## Current scope

This is a frontend learning project. It currently has no automated test cases. The game runs entirely in the browser and does not save games between sessions.

