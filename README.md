# Neon Tactics — Tic-Tac-Toe

A modern, interactive Tic-Tac-Toe game built with **React, TypeScript, and Vite**. Play against a friend locally or challenge an AI opponent with multiple difficulty levels, smooth animations, sound effects, and a customizable gaming experience.

## Overview

Neon Tactics reimagines the classic Tic-Tac-Toe game with a modern interface and intelligent gameplay. The application combines familiar game mechanics with AI-powered opponents, match statistics, and responsive visual design.

Whether you want a quick match with a friend or a strategic challenge against the computer, Neon Tactics offers a simple and engaging gaming experience.

## Features

- **Two-Player Mode:** Play locally with another player on the same device.
- **AI Opponent:** Challenge the computer with three difficulty levels.
- **Minimax Algorithm:** Uses a game-search algorithm to select optimal moves for the AI.
- **Turn Timer:** Adds a time-based challenge to gameplay.
- **Match Statistics:** Track wins, losses, and draws.
- **Interactive Game Board:** Responsive board with visual feedback for player actions.
- **Sound Effects:** Audio feedback for supported game events.
- **Customizable Themes:** Personalize the visual appearance of the game.
- **Game State Management:** Handles turns, legal moves, wins, and draws.
- **Keyboard Accessibility:** Supports accessible controls and keyboard navigation.
- **Modern Frontend Architecture:** Built with React components and TypeScript for maintainability.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface and component management |
| TypeScript | Type safety and maintainable code |
| Vite | Development server and production build tooling |
| CSS | Styling, layouts, and visual effects |
| Web Audio API | Game sound effects |
| Minimax Algorithm | Strategic AI decision-making |

## Getting Started

### Prerequisites

Install the following software before running the project:

- [Node.js](https://nodejs.org/) — preferably an active LTS release.
- npm — included with Node.js.
- [Git](https://git-scm.com/) — optional, for cloning the repository.
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/).

### Installation

**1. Clone the repository**

```bash
git clone <YOUR_REPOSITORY_URL>
```

Replace `<YOUR_REPOSITORY_URL>` with your actual GitHub repository URL.

**2. Navigate to the project directory**

```bash
cd TIC-TAC-TOE-main
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

Open the local URL printed in the terminal to play the game.

## Available Commands

Run these commands from the project root.

| Command | Description |
|---|---|
| `npm install` | Installs project dependencies |
| `npm run dev` | Starts the local development server |
| `npm run lint` | Runs the project's configured lint or type-check script |
| `npm run build` | Creates a production build |
| `npm run preview` | Previews the production build locally, if configured |

The commands available depend on the scripts defined in `package.json`. Check that file if a command is unavailable.

## How to Play

1. Launch the application.
2. Select the available game mode.
3. Choose two-player mode or an AI difficulty level.
4. Take turns placing your symbol on an empty square.
5. Align three symbols horizontally, vertically, or diagonally to win.
6. If all nine squares are filled without a winner, the match ends in a draw.
7. Start another match and continue improving your strategy.

## AI Difficulty

The game provides three AI difficulty levels designed for different gameplay experiences.

- **Easy:** Intended for a more relaxed game.
- **Medium:** Intended to provide a more challenging opponent.
- **Hard:** Uses the Minimax strategy to select an optimal move.

The exact behavior of each difficulty depends on the implementation in `src/lib/gameLogic.ts`.

## Project Structure

```text
TIC-TAC-TOE-main/
├── src/
│   ├── App.tsx              # Main application and game interface
│   ├── index.css            # Global styling
│   ├── main.tsx             # Application entry point
│   └── lib/
│       ├── audio.ts         # Audio effects
│       └── gameLogic.ts     # Game rules and AI logic
├── .env.example             # Example environment configuration
├── .gitignore               # Git exclusion rules
├── index.html               # HTML entry point
├── metadata.json            # Project metadata
├── package.json             # Dependencies and npm scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Game Logic and AI

The game logic is separated from the main React interface to make the application easier to understand, test, and maintain.

The AI uses the **Minimax algorithm**, which evaluates possible future moves to select a strategically strong move. In standard Tic-Tac-Toe, optimal play cannot be defeated when both players play perfectly.

The game logic is responsible for:

- Detecting winning combinations.
- Identifying draw conditions.
- Validating legal moves.
- Selecting AI moves.
- Handling full-board scenarios.

## Testing and Quality Checks

Before deploying the application, run the following checks:

```bash
# Check configured linting or type validation
npm run lint

# Generate the production build
npm run build
```

Also test the following scenarios manually:

- Every winning combination.
- Draws and full-board states.
- Each AI difficulty level.
- Attempts to select occupied squares.
- Turn timer expiration.
- Match statistics after a completed game.
- Restarting a match.
- Keyboard navigation and mobile screen layouts.

**Note:** The commands above must be available in `package.json`. A successful production build should be confirmed before deployment.

## Security

The application is primarily a client-side game.

- Never expose private API keys in frontend code.
- Keep sensitive credentials on a trusted server.
- Do not commit real secrets to GitHub.
- Use `.env.example` for placeholder configuration values rather than actual credentials.

If a future version integrates an external AI service, route private API requests through a backend rather than embedding secret keys in the browser bundle.

## Future Improvements

Potential enhancements include:

- Online multiplayer using WebSockets.
- Player accounts and persistent leaderboards.
- Improved AI strategies and difficulty balancing.
- Match history and replay functionality.
- Automated unit and integration tests.
- Additional board sizes and game variants.
- Progressive Web App (PWA) support.
- Improved animations and accessibility settings.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Commit your changes with a descriptive message.
5. Open a pull request describing the improvements.

## License

No license has been specified yet. Add a `LICENSE` file before distributing the project under a particular open-source license.

## Acknowledgements

Built using React, TypeScript, Vite, and the classic Tic-Tac-Toe game concept.

---

**Neon Tactics — Simple rules. Smart moves. Endless rematches.**
