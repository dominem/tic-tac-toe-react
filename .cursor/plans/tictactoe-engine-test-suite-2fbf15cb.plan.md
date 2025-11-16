<!-- 2fbf15cb-09cb-4860-a622-01f071dc6027 9a356efa-16ba-4bdd-b383-c823f793e1ae -->
# TicTacToe Engine Test Suite Plan

## Overview

Create a test file `src/TicTacToe/TicTacToe.test.ts` using `@rstest/core` to thoroughly test the TicTacToe engine class. The engine is framework-agnostic and manages game logic, so tests should focus on pure logic without React dependencies.

## Test File Structure

- **Location**: `src/TicTacToe/TicTacToe.test.ts`
- **Framework**: `@rstest/core` (already configured in project)
- **Pattern**: Follow existing `App.test.tsx` pattern using `test()` function

## Test Categories

### 1. Constructor & Initialization Tests

- Default constructor creates 3x3 board (9 fields)
- Custom row sizes (e.g., 4x4, 5x5) create correct board sizes
- Initial state: `GameState.RUNNING`
- Initial turn: `Player.CROSS`
- Initial `winner` and `solution` are undefined
- All fields are unoccupied initially
- `rowSize` and `boardSize` properties are set correctly

### 2. Field Marking Tests

- Valid move marks field with current player
- Valid move switches turn (CROSS → NOUGHT → CROSS)
- Invalid move: out of bounds index (negative, too large)
- Invalid move: field already occupied
- Invalid move: game already over
- Multiple valid moves in sequence

### 3. Win Detection Tests

#### Horizontal Wins

- Win on first row (indices 0, 1, 2 for 3x3)
- Win on middle row (indices 3, 4, 5 for 3x3)
- Win on last row (indices 6, 7, 8 for 3x3)
- Solution array contains correct winning indices

#### Vertical Wins

- Win on first column
- Win on middle column
- Win on last column
- Solution array contains correct winning indices

#### Diagonal Wins

- Win on diagonal A (top-left to bottom-right: 0, 4, 8 for 3x3)
- Win on diagonal B (top-right to bottom-left: 2, 4, 6 for 3x3)
- Solution array contains correct winning indices

#### Win State Management

- Game state changes to `GameState.OVER` on win
- Winner is set to the winning player
- No further moves allowed after win
- Turn does not switch after win

### 4. Draw Detection Tests

- Full board with no winner results in draw
- Game state changes to `GameState.OVER` on draw
- Winner remains undefined on draw
- Solution remains undefined on draw
- No further moves allowed after draw

### 5. Game State Management Tests

- State transitions: RUNNING → OVER
- Moves blocked when state is OVER
- Turn switching only occurs on valid moves
- Turn switching does not occur on invalid moves

### 6. Edge Cases & Integration Tests

- Complete game flow: multiple moves leading to win
- Complete game flow: multiple moves leading to draw
- Attempting to mark same field twice
- Attempting moves after game ends
- Testing with different board sizes (4x4, 5x5) for win detection
- Diagonal generation correctness for different board sizes

## Implementation Details

### Key Methods to Test

- `tryToMarkField(index)` - main public API
- Constructor behavior
- Private methods tested indirectly through public API

### Test Data Patterns

- Use descriptive test names: `'should mark field and switch turn on valid move'`
- Use `describe` blocks to group related tests
- Test both 3x3 (default) and custom board sizes where relevant
- Use helper functions to set up game states (e.g., `createWinningState()`)

### Example Test Structure with expect API

```typescript
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

    test('should initialize with RUNNING state', () => {
      const game = new TicTacToe();
      expect(game.state).toBe(GameState.RUNNING);
      expect(game.turn).toBe(Player.CROSS);
      expect(game.winner).toBeUndefined();
      expect(game.solution).toBeUndefined();
    });
  });
  
  describe('Field Marking', () => {
    test('should mark field and switch turn on valid move', () => {
      const game = new TicTacToe();
      game.tryToMarkField(0);
      expect(game.fields[0].occupiedBy).toBe(Player.CROSS);
      expect(game.turn).toBe(Player.NOUGHT);
    });
  });
  
  // ... other describe blocks
});
```

### expect API Usage Patterns

Based on [rstest expect API documentation](https://rstest.rs/api/test-api/expect.md), use the following matchers:

#### Equality & Type Checks

- `expect(value).toBe(expected)` - Strict equality for primitives, enums, and object references
- `expect(value).toEqual(expected)` - Deep equality for objects and arrays
- `expect(value).toBeUndefined()` / `toBeDefined()` - Check for undefined
- `expect(value).toBeNull()` - Check for null
- `expect(value).toBeTypeOf('string' | 'number' | 'object' | ...)` - Type checking

#### Array & Object Matchers

- `expect(array).toHaveLength(n)` - Check array length
- `expect(array).toContain(item)` - Check if array contains item
- `expect(array).toContainEqual(item)` - Deep equality check in array
- `expect(array).toEqual(expect.arrayContaining([...]))` - Partial array match
- `expect(object).toMatchObject({...})` - Partial object match
- `expect(object).toHaveProperty('path', value?)` - Check object property

#### Number Comparisons

- `expect(n).toBeGreaterThan(x)` / `toBeLessThan(x)`
- `expect(n).toBeGreaterThanOrEqual(x)` / `toBeLessThanOrEqual(x)`

#### Boolean & Truthiness

- `expect(value).toBeTruthy()` / `toBeFalsy()`

#### Example Assertions for TicTacToe Tests

```typescript
// Initialization
expect(game.state).toBe(GameState.RUNNING);
expect(game.winner).toBeUndefined();
expect(game.fields).toHaveLength(9);

// Field marking
expect(game.fields[0].occupiedBy).toBe(Player.CROSS);
expect(game.turn).toBe(Player.NOUGHT);

// Win detection
expect(game.state).toBe(GameState.OVER);
expect(game.winner).toBe(Player.CROSS);
expect(game.solution).toEqual([0, 1, 2]); // Horizontal win
expect(game.solution).toContain(4); // Diagonal includes center

// Draw detection
expect(game.state).toBe(GameState.OVER);
expect(game.winner).toBeUndefined();
expect(game.solution).toBeUndefined();

// Array checks
expect(game.fields.every(f => f.occupiedBy != null)).toBe(true);
expect(game.solution).toEqual(expect.arrayContaining([0, 1, 2]));
```

## Files to Create

- `src/TicTacToe/TicTacToe.test.ts` - Main test file with all test cases

### To-dos

- [ ] Create src/TicTacToe/TicTacToe.test.ts with basic test structure and imports
- [ ] Add tests for constructor and initialization (default/custom row sizes, initial state)
- [ ] Add tests for field marking (valid/invalid moves, turn switching)
- [ ] Add tests for win detection (horizontal, vertical, diagonal wins, solution array)
- [ ] Add tests for draw detection (full board with no winner)
- [ ] Add tests for game state management (transitions, blocking moves after game over)
- [ ] Add tests for edge cases (out of bounds, duplicate moves, different board sizes)