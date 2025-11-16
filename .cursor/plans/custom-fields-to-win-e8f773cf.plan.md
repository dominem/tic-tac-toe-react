<!-- e8f773cf-5ecc-4561-92ee-8cba3df04de8 4e76e38c-86ab-4465-a73e-b16f38dd7eee -->
# Custom Fields to Win Support

## Overview

Add support for a configurable number of fields required to win, with validation (min: 3, max: rowSize). The win detection will check for consecutive N fields in any line (row, column, or diagonal) rather than requiring all fields in a line.

## Implementation Details

### 1. Update Constructor (`TicTacToe.ts`)

- Add `fieldsToWin` parameter to constructor (default: `rowSize` for backward compatibility)
- Add validation: `fieldsToWin >= 3 && fieldsToWin <= rowSize`
- Store as `public readonly fieldsToWin: number`

### 2. Update Win Detection Logic (`TicTacToe.ts`)

- Modify `isLineWinningForCurrentPlayer()` to check for consecutive N fields instead of all fields
- Update `evaluateLineForWin()` to find and return the winning sequence (exactly N consecutive fields)
- The `solution` array should contain exactly N consecutive field indices that form the win

### 3. Update Tests

- Add tests in `win-detection.test.ts` for custom `fieldsToWin` values
- Add tests in `custom-board-sizes.test.ts` for different board sizes with custom `fieldsToWin`
- Add validation tests in `initialization.test.ts` for invalid `fieldsToWin` values

## Files to Modify

- `/home/dm/repos/tic-tac-toe-react/src/TicTacToe/TicTacToe.ts` - Core implementation
- `/home/dm/repos/tic-tac-toe-react/src/TicTacToe/win-detection.test.ts` - Win detection tests
- `/home/dm/repos/tic-tac-toe-react/src/TicTacToe/custom-board-sizes.test.ts` - Custom board size tests
- `/home/dm/repos/tic-tac-toe-react/src/TicTacToe/initialization.test.ts` - Validation tests

## Key Changes

- Constructor signature: `constructor(rowSize = 3, fieldsToWin?: number)`
- Win detection will use sliding window approach to find consecutive N fields in lines
- Solution array will contain exactly N indices (the winning sequence)

### To-dos

- [ ] Add fieldsToWin parameter to constructor with validation (min 3, max rowSize), default to rowSize
- [ ] Modify isLineWinningForCurrentPlayer to check for consecutive N fields using sliding window approach
- [ ] Update evaluateLineForWin to store exactly N consecutive field indices in solution array
- [ ] Add tests for custom fieldsToWin values in win-detection.test.ts
- [ ] Add tests for different board sizes with custom fieldsToWin in custom-board-sizes.test.ts
- [ ] Add validation tests for invalid fieldsToWin values in initialization.test.ts