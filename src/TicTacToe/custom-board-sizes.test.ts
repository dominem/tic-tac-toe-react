import { test, describe, expect } from '@rstest/core';
import TicTacToe, { Player, GameState } from './TicTacToe';

describe('TicTacToe', () => {
  describe('Custom Board Sizes', () => {
    test('should detect wins with different board sizes - 4x4', () => {
      const game = new TicTacToe(4);
      
      // Create horizontal win
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(1); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(3); // CROSS wins
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBe(Player.CROSS);
      expect(game.solution).toEqual([0, 1, 2, 3]);
    });

    test('should detect wins with different board sizes - 5x5', () => {
      const game = new TicTacToe(5);
      
      // Create vertical win
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(5); // CROSS
      game.tryToMarkField(2); // NOUGHT
      game.tryToMarkField(10); // CROSS
      game.tryToMarkField(3); // NOUGHT
      game.tryToMarkField(15); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(20); // CROSS wins
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBe(Player.CROSS);
      expect(game.solution).toEqual([0, 5, 10, 15, 20]);
    });

    test('should generate diagonals correctly for different board sizes', () => {
      const game4 = new TicTacToe(4);
      // Diagonal A for 4x4: 0, 5, 10, 15
      game4.tryToMarkField(0); // CROSS
      game4.tryToMarkField(1); // NOUGHT
      game4.tryToMarkField(5); // CROSS
      game4.tryToMarkField(2); // NOUGHT
      game4.tryToMarkField(10); // CROSS
      game4.tryToMarkField(3); // NOUGHT
      game4.tryToMarkField(15); // CROSS wins
      
      expect(game4.state).toBe(GameState.OVER);
      expect(game4.winner).toBe(Player.CROSS);
      expect(game4.solution).toEqual([0, 5, 10, 15]);
      
      const game5 = new TicTacToe(5);
      // Diagonal B for 5x5: 4, 8, 12, 16, 20
      game5.tryToMarkField(4); // CROSS
      game5.tryToMarkField(0); // NOUGHT
      game5.tryToMarkField(8); // CROSS
      game5.tryToMarkField(1); // NOUGHT
      game5.tryToMarkField(12); // CROSS
      game5.tryToMarkField(2); // NOUGHT
      game5.tryToMarkField(16); // CROSS
      game5.tryToMarkField(3); // NOUGHT
      game5.tryToMarkField(20); // CROSS wins
      
      expect(game5.state).toBe(GameState.OVER);
      expect(game5.winner).toBe(Player.CROSS);
      expect(game5.solution).toEqual([4, 8, 12, 16, 20]);
    });

    test('should work with custom fieldsToWin on 4x4 board', () => {
      const game = new TicTacToe(4, 3);
      
      // Create horizontal win with 3 consecutive fields (not all 4)
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(1); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(2); // CROSS wins (3 in a row)
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBe(Player.CROSS);
      expect(game.solution).toEqual([0, 1, 2]);
    });

    test('should work with custom fieldsToWin on 5x5 board - vertical', () => {
      const game = new TicTacToe(5, 3);
      
      // Create vertical win with 3 consecutive fields
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(0); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(12); // CROSS wins (3 in a column)
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBe(Player.CROSS);
      expect(game.solution).toEqual([2, 7, 12]);
    });

    test('should work with custom fieldsToWin on 5x5 board - diagonal', () => {
      const game = new TicTacToe(5, 3);
      
      // Create diagonal win with 3 consecutive fields on anti-diagonal
      game.tryToMarkField(4); // CROSS
      game.tryToMarkField(0); // NOUGHT
      game.tryToMarkField(8); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(12); // CROSS wins (3 in anti-diagonal)
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBe(Player.CROSS);
      expect(game.solution).toEqual([4, 8, 12]);
    });

    test('should require all fields when fieldsToWin equals rowSize', () => {
      const game = new TicTacToe(4, 4);
      
      // Must fill entire row to win
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(1); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(3); // CROSS wins (all 4 in a row)
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBe(Player.CROSS);
      expect(game.solution).toEqual([0, 1, 2, 3]);
    });

    test('should detect win with fieldsToWin=3 on 6x6 board', () => {
      const game = new TicTacToe(6, 3);
      
      // Create horizontal win with 3 consecutive fields in row 1 (indices 6, 7, 8)
      game.tryToMarkField(6); // CROSS
      game.tryToMarkField(0); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(8); // CROSS wins (3 in a row)
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBe(Player.CROSS);
      expect(game.solution).toEqual([6, 7, 8]);
    });
  });
});

