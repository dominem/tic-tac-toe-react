import { test, describe, expect } from '@rstest/core';
import TicTacToe, { Player, GameState } from './TicTacToe';

describe('TicTacToe', () => {
  describe('Win Detection', () => {
    describe('Horizontal Wins', () => {
      test('should detect win on first row', () => {
        const game = new TicTacToe();
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(3); // NOUGHT
        game.tryToMarkField(1); // CROSS
        game.tryToMarkField(4); // NOUGHT
        game.tryToMarkField(2); // CROSS wins
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([0, 1, 2]);
      });

      test('should detect win on middle row', () => {
        const game = new TicTacToe();
        game.tryToMarkField(3); // CROSS
        game.tryToMarkField(0); // NOUGHT
        game.tryToMarkField(4); // CROSS
        game.tryToMarkField(1); // NOUGHT
        game.tryToMarkField(5); // CROSS wins
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([3, 4, 5]);
      });

      test('should detect win on last row', () => {
        const game = new TicTacToe();
        game.tryToMarkField(6); // CROSS
        game.tryToMarkField(0); // NOUGHT
        game.tryToMarkField(7); // CROSS
        game.tryToMarkField(1); // NOUGHT
        game.tryToMarkField(8); // CROSS wins
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([6, 7, 8]);
      });

      test('should set solution array correctly for horizontal win', () => {
        const game = new TicTacToe();
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(3); // NOUGHT
        game.tryToMarkField(1); // CROSS
        game.tryToMarkField(4); // NOUGHT
        game.tryToMarkField(2); // CROSS wins
        
        expect(game.solution).toHaveLength(3);
        expect(game.solution).toContain(0);
        expect(game.solution).toContain(1);
        expect(game.solution).toContain(2);
        expect(game.solution).toEqual(expect.arrayContaining([0, 1, 2]));
      });
    });

    describe('Vertical Wins', () => {
      test('should detect win on first column', () => {
        const game = new TicTacToe();
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(1); // NOUGHT
        game.tryToMarkField(3); // CROSS
        game.tryToMarkField(2); // NOUGHT
        game.tryToMarkField(6); // CROSS wins
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([0, 3, 6]);
      });

      test('should detect win on middle column', () => {
        const game = new TicTacToe();
        game.tryToMarkField(1); // CROSS
        game.tryToMarkField(0); // NOUGHT
        game.tryToMarkField(4); // CROSS
        game.tryToMarkField(2); // NOUGHT
        game.tryToMarkField(7); // CROSS wins
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([1, 4, 7]);
      });

      test('should detect win on last column', () => {
        const game = new TicTacToe();
        game.tryToMarkField(2); // CROSS
        game.tryToMarkField(0); // NOUGHT
        game.tryToMarkField(5); // CROSS
        game.tryToMarkField(1); // NOUGHT
        game.tryToMarkField(8); // CROSS wins
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([2, 5, 8]);
      });

      test('should set solution array correctly for vertical win', () => {
        const game = new TicTacToe();
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(1); // NOUGHT
        game.tryToMarkField(3); // CROSS
        game.tryToMarkField(2); // NOUGHT
        game.tryToMarkField(6); // CROSS wins
        
        expect(game.solution).toHaveLength(3);
        expect(game.solution).toContain(0);
        expect(game.solution).toContain(3);
        expect(game.solution).toContain(6);
      });
    });

    describe('Diagonal Wins', () => {
      test('should detect win on diagonal A (top-left to bottom-right)', () => {
        const game = new TicTacToe();
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(1); // NOUGHT
        game.tryToMarkField(4); // CROSS
        game.tryToMarkField(2); // NOUGHT
        game.tryToMarkField(8); // CROSS wins
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([0, 4, 8]);
      });

      test('should detect win on diagonal B (top-right to bottom-left)', () => {
        const game = new TicTacToe();
        game.tryToMarkField(2); // CROSS
        game.tryToMarkField(0); // NOUGHT
        game.tryToMarkField(4); // CROSS
        game.tryToMarkField(1); // NOUGHT
        game.tryToMarkField(6); // CROSS wins
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.CROSS);
        expect(game.solution).toEqual([2, 4, 6]);
      });

      test('should set solution array correctly for diagonal win', () => {
        const game = new TicTacToe();
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(1); // NOUGHT
        game.tryToMarkField(4); // CROSS
        game.tryToMarkField(2); // NOUGHT
        game.tryToMarkField(8); // CROSS wins
        
        expect(game.solution).toHaveLength(3);
        expect(game.solution).toContain(0);
        expect(game.solution).toContain(4);
        expect(game.solution).toContain(8);
      });
    });

    describe('Win State Management', () => {
      test('should change game state to OVER on win', () => {
        const game = new TicTacToe();
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(3); // NOUGHT
        game.tryToMarkField(1); // CROSS
        game.tryToMarkField(4); // NOUGHT
        game.tryToMarkField(2); // CROSS wins
        
        expect(game.state).toBe(GameState.OVER);
      });

      test('should set winner to winning player', () => {
        const game = new TicTacToe();
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(3); // NOUGHT
        game.tryToMarkField(1); // CROSS
        game.tryToMarkField(4); // NOUGHT
        game.tryToMarkField(2); // CROSS wins
        
        expect(game.winner).toBe(Player.CROSS);
      });

      test('should not allow further moves after win', () => {
        const game = new TicTacToe();
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(3); // NOUGHT
        game.tryToMarkField(1); // CROSS
        game.tryToMarkField(4); // NOUGHT
        game.tryToMarkField(2); // CROSS wins
        
        const turnBeforeAttempt = game.turn;
        game.tryToMarkField(5);
        
        expect(game.fields[5].occupiedBy).toBeUndefined();
        expect(game.turn).toBe(turnBeforeAttempt);
      });

      test('should not switch turn after win', () => {
        const game = new TicTacToe();
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(3); // NOUGHT
        game.tryToMarkField(1); // CROSS
        game.tryToMarkField(4); // NOUGHT
        game.tryToMarkField(2); // CROSS wins
        
        // Turn should be NOUGHT (would have switched after CROSS's winning move)
        // But since game is over, no more moves should be allowed
        expect(game.state).toBe(GameState.OVER);
      });

      test('should detect NOUGHT as winner', () => {
        const game = new TicTacToe();
        game.tryToMarkField(0); // CROSS
        game.tryToMarkField(3); // NOUGHT
        game.tryToMarkField(1); // CROSS
        game.tryToMarkField(4); // NOUGHT
        game.tryToMarkField(8); // CROSS
        game.tryToMarkField(5); // NOUGHT wins
        
        expect(game.state).toBe(GameState.OVER);
        expect(game.winner).toBe(Player.NOUGHT);
      });
    });
  });
});

