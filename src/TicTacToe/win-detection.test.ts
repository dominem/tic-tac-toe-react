import { test, describe, expect } from '@rstest/core';
import TicTacToe, { Player, GameState } from './TicTacToe';
import { createHorizontalWinGame, createNoughtWinGame } from './test-helpers';

describe('TicTacToe', () => {
  describe('Win Detection', () => {
    describe('Horizontal Wins', () => {
      test.each([
        { name: 'first row', moves: [0, 3, 1, 4, 2], solution: [0, 1, 2] },
        { name: 'middle row', moves: [3, 0, 4, 1, 5], solution: [3, 4, 5] },
        { name: 'last row', moves: [6, 0, 7, 1, 8], solution: [6, 7, 8] },
      ])('should detect win on $name', ({ moves, solution }) => {
        const game = new TicTacToe();
        moves.forEach(index => game.tryToMarkField(index));
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual(solution);
      });
    });

    describe('Vertical Wins', () => {
      test.each([
        { name: 'first column', moves: [0, 1, 3, 2, 6], solution: [0, 3, 6] },
        { name: 'middle column', moves: [1, 0, 4, 2, 7], solution: [1, 4, 7] },
        { name: 'last column', moves: [2, 0, 5, 1, 8], solution: [2, 5, 8] },
      ])('should detect win on $name', ({ moves, solution }) => {
        const game = new TicTacToe();
        moves.forEach(index => game.tryToMarkField(index));
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual(solution);
      });
    });

    describe('Diagonal Wins', () => {
      test('should detect win on diagonal A (top-left to bottom-right)', () => {
        const game = new TicTacToe();
        [0, 1, 4, 2, 8].forEach(index => game.tryToMarkField(index));
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([0, 4, 8]);
      });

      test('should detect win on diagonal B (top-right to bottom-left)', () => {
        const game = new TicTacToe();
        [2, 0, 4, 1, 6].forEach(index => game.tryToMarkField(index));
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([2, 4, 6]);
      });
    });

    describe('Win State Management', () => {
      test('should set correct state, winner, and solution on win', () => {
        const game = createHorizontalWinGame();
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([0, 1, 2]);
      });

      test('should not allow further moves after win', () => {
        const game = createHorizontalWinGame();
        const turnBeforeAttempt = game.turn;
        
        game.tryToMarkField(5);
        
        expect(game.fields[5].occupiedBy).toBeUndefined();
        expect(game.turn).toBe(turnBeforeAttempt);
      });

      test('should detect NOUGHT as winner', () => {
        const game = createNoughtWinGame();
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.NOUGHT);
      });
    });

    describe('Custom fieldsToWin', () => {
      test('should detect win with 3 fields on 5x5 board (horizontal)', () => {
        const game = new TicTacToe(5, 3);
        // Create horizontal win with 3 consecutive fields
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(5); // NOUGHT
        game.tryToMarkField(1); // CROSS
        game.tryToMarkField(6); // NOUGHT
        game.tryToMarkField(2); // CROSS wins (3 in a row)
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([0, 1, 2]);
      });

      test('should detect win with 3 fields on 5x5 board (vertical)', () => {
        const game = new TicTacToe(5, 3);
        // Create vertical win with 3 consecutive fields
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(1); // NOUGHT
        game.tryToMarkField(5); // CROSS
        game.tryToMarkField(2); // NOUGHT
        game.tryToMarkField(10); // CROSS wins (3 in a column)
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([0, 5, 10]);
      });

      test('should detect win with 3 fields on 5x5 board (diagonal)', () => {
        const game = new TicTacToe(5, 3);
        // Create diagonal win with 3 consecutive fields
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(1); // NOUGHT
        game.tryToMarkField(6); // CROSS
        game.tryToMarkField(2); // NOUGHT
        game.tryToMarkField(12); // CROSS wins (3 in a diagonal)
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([0, 6, 12]);
      });

      test('should detect win with 4 fields on 5x5 board', () => {
        const game = new TicTacToe(5, 4);
        // Create horizontal win with 4 consecutive fields
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(5); // NOUGHT
        game.tryToMarkField(1); // CROSS
        game.tryToMarkField(6); // NOUGHT
        game.tryToMarkField(2); // CROSS
        game.tryToMarkField(7); // NOUGHT
        game.tryToMarkField(3); // CROSS wins (4 in a row)
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([0, 1, 2, 3]);
      });

      test('should not detect win with fewer than fieldsToWin consecutive fields', () => {
        const game = new TicTacToe(5, 4);
        // Create only 3 consecutive fields (not enough for win)
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(1); // NOUGHT
        game.tryToMarkField(2); // CROSS
        game.tryToMarkField(3); // NOUGHT
        game.tryToMarkField(5); // CROSS (breaks the sequence)
        
        expect(game.state).toBe(GameState.RUNNING);
        expect(game.winner).toBeUndefined();
        expect(game.solution).toBeUndefined();
      });

      test('should detect win in middle of line (not at start)', () => {
        const game = new TicTacToe(5, 3);
        // Create win starting at position 1 in a row (not at position 0)
        game.tryToMarkField(1); // CROSS
        game.tryToMarkField(0); // NOUGHT
        game.tryToMarkField(2); // CROSS
        game.tryToMarkField(5); // NOUGHT
        game.tryToMarkField(3); // CROSS wins (positions 1,2,3)
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([1, 2, 3]);
      });

      test('solution should contain exactly fieldsToWin indices', () => {
        const game = new TicTacToe(5, 3);
        game.tryToMarkField(0);
        game.tryToMarkField(5);
        game.tryToMarkField(1);
        game.tryToMarkField(6);
        game.tryToMarkField(2);
        
        expect(game.solution).toHaveLength(3);
        expect(game.solution).toEqual([0, 1, 2]);
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
});

