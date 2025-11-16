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

  /** Indices for the main diagonal (top-left to bottom-right) */
  private readonly mainDiagonal: number[];
  /** Indices for the anti-diagonal (top-right to bottom-left) */
  private readonly antiDiagonal: number[];

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
    this.mainDiagonal = this.generateMainDiagonal();
    this.antiDiagonal = this.generateAntiDiagonal();
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
    const reverseColumnNumber = this.getReverseColumnNumber(index);
    
    // A field is on the main diagonal if its row number equals its column number
    if (rowNumber === columnNumber) {
      this.evaluateLineForWin(this.mainDiagonal);
    }
    // A field is on the anti-diagonal if its row number equals its reverse column number
    if (rowNumber === reverseColumnNumber) {
      this.evaluateLineForWin(this.antiDiagonal);
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
   * Generates indices for the main diagonal (top-left to bottom-right).
   * Formula: for row i (0-based), index = i * rowSize + i
   */
  private generateMainDiagonal(): number[] {
    return this.generateDiagonal((i) => (i * this.rowSize) + i);
  }

  /**
   * Generates indices for the anti-diagonal (top-right to bottom-left).
   * Formula: for row i (0-based), index = (i + 1) * rowSize - (i + 1)
   */
  private generateAntiDiagonal(): number[] {
    return this.generateDiagonal((i) => ((i + 1) * this.rowSize) - (i + 1));
  }

  /**
   * Helper to generate a diagonal by applying a formula to each row index.
   * @param formula Function that calculates the field index for a given row number (0-based)
   */
  private generateDiagonal(formula: (i: number) => number): number[] {
    return [...Array(this.rowSize).keys()].map((i) => formula(i));
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
   * Returns the column number (0-based, counting from right) for a given field index.
   * Used to determine if a field is on the anti-diagonal.
   */
  private getReverseColumnNumber(index: number): number {
    return this.rowSize - 1 - (index % this.rowSize);
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
