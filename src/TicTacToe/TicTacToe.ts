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
  public readonly fields: Field[];
  /** Indices for the main diagonal (top-left to bottom-right) */
  private readonly mainDiagonal: number[];
  /** Indices for the anti-diagonal (top-right to bottom-left) */
  private readonly antiDiagonal: number[];

  constructor(rowSize = 3) {
    this.rowSize = rowSize;
    this.boardSize = rowSize * rowSize;
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
      this.checkForDraw();
      this.switchTurn();
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
   * If all fields in the line are occupied by the current player, sets the game state to OVER
   * and records the winner and winning line indices.
   */
  private evaluateLineForWin(line: number[]): void {
    if (this.isLineWinningForCurrentPlayer(line)) {
      this.state = GameState.OVER;
      this.winner = this.turn;
      this.solution = line;
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
   */
  private canMarkField(index: number): boolean {
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
   * Checks if all fields in a line are occupied by the current player (indicating a win).
   */
  private isLineWinningForCurrentPlayer(line: number[]): boolean {
    return line.every((i) => this.fields[i].occupiedBy === this.turn);
  }

  /**
   * Checks if all fields on the board are occupied (indicating a draw if no winner).
   */
  private isWholeBoardOccupied(): boolean {
    return this.fields.every((field) => field.occupiedBy != null);
  }
}

export default TicTacToe;
