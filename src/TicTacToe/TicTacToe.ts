export enum Player {
  CROSS = "cross",
  NOUGHT = "nought"
}

export enum GameState {
  RUNNING = "running",
  OVER = "over"
}

interface Field {
  occupiedBy?: Player;
}

/**
 * Core game engine for Tic-Tac-Toe.
 * Manages game state, player turns, board logic, and win detection.
 * Not tied to any UI framework - can be used with any frontend or backend implementation.
 */
class TicTacToe {
  state: GameState = GameState.RUNNING;
  turn: Player = Player.CROSS;
  winner?: Player;
  solution?: number[];

  public readonly rowSize: number;
  public readonly boardSize: number;
  public readonly fieldsToWin: number;
  
  /**
   * Internal board representation as a 1D array of fields.
   * 
   * The board is stored as a flat array rather than a 2D array for several advantages:
   * 
   * 1. **Simple iteration**: The entire board can be iterated with a single loop,
   *    making operations like checking for draws or rendering straightforward.
   * 
   * 2. **Efficient access**: Direct index access (O(1)) without nested array lookups.
   *    The public API uses indices (e.g., `tryToMarkField(index)`), which maps
   *    naturally to this representation.
   * 
   * 3. **Clean coordinate conversion**: Converting between 1D indices and 2D coordinates
   *    is simple and efficient:
   *    - Row: `Math.floor(index / rowSize)`
   *    - Column: `index % rowSize`
   *    - Index: `row * rowSize + column`
   * 
   * 4. **Serialization-friendly**: A flat array is easier to serialize/deserialize
   *    for saving game state, network transfer, or persistence.
   * 
   * 5. **Memory efficiency**: Single contiguous array with no nested structure overhead.
   * 
   * 6. **Flexible board sizes**: Works seamlessly with variable board sizes (3x3, 5x5, etc.)
   *    without structural changes.
   * 
   * Example mapping for a 3x3 board (rowSize=3):
   * ```
   * 2D coordinates → 1D index
   * [0,0] → 0    [0,1] → 1    [0,2] → 2
   * [1,0] → 3    [1,1] → 4    [1,2] → 5
   * [2,0] → 6    [2,1] → 7    [2,2] → 8
   * ```
   * 
   * The UI layer handles the 2D visual layout using CSS Grid, keeping the engine
   * framework-agnostic and the data representation simple.
   */
  public readonly fields: Field[];

  constructor(rowSize = 3, fieldsToWin?: number) {
    if (!Number.isInteger(rowSize) || rowSize < 3) {
      throw new Error(`rowSize must be an integer >= 3, got ${rowSize}`);
    }
    this.rowSize = rowSize;
    this.boardSize = rowSize * rowSize;
    
    // Default fieldsToWin to rowSize if not provided, otherwise validate
    const winRequirement = fieldsToWin ?? rowSize;
    if (!Number.isInteger(winRequirement) || winRequirement < 3 || winRequirement > rowSize) {
      throw new Error(`fieldsToWin must be an integer >= 3 and <= rowSize (${rowSize}), got ${winRequirement}`);
    }
    this.fieldsToWin = winRequirement;
    
    this.fields = this.generateFields();
  }
  
  /**
   * Attempts to mark a field at the given index with the current player's mark.
   * Only succeeds if the game is running and the field is unoccupied.
   * After marking, checks for win/draw conditions and switches turns.
   */
  public tryToMarkField(index: number): void {
    if (this.canMarkField(index)) {
      this.markField(index);
      this.checkForWinner(index);
      // Only check for draw if no winner was found
      if (this.state === GameState.RUNNING) {
        this.checkForDraw();
      }
      // Only switch turn if game is still running
      if (this.state === GameState.RUNNING) {
        this.switchTurn();
      }
    }
  }

  /**
   * Checks if the move at the given index creates a winning line.
   * Evaluates the row, column, and diagonals (if applicable) that contain this field.
   */
  private checkForWinner(index: number): void {
    const rowNumber = this.getRowNumber(index);
    const columnNumber = this.getColumnNumber(index);
    
    // Check all diagonal sequences containing this field
    const diagonalSequences = this.getDiagonalSequencesContaining(index);
    for (const sequence of diagonalSequences) {
      this.evaluateLineForWin(sequence);
    }
    
    // Always check the row and column containing this field
    this.evaluateLineForWin(this.getRowFieldIndices(rowNumber));
    this.evaluateLineForWin(this.getColumnFieldIndices(columnNumber));
  }

  /**
   * Checks if the game has ended in a draw (all fields occupied with no winner).
   */
  private checkForDraw(): void {
    if (this.isWholeBoardOccupied()) {
      this.state = GameState.OVER;
    }
  }

  /**
   * Evaluates a line (row, column, or diagonal) to see if the current player has won.
   * If there are consecutive fieldsToWin fields in the line occupied by the current player,
   * sets the game state to OVER and records the winner and winning sequence indices.
   */
  private evaluateLineForWin(line: number[]): void {
    const winningSequence = this.findWinningSequence(line);
    if (winningSequence) {
      this.state = GameState.OVER;
      this.winner = this.turn;
      this.solution = winningSequence;
    }
  }

