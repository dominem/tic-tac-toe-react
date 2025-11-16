<!-- 9ead8b7f-1582-46c3-8328-b5cac3cb10bc 73736632-5182-4928-91de-c18083524652 -->
# Fix Diagonal Win Detection for Custom fieldsToWin (TDD Approach)

## Overview

Currently, diagonal wins are only detected on the two full-length diagonals (main and anti-diagonal), even when `fieldsToWin < rowSize`. This is inconsistent with horizontal and vertical wins, which use a sliding window approach. This plan uses TDD: write failing tests first, then implement the fix.

## Problem Statement

When `fieldsToWin < rowSize`, many diagonal sequences that should be valid wins aren't detected. For example, on a 5x5 board with `fieldsToWin=3`:

- ✅ Currently detected: `[0, 6, 12]` (on main diagonal)
- ❌ Not detected: `[1, 7, 13]` (diagonal starting at position 1)
- ❌ Not detected: `[5, 11, 17]` (diagonal starting at row 1, col 0)

## Solution Approach

Check all diagonal sequences containing a marked field, not just the two full-length diagonals. Use the same sliding window approach as rows/columns.

## TDD Implementation Steps

### Phase 1: Write Failing Tests (Red)

**File: `src/TicTacToe/win-detection.test.ts`**

1. **Add test for main diagonal win not on full main diagonal**

- Test: 5x5 board, fieldsToWin=3, win at `[1, 7, 13]` (diagonal starting at row 0, col 1)
- Expected: Should detect win and set solution to `[1, 7, 13]`
- Status: Will fail initially

2. **Add test for main diagonal win starting in middle row**

- Test: 5x5 board, fieldsToWin=3, win at `[5, 11, 17]` (diagonal starting at row 1, col 0)
- Expected: Should detect win
- Status: Will fail initially

3. **Add test for anti-diagonal win not on full anti-diagonal**

- Test: 5x5 board, fieldsToWin=3, win at `[3, 7, 11]` (anti-diagonal starting at row 0, col 3)
- Expected: Should detect win and set solution to `[3, 7, 11]`
- Status: Will fail initially

4. **Add test for anti-diagonal win starting in middle**

- Test: 5x5 board, fieldsToWin=3, win at `[4, 8, 12]` (anti-diagonal starting at row 0, col 4, but not the full anti-diagonal)
- Expected: Should detect win
- Status: Will fail initially

5. **Add test for diagonal win near edges**

- Test: 6x6 board, fieldsToWin=3, win at `[2, 9, 16]` (diagonal near top-right)
- Expected: Should detect win
- Status: Will fail initially

6. **Add test for larger board with smaller fieldsToWin**

- Test: 7x7 board, fieldsToWin=4, win at `[1, 9, 17, 25]` (main diagonal not on full diagonal)
- Expected: Should detect win
- Status: Will fail initially

### Phase 2: Implement Solution (Green)

**File: `src/TicTacToe/TicTacToe.ts`**

7. **Add helper method: `getMainDiagonalSequenceContaining(row, col)`**

- Returns all indices in the main diagonal (top-left to bottom-right) that contains (row, col)
- Algorithm: Find all cells where `(r - c) = (row - col)` within bounds
- Convert to indices: `r * rowSize + c`

8. **Add helper method: `getAntiDiagonalSequenceContaining(row, col)`**

- Returns all indices in the anti-diagonal (top-right to bottom-left) that contains (row, col)
- Algorithm: Find all cells where `(r + c) = (row + col)` within bounds
- Convert to indices: `r * rowSize + c`

9. **Add method: `getDiagonalSequencesContaining(index)`**

- Gets row/col from index
- Returns array of two sequences: `[mainDiagonalSequence, antiDiagonalSequence]`
- Filters out sequences shorter than `fieldsToWin` (optimization)

10. **Update `checkForWinner(index)` method**

- Remove current logic that only checks `mainDiagonal` and `antiDiagonal` when field is on them
- Call `getDiagonalSequencesContaining(index)` to get all relevant sequences
- Loop through sequences and call `evaluateLineForWin` for each
- Keep existing row/column checks unchanged

### Phase 3: Refactor & Verify (Refactor)

11. **Run all existing tests**

- Verify main diagonal and anti-diagonal wins still work (3x3 board)
- Verify existing custom fieldsToWin tests still pass
- Verify no regressions

12. **Clean up unused code (optional)**

- Consider removing `mainDiagonal` and `antiDiagonal` properties if no longer needed
- Or keep for potential future use

## Algorithm Details

### Main Diagonal Sequence

For a cell at (row, col), the main diagonal contains all cells where `r - c = row - col`:

- Start: `max(0, row - col)` row, `max(0, col - row)` col
- End: Continue until out of bounds
- Generate indices: `r * rowSize + c` for each valid (r, c)

### Anti-Diagonal Sequence

For a cell at (row, col), the anti-diagonal contains all cells where `r + c = row + col`:

- Start: `max(0, row + col - (rowSize - 1))` row, `min(rowSize - 1, row + col)` col
- End: Continue until out of bounds
- Generate indices: `r * rowSize + c` for each valid (r, c)

## Files to Modify

- `src/TicTacToe/win-detection.test.ts` - Add failing tests first (Phase 1)
- `src/TicTacToe/TicTacToe.ts` - Implement solution (Phase 2)

## Expected Test Results

**Before implementation:**

- New diagonal tests: ❌ Fail (wins not detected)
- Existing tests: ✅ Pass (no regressions)

**After implementation:**

- New diagonal tests: ✅ Pass (wins detected correctly)
- Existing tests: ✅ Pass (backward compatibility maintained)

### To-dos

- [ ] Add failing test for main diagonal win not on full main diagonal (5x5, fieldsToWin=3, win at [1, 7, 13])
- [ ] Add failing test for main diagonal win starting in middle row (5x5, fieldsToWin=3, win at [5, 11, 17])
- [ ] Add failing test for anti-diagonal win not on full anti-diagonal (5x5, fieldsToWin=3, win at [3, 7, 11])
- [ ] Add failing test for anti-diagonal win starting in middle (5x5, fieldsToWin=3, win at [4, 8, 12])
- [ ] Add failing test for diagonal win near edges (6x6, fieldsToWin=3, win at [2, 9, 16])
- [ ] Add failing test for larger board with smaller fieldsToWin (7x7, fieldsToWin=4, win at [1, 9, 17, 25])
- [ ] Implement getMainDiagonalSequenceContaining(row, col) helper method
- [ ] Implement getAntiDiagonalSequenceContaining(row, col) helper method
- [ ] Implement getDiagonalSequencesContaining(index) method using the two helpers
- [ ] Update checkForWinner method to use getDiagonalSequencesContaining instead of only checking main/anti diagonals
- [ ] Run all tests to verify new tests pass and existing tests still pass (no regressions)