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
  private readonly diagonalA: number[];
  private readonly diagonalB: number[];

  constructor(rowSize = 3) {
    this.rowSize = rowSize;
    this.boardSize = rowSize * rowSize;
    this.fields = this.generateFields();
    this.diagonalA = this.generateDiagonalA();
    this.diagonalB = this.generateDiagonalB();
  }
  
  tryToMarkField = (index: number) => {
    if (this.canMarkField(index)) {
      this.markField(index);
      this._checkForWinner(index);
      this._checkForDraw();
      this.switchTurn();
    }
  };

  _checkForWinner = (index: number) => {
    const row = this.fieldsRow(index);
    const columnFromLeft = this.fieldsColumnFromLeft(index);
    const columnFromRight = this.fieldsColumnFromRight(index);
    if (row === columnFromLeft) this._checkForWinnerOnLine(this.diagonalA);
    if (row === columnFromRight) this._checkForWinnerOnLine(this.diagonalB);
    this._checkForWinnerOnLine(this.rowIndexes(row));
    this._checkForWinnerOnLine(this.columnIndexes(columnFromLeft));
  };

  _checkForDraw = () => {
    if (this.isWholeBoardOccupied()) {
      this.state = GameState.OVER;
    }
  };

  _checkForWinnerOnLine = (line: number[]) => {
    if (this.isWholeLineOccupied(line)) {
      this.state = GameState.OVER;
      this.winner = this.turn;
      this.solution = line;
    }
  };

  private generateFields(): Field[] {
    return Array(this.boardSize).fill(0).map(() => ({} as Field));
  }

  private generateDiagonalA(): number[] {
    return this.generateDiagonal((i) => ((i - 1) * this.rowSize) + i - 1);
  }

  private generateDiagonalB(): number[] {
    return this.generateDiagonal((i) => (i * this.rowSize) - i);
  }

  private generateDiagonal(formula: (i: number) => number): number[] {
    return [...Array(this.rowSize).keys()].map((i) => formula(i + 1));
  }

  private canMarkField(index: number): boolean {
    return this.state === GameState.RUNNING && !this.fields[index].occupiedBy;
  }

  private markField(index: number): void {
    this.fields[index].occupiedBy = this.turn;
  }

  private switchTurn(): void {
    this.turn = this.turn === Player.CROSS ? Player.NOUGHT : Player.CROSS;
  }
  
  private fieldsRow(index: number): number {
    return Math.floor(index / this.rowSize) + 1;
  }

  private fieldsColumnFromLeft(index: number): number {
    return (index % this.rowSize) + 1;
  }

  private fieldsColumnFromRight(index: number): number {
    return this.rowSize - (index % this.rowSize);
  }

  private rowIndexes(row: number): number[] {
    return [...Array(this.rowSize).keys()].map((i) => i + ((row - 1) * this.rowSize));
  }

  private columnIndexes(column: number): number[] {
    return [...Array(this.rowSize).keys()].map((i) => column + (i * this.rowSize) - 1);
  }

  private isWholeLineOccupied(line: number[]): boolean {
    return line.every((i) => this.fields[i].occupiedBy === this.turn);
  }

  private isWholeBoardOccupied(): boolean {
    return this.fields.every((field) => field.occupiedBy != null);
  }
}

export default TicTacToe;