  /**
   * Creates an array of empty fields for the game board.
   */
  private generateFields(): Field[] {
    return Array(this.boardSize).fill(0).map(() => ({} as Field));
  }

  /**
   * Checks if a field can be marked (game is running and field is unoccupied).
   * Throws an error if the index is out of bounds.
   */
  private canMarkField(index: number): boolean {
    if (index < 0 || index >= this.boardSize) {
      throw new Error(`Index ${index} is out of bounds. Valid range: 0-${this.boardSize - 1}`);
    }
    return this.state === GameState.RUNNING && !this.fields[index].occupiedBy;
  }

  /**
   * Marks a field with the current player's symbol.
   */
  private markField(index: number): void {
    this.fields[index].occupiedBy = this.turn;
  }

  /**
   * Switches the turn to the other player.
   */
  private switchTurn(): void {
    this.turn = this.turn === Player.CROSS ? Player.NOUGHT : Player.CROSS;
  }
  
  /**
   * Returns the row number (0-based) for a given field index.
   */
  private getRowNumber(index: number): number {
    return Math.floor(index / this.rowSize);
  }

  /**
   * Returns the column number (0-based, counting from left) for a given field index.
   */
  private getColumnNumber(index: number): number {
    return index % this.rowSize;
  }

  /**
   * Returns all field indices for a given row number (0-based).
   */
  private getRowFieldIndices(row: number): number[] {
    return [...Array(this.rowSize).keys()].map((i) => i + (row * this.rowSize));
  }

  /**
   * Returns all field indices for a given column number (0-based, counting from left).
   */
  private getColumnFieldIndices(column: number): number[] {
    return [...Array(this.rowSize).keys()].map((i) => column + (i * this.rowSize));
  }

  /**
   * Returns all indices in the main diagonal (top-left to bottom-right) that contains (row, col).
   * Main diagonals have constant (row - col) value.
   */
  private getMainDiagonalSequenceContaining(row: number, col: number): number[] {
    const diagonalConstant = row - col;
    const sequence: number[] = [];
    
    // Find the starting position (top-leftmost valid cell)
    let r = Math.max(0, diagonalConstant);
    let c = Math.max(0, -diagonalConstant);
    
    // Continue until we go out of bounds
    while (r < this.rowSize && c < this.rowSize) {
      sequence.push(r * this.rowSize + c);
      r++;
      c++;
    }
    
    return sequence;
  }

  /**
   * Returns all indices in the anti-diagonal (top-right to bottom-left) that contains (row, col).
   * Anti-diagonals have constant (row + col) value.
   */
  private getAntiDiagonalSequenceContaining(row: number, col: number): number[] {
    const diagonalConstant = row + col;
    const sequence: number[] = [];
    
    // Find the starting position (top-rightmost valid cell)
    let r = Math.max(0, diagonalConstant - (this.rowSize - 1));
    let c = Math.min(this.rowSize - 1, diagonalConstant);
    
    // Continue until we go out of bounds
    while (r < this.rowSize && c >= 0 && r + c === diagonalConstant) {
      sequence.push(r * this.rowSize + c);
      r++;
      c--;
    }
    
    return sequence;
  }

  /**
   * Returns all diagonal sequences (main and anti) that contain the given index.
   * Filters out sequences shorter than fieldsToWin as an optimization.
   */
  private getDiagonalSequencesContaining(index: number): number[][] {
    const row = this.getRowNumber(index);
    const col = this.getColumnNumber(index);
    
    const mainDiagonal = this.getMainDiagonalSequenceContaining(row, col);
    const antiDiagonal = this.getAntiDiagonalSequenceContaining(row, col);
    
    const sequences: number[][] = [];
    
    // Only include sequences that are long enough to potentially contain a win
    if (mainDiagonal.length >= this.fieldsToWin) {
      sequences.push(mainDiagonal);
    }
    if (antiDiagonal.length >= this.fieldsToWin) {
      sequences.push(antiDiagonal);
    }
    
    return sequences;
  }

  /**
   * Finds a winning sequence of consecutive fieldsToWin fields in a line.
   * Returns the sequence of indices if found, undefined otherwise.
   */
  private findWinningSequence(line: number[]): number[] | undefined {
    // Use sliding window to find consecutive fieldsToWin fields
    for (let i = 0; i <= line.length - this.fieldsToWin; i++) {
      const sequence = line.slice(i, i + this.fieldsToWin);
      if (sequence.every((index) => this.fields[index].occupiedBy === this.turn)) {
        return sequence;
      }
    }
    return undefined;
  }

  /**
   * Checks if all fields on the board are occupied (indicating a draw if no winner).
   */
  private isWholeBoardOccupied(): boolean {
    return this.fields.every((field) => field.occupiedBy != null);
  }
}

export default TicTacToe;
