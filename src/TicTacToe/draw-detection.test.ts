import { test, describe, expect } from '@rstest/core';
import { GameState } from './TicTacToe';
import { createDrawGame } from './test-helpers';

describe('TicTacToe', () => {
  describe('Draw Detection', () => {
    test('should detect draw and set correct state', () => {
      const game = createDrawGame();
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBeUndefined();
      expect(game.solution).toBeUndefined();
    });

    test('should not allow further moves after draw', () => {
      const game = createDrawGame();
      const turnBeforeAttempt = game.turn;
      
      // Try to mark a field (though all are occupied)
      game.tryToMarkField(0); // Already occupied, but also game is over
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.turn).toBe(turnBeforeAttempt);
    });
  });
});

