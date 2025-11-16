import { test, describe, expect } from '@rstest/core';
import TicTacToe, { Player, GameState } from './TicTacToe';
import { createHorizontalWinGame } from './test-helpers';

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

    test('should not switch turn on invalid moves', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0);
      const turnAfterFirstMove = game.turn;
      
      // Try invalid moves
      game.tryToMarkField(0); // Already occupied
      expect(game.turn).toBe(turnAfterFirstMove);
      
      expect(() => game.tryToMarkField(-1)).toThrowError(); // Out of bounds
      expect(game.turn).toBe(turnAfterFirstMove);
      
      expect(() => game.tryToMarkField(100)).toThrowError(); // Out of bounds
      expect(game.turn).toBe(turnAfterFirstMove);
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
      const game = createHorizontalWinGame();
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

