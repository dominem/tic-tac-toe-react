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
  });
});

