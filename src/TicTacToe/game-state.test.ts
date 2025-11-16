import { test, describe, expect } from '@rstest/core';
import TicTacToe, { GameState } from './TicTacToe';
import { createHorizontalWinGame } from './test-helpers';

describe('TicTacToe', () => {
  describe('Game State Management', () => {
    test('should transition from RUNNING to OVER', () => {
      const game = new TicTacToe();
      expect(game.state).toBe(GameState.RUNNING);
      
      const winGame = createHorizontalWinGame();
      expect(winGame.state).toBe(GameState.OVER);
    });

    test('should block moves when state is OVER', () => {
      const game = createHorizontalWinGame();
      expect(game.state).toBe(GameState.OVER);
      
      // Try to mark an unoccupied field
      const unoccupiedIndex = game.fields.findIndex(f => !f.occupiedBy);
      if (unoccupiedIndex !== -1) {
        const turnBefore = game.turn;
        game.tryToMarkField(unoccupiedIndex);
        expect(game.fields[unoccupiedIndex].occupiedBy).toBeUndefined();
        expect(game.turn).toBe(turnBefore);
      }
    });
  });
});

