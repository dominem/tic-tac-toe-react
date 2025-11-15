import { test, describe, expect } from '@rstest/core';
import TicTacToe, { Player, GameState } from './TicTacToe';

describe('TicTacToe', () => {
  describe('Draw Detection', () => {
    test('should detect draw when board is full with no winner', () => {
      const game = new TicTacToe();
      // Create a draw scenario
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(3); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(8); // CROSS
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBeUndefined();
      expect(game.solution).toBeUndefined();
    });

    test('should change game state to OVER on draw', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(3); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(8); // CROSS
      
      expect(game.state).toBe(GameState.OVER);
    });

    test('should keep winner undefined on draw', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(3); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(8); // CROSS
      
      expect(game.winner).toBeUndefined();
    });

    test('should keep solution undefined on draw', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(3); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(8); // CROSS
      
      expect(game.solution).toBeUndefined();
    });

    test('should not allow further moves after draw', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(3); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(8); // CROSS
      
      const turnBeforeAttempt = game.turn;
      // Try to mark a field (though all are occupied)
      game.tryToMarkField(0); // Already occupied, but also game is over
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.turn).toBe(turnBeforeAttempt);
    });
  });
});

