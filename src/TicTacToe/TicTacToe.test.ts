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

  describe('Draw Detection', () => {
    test('should detect draw when board is full with no winner', () => {
      const game = new TicTacToe();
      // Create a draw scenario
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(3); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(8); // CROSS
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBeUndefined();
      expect(game.solution).toBeUndefined();
    });

    test('should change game state to OVER on draw', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(3); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(8); // CROSS
      
      expect(game.state).toBe(GameState.OVER);
    });

    test('should keep winner undefined on draw', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(3); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(8); // CROSS
      
      expect(game.winner).toBeUndefined();
    });

    test('should keep solution undefined on draw', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(3); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(8); // CROSS
      
      expect(game.solution).toBeUndefined();
    });

    test('should not allow further moves after draw', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(3); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(8); // CROSS
      
      const turnBeforeAttempt = game.turn;
      // Try to mark a field (though all are occupied)
      game.tryToMarkField(0); // Already occupied, but also game is over
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.turn).toBe(turnBeforeAttempt);
    });
  });

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

  describe('Edge Cases & Integration', () => {
    test('should handle complete game flow leading to win', () => {
      const game = new TicTacToe();
      
      // Simulate a complete game
      game.tryToMarkField(0); // CROSS
      expect(game.state).toBe(GameState.RUNNING);
      expect(game.turn).toBe(Player.NOUGHT);
      
      game.tryToMarkField(3); // NOUGHT
      expect(game.state).toBe(GameState.RUNNING);
      expect(game.turn).toBe(Player.CROSS);
      
      game.tryToMarkField(1); // CROSS
      expect(game.state).toBe(GameState.RUNNING);
      expect(game.turn).toBe(Player.NOUGHT);
      
      game.tryToMarkField(4); // NOUGHT
      expect(game.state).toBe(GameState.RUNNING);
      expect(game.turn).toBe(Player.CROSS);
      
      game.tryToMarkField(2); // CROSS wins
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBe(Player.CROSS);
      expect(game.solution).toEqual([0, 1, 2]);
    });

    test('should handle complete game flow leading to draw', () => {
      const game = new TicTacToe();
      
      // Simulate a complete draw game
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(1); // NOUGHT
      game.tryToMarkField(2); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(3); // CROSS
      game.tryToMarkField(5); // NOUGHT
      game.tryToMarkField(7); // CROSS
      game.tryToMarkField(6); // NOUGHT
      game.tryToMarkField(8); // CROSS
      
      expect(game.state).toBe(GameState.OVER);
      expect(game.winner).toBeUndefined();
      expect(game.solution).toBeUndefined();
      expect(game.fields.every(field => field.occupiedBy != null)).toBe(true);
    });

    test('should prevent marking same field twice', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0);
      expect(game.fields[0].occupiedBy).toBe(Player.CROSS);
      
      const turnBeforeSecondAttempt = game.turn;
      game.tryToMarkField(0);
      
      expect(game.fields[0].occupiedBy).toBe(Player.CROSS);
      expect(game.turn).toBe(turnBeforeSecondAttempt);
    });

    test('should prevent moves after game ends', () => {
      const game = new TicTacToe();
      // Create a win
      game.tryToMarkField(0); // CROSS
      game.tryToMarkField(3); // NOUGHT
      game.tryToMarkField(1); // CROSS
      game.tryToMarkField(4); // NOUGHT
      game.tryToMarkField(2); // CROSS wins
      
      expect(game.state).toBe(GameState.OVER);
      
      // Try multiple moves after game ends
      const unoccupiedFields = game.fields
        .map((field, index) => ({ field, index }))
        .filter(({ field }) => !field.occupiedBy);
      
      unoccupiedFields.forEach(({ index }) => {
        const turnBefore = game.turn;
        game.tryToMarkField(index);
        expect(game.fields[index].occupiedBy).toBeUndefined();
        expect(game.turn).toBe(turnBefore);
      });
    });

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
  });
});
