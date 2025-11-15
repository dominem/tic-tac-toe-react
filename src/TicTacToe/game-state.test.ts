import { test, describe, expect } from '@rstest/core';
import TicTacToe, { Player, GameState } from './TicTacToe';

describe('TicTacToe', () => {
  describe('Game State Management', () => {
    test('should transition from RUNNING to OVER', () => {
      const game = new TicTacToe();
      expect(game.state).toBe(GameState.RUNNING);
      
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(3); // NOUGHT
      game.tryToMarkField(1); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(2); // CROSS wins
      
      expect(game.state).toBe(GameState.OVER);
    });

    test('should block moves when state is OVER', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(3); // NOUGHT
      game.tryToMarkField(1); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(2); // CROSS wins
      
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

    test('should switch turn only on valid moves', () => {
      const game = new TicTacToe();
      expect(game.turn).toBe(Player.CROSS);
      
      game.tryToMarkField(0); // Valid move
      expect(game.turn).toBe(Player.NOUGHT);
      
      game.tryToMarkField(0); // Invalid move (already occupied)
      expect(game.turn).toBe(Player.NOUGHT); // Should not change
    });

    test('should not switch turn on invalid moves', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0);
      const turnAfterFirstMove = game.turn;
      
      // Try invalid move
      game.tryToMarkField(0); // Already occupied
      expect(game.turn).toBe(turnAfterFirstMove);
      
      // Out of bounds should throw error
      expect(() => game.tryToMarkField(-1)).toThrowError();
      expect(game.turn).toBe(turnAfterFirstMove);
    });
  });
});

