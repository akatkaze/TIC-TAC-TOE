/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Player = 'X' | 'O' | null;
export type GameMode = '2P' | 'AI';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

/**
 * Calculates if there is a winner on the board.
 * Returns the winning player and the winning line indices if a win condition is met.
 */
export function calculateWinner(squares: Player[]): { winner: Player; line: number[] | null } {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}

/**
 * Checks if the board is completely full (resulting in a draw if no winner).
 */
export function isBoardFull(squares: Player[]): boolean {
  return squares.every((square) => square !== null);
}

// --- AI Logic ---

/**
 * Returns an array of indices of all currently available empty squares on the board.
 */
function getAvailableMoves(board: Player[]): number[] {
  const moves: number[] = [];
  board.forEach((cell, index) => {
    if (cell === null) moves.push(index);
  });
  return moves;
}

/**
 * Easy AI Strategy: Returns a completely random valid move.
 */
function getRandomMove(board: Player[]): number {
  const moves = getAvailableMoves(board);
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}

/**
 * Minimax Algorithm to determine the absolute best possible score for a move.
 * Allows the AI to play perfectly.
 */
function minimax(board: Player[], depth: number, isMaximizing: boolean, aiPlayer: Player, humanPlayer: Player): number {
  const { winner } = calculateWinner(board);
  // Ai wins -> positive score, earlier wins are slightly better (10 - depth)
  if (winner === aiPlayer) return 10 - depth;
  // Human wins -> negative score, delayed losses are slightly better (depth - 10)
  if (winner === humanPlayer) return depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = aiPlayer;
        const score = minimax(board, depth + 1, false, aiPlayer, humanPlayer);
        board[i] = null; // undo move
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = humanPlayer;
        const score = minimax(board, depth + 1, true, aiPlayer, humanPlayer);
        board[i] = null; // undo move
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

/**
 * Evaluates the board and returns the best immediate move using the Minimax algorithm.
 */
function getBestMove(board: Player[], aiPlayer: Player, humanPlayer: Player): number {
  let bestScore = -Infinity;
  let move = -1;
  const availableMoves = getAvailableMoves(board);

  // Optimization: If it's the very first move of the game, take an optimal spot instantly
  // to avoid large minimax tree computation at depth 9.
  if (availableMoves.length === 9) {
     const openingMoves = [0, 2, 4, 6, 8];
     return openingMoves[Math.floor(Math.random() * openingMoves.length)];
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = aiPlayer;
      const score = minimax(board, 0, false, aiPlayer, humanPlayer);
      board[i] = null; // undo move
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

/**
 * Main AI function that returns a move index between 0-8 based on the set difficulty.
 */
export function getAIMove(board: Player[], difficulty: Difficulty, aiPlayer: Player = 'O'): number {
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  const r = Math.random();
  
  if (difficulty === 'EASY') {
    // 40% Best Move, 60% Random Moves (Tougher Easy)
    if (r < 0.40) {
      return getBestMove(board, aiPlayer, humanPlayer);
    }
    return getRandomMove(board);
  } else if (difficulty === 'MEDIUM') {
    // 90% Best Move, 10% Random (Tougher Medium)
    if (r < 0.90) {
      return getBestMove(board, aiPlayer, humanPlayer);
    }
    return getRandomMove(board);
  } else {
    // HARD: Unbeatable Play (Minimax)
    return getBestMove(board, aiPlayer, humanPlayer);
  }
}
