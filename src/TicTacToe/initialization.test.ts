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

    test('should default fieldsToWin to rowSize when not provided', () => {
      const game3x3 = new TicTacToe(3);
      expect(game3x3.fieldsToWin).toBe(3);

      const game4x4 = new TicTacToe(4);
      expect(game4x4.fieldsToWin).toBe(4);

      const game5x5 = new TicTacToe(5);
      expect(game5x5.fieldsToWin).toBe(5);
    });

    test('should accept custom fieldsToWin value', () => {
      const game = new TicTacToe(5, 3);
      expect(game.fieldsToWin).toBe(3);

      const game2 = new TicTacToe(5, 4);
      expect(game2.fieldsToWin).toBe(4);
    });

    test('should throw error if fieldsToWin is less than 3', () => {
      expect(() => new TicTacToe(5, 2)).toThrow('fieldsToWin must be an integer >= 3 and <= rowSize (5), got 2');
      expect(() => new TicTacToe(5, 1)).toThrow('fieldsToWin must be an integer >= 3 and <= rowSize (5), got 1');
      expect(() => new TicTacToe(5, 0)).toThrow('fieldsToWin must be an integer >= 3 and <= rowSize (5), got 0');
    });

    test('should throw error if fieldsToWin is greater than rowSize', () => {
      expect(() => new TicTacToe(3, 4)).toThrow('fieldsToWin must be an integer >= 3 and <= rowSize (3), got 4');
      expect(() => new TicTacToe(4, 5)).toThrow('fieldsToWin must be an integer >= 3 and <= rowSize (4), got 5');
      expect(() => new TicTacToe(5, 6)).toThrow('fieldsToWin must be an integer >= 3 and <= rowSize (5), got 6');
    });

    test('should throw error if fieldsToWin is not an integer', () => {
      expect(() => new TicTacToe(5, 3.5)).toThrow('fieldsToWin must be an integer >= 3 and <= rowSize (5), got 3.5');
      expect(() => new TicTacToe(5, 4.1)).toThrow('fieldsToWin must be an integer >= 3 and <= rowSize (5), got 4.1');
    });
  });
});

