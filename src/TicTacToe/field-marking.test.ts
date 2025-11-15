import { test, describe, expect } from '@rstest/core';
import TicTacToe, { Player, GameState } from './TicTacToe';

describe('TicTacToe', () => {
  describe('Field Marking', () => {
    test('should mark field with current player on valid move', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0);
      expect(game.fields[0].occupiedBy).toBe(Player.CROSS);
    });

    test('should switch turn after valid move', () => {
      const game = new TicTacToe();
      expect(game.turn).toBe(Player.CROSS);
      
      game.tryToMarkField(0);
      expect(game.turn).toBe(Player.NOUGHT);
      
      game.tryToMarkField(1);
      expect(game.turn).toBe(Player.CROSS);
    });

    test('should not mark field with out of bounds negative index', () => {
      const game = new TicTacToe();
      const initialTurn = game.turn;
      const initialField = game.fields[0].occupiedBy;
      
      expect(() => game.tryToMarkField(-1)).toThrowError();
      
      expect(game.turn).toBe(initialTurn);
      expect(game.fields[0].occupiedBy).toBe(initialField);
    });

    test('should not mark field with out of bounds large index', () => {
      const game = new TicTacToe();
      const initialTurn = game.turn;
      
      expect(() => game.tryToMarkField(100)).toThrowError();
      
      expect(game.turn).toBe(initialTurn);
      expect(game.fields.every(field => field.occupiedBy === undefined)).toBe(true);
    });

    test('should not mark field that is already occupied', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0);
      expect(game.fields[0].occupiedBy).toBe(Player.CROSS);
      expect(game.turn).toBe(Player.NOUGHT);
      
      // Try to mark same field again
      game.tryToMarkField(0);
      
      // Should remain occupied by CROSS and turn should not change
      expect(game.fields[0].occupiedBy).toBe(Player.CROSS);
      expect(game.turn).toBe(Player.NOUGHT);
    });

    test('should not mark field when game is already over', () => {
      const game = new TicTacToe();
      // Create a winning scenario
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(3); // NOUGHT
      game.tryToMarkField(1); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(2); // CROSS wins
      
      expect(game.state).toBe(GameState.OVER);
      const turnBeforeAttempt = game.turn;
      
      // Try to mark a field after game is over
      game.tryToMarkField(5);
      
      // Field should remain unoccupied and turn should not change
      expect(game.fields[5].occupiedBy).toBeUndefined();
      expect(game.turn).toBe(turnBeforeAttempt);
    });

    test('should handle multiple valid moves in sequence', () => {
      const game = new TicTacToe();
      
      game.tryToMarkField(0);
      expect(game.fields[0].occupiedBy).toBe(Player.CROSS);
      expect(game.turn).toBe(Player.NOUGHT);
      
      game.tryToMarkField(1);
      expect(game.fields[1].occupiedBy).toBe(Player.NOUGHT);
      expect(game.turn).toBe(Player.CROSS);
      
      game.tryToMarkField(2);
      expect(game.fields[2].occupiedBy).toBe(Player.CROSS);
      expect(game.turn).toBe(Player.NOUGHT);
      
      game.tryToMarkField(3);
      expect(game.fields[3].occupiedBy).toBe(Player.NOUGHT);
      expect(game.turn).toBe(Player.CROSS);
    });
  });
});

