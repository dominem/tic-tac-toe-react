import TicTacToe from './TicTacToe';

/**
 * Creates a game in a draw state (board full, no winner)
 * Moves: 0,1,2,4,3,5,7,6,8
 */
export function createDrawGame(): TicTacToe {
  const game = new TicTacToe();
  [0, 1, 2, 4, 3, 5, 7, 6, 8].forEach(index => game.tryToMarkField(index));
  return game;
}

/**
 * Creates a game with a horizontal win on the first row
 * Moves: 0,3,1,4,2 (CROSS wins)
 */
export function createHorizontalWinGame(): TicTacToe {
  const game = new TicTacToe();
  [0, 3, 1, 4, 2].forEach(index => game.tryToMarkField(index));
  return game;
}

/**
 * Creates a game with a vertical win on the first column
 * Moves: 0,1,3,2,6 (CROSS wins)
 */
export function createVerticalWinGame(): TicTacToe {
  const game = new TicTacToe();
  [0, 1, 3, 2, 6].forEach(index => game.tryToMarkField(index));
  return game;
}

/**
 * Creates a game with a diagonal win (top-left to bottom-right)
 * Moves: 0,1,4,2,8 (CROSS wins)
 */
export function createDiagonalWinGame(): TicTacToe {
  const game = new TicTacToe();
  [0, 1, 4, 2, 8].forEach(index => game.tryToMarkField(index));
  return game;
}

/**
 * Creates a game with NOUGHT as winner
 * Moves: 0,3,1,4,8,5 (NOUGHT wins on middle row)
 */
export function createNoughtWinGame(): TicTacToe {
  const game = new TicTacToe();
  [0, 3, 1, 4, 8, 5].forEach(index => game.tryToMarkField(index));
  return game;
}

