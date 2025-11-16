import { test, describe, expect } from '@rstest/core';
import TicTacToe, { Player, GameState } from './TicTacToe';

describe('TicTacToe', () => {
  describe('Initialization', () => {
    test('should create 3x3 board by default', () => {
      const game = new TicTacToe();
      expect(game.rowSize).toBe(3);
      expect(game.boardSize).toBe(9);
      expect(game.fields).toHaveLength(9);
    });

    test('should create custom row size board', () => {
      const game4x4 = new TicTacToe(4);
      expect(game4x4.rowSize).toBe(4);
      expect(game4x4.boardSize).toBe(16);
      expect(game4x4.fields).toHaveLength(16);

      const game5x5 = new TicTacToe(5);
      expect(game5x5.rowSize).toBe(5);
      expect(game5x5.boardSize).toBe(25);
      expect(game5x5.fields).toHaveLength(25);
    });

    test('should initialize with RUNNING state', () => {
      const game = new TicTacToe();
      expect(game.state).toBe(GameState.RUNNING);
      expect(game.turn).toBe(Player.CROSS);
      expect(game.winner).toBeUndefined();
      expect(game.solution).toBeUndefined();
    });

    test('should initialize with all fields unoccupied', () => {
      const game = new TicTacToe();
      expect(game.fields.every(field => field.occupiedBy === undefined)).toBe(true);
    });
  });
});

