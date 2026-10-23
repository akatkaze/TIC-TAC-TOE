# Code Review — Neon Tactics Tic-Tac-Toe

## Fixes applied

1. **Match statistics could be counted more than once.** The result effect depended on `gameMode`, so changing modes after a finished match could replay the result effect and increment the win/draw count again. A result key stored in a React ref now prevents duplicate counting.
2. **Move validation was incomplete.** The shared move handler now rejects invalid indexes, occupied cells, moves after a result, null players, and moves from the wrong player.
3. **Board cells were not accessible controls.** Clickable `div` elements are now real `button` elements with accessible labels, disabled states, and keyboard focus styling.
4. **AI helpers did not safely handle a full board.** AI move functions now return `-1` when there is no legal move, and reject invalid board lengths / a null AI player.
5. **Audio contexts were not released.** The sound helper now closes its `AudioContext` after the oscillator finishes.
6. **Potential API-key exposure in the browser bundle.** Removed the Vite `define` mapping that inserted `GEMINI_API_KEY` into client-side JavaScript. Secrets must never be bundled into a browser app. If Gemini features are added later, call Gemini through a server-side endpoint.
7. **Project metadata was generic.** Updated the browser title and description.
8. **TypeScript lint dependencies were incomplete.** Added `@types/react` and `@types/react-dom` so the configured TypeScript check has React type definitions after dependencies are installed.

## Validation performed

- Compiled `src/lib/gameLogic.ts` with TypeScript strict mode.
- Ran Node assertions for winner detection, draw detection, full-board AI behavior, valid AI moves, taking an immediate win, and blocking an immediate loss. All passed.
- A full Vite build / app-wide TypeScript check could not be completed in this environment because package installation timed out and dependencies were not present. Run the commands below locally to finish verification.

## Run and verify locally

```bash
npm install
npm run lint
npm run build
npm run dev
```

## Recommended next improvements

1. Add automated tests for all eight win lines, draw scenarios, invalid moves, AI difficulty behavior, timer timeout, and result statistics.
2. Move game state updates into a reducer (`useReducer`) so board, next player, timer, and match status update as one consistent action.
3. Persist statistics only if intended; currently they are session-only and disappear on refresh.
4. Add reduced-motion support for users who prefer less animation.
5. Remove unused dependencies after checking whether any omitted deployment integration needs them (`@google/genai`, `express`, and `dotenv` appear unused by the supplied frontend files).
6. Consider replacing inline `setTimeout`-based sound sequences with a small audio manager if sound effects grow.
