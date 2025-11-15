export enum Player {
  CROSS = "cross",
  NOUGHT = "nought"
}

export enum GameState {
  RUNNING = "running",
  OVER = "over"
}

interface Field {
  occupiedBy: Player | null;
}

/**
 * Core game engine for Tic-Tac-Toe.
 * Manages game state, player turns, board logic, and win detection.
 * Not tied to any UI framework - can be used with any frontend or backend implementation.
 */
class TicTacToe {
  state: GameState = GameState.RUNNING;
  turn: Player = Player.CROSS;
  winner: Player | null = null;
  solution: number[] | null = null;

  public readonly rowSize: number;
  public readonly boardSize: number;
  public readonly fields: Field[];
  private readonly diagonalA: number[];
  private readonly diagonalB: number[];

  constructor(rowSize = 3) {
    this.rowSize = rowSize;
    this.boardSize = rowSize * rowSize;
    this.fields = this._generateFields();
    this.diagonalA = this._generateDiagonalA();
    this.diagonalB = this._generateDiagonalB();
  }
  
  tryToMarkField = (index: number) => {
    if (this._canMarkField(index)) {
      this._markField(index);
      this._checkForWinner(index);
      this._checkForDraw();
      this._switchTurn();
    }
  };

  _checkForWinner = (index: number) => {
    const row = this._fieldsRow(index);
    const columnFromLeft = this._fieldsColumnFromLeft(index);
    const columnFromRight = this._fieldsColumnFromRight(index);
    if (row === columnFromLeft) this._checkForWinnerOnLine(this.diagonalA);
    if (row === columnFromRight) this._checkForWinnerOnLine(this.diagonalB);
    this._checkForWinnerOnLine(this._rowIndexes(row));
    this._checkForWinnerOnLine(this._columnIndexes(columnFromLeft));
  };

  _checkForDraw = () => {
    if (this._isWholeBoardOccupied()) {
      this.state = GameState.OVER;
    }
  };

  _checkForWinnerOnLine = (line: number[]) => {
    if (this._isWholeLineOccupied(line)) {
      this.state = GameState.OVER;
      this.winner = this.turn;
      this.solution = line;
    }
  };

  _generateFields = () => Array(this.boardSize).fill(0).map(() => ({occupiedBy: null} as Field));
  _generateDiagonalA = () => this._generateDiagonal((i) => ((i - 1) * this.rowSize) + i - 1);
  _generateDiagonalB = () => this._generateDiagonal((i) => (i * this.rowSize) - i);
  _generateDiagonal = (formula: (i: number) => number) => [...Array(this.rowSize).keys()].map((i) => formula(i + 1));
  _canMarkField = (index: number) => this.state === GameState.RUNNING && this.fields[index].occupiedBy === null;
  _markField = (index: number) => this.fields[index].occupiedBy = this.turn;
  _switchTurn = () => this.turn = this.turn === Player.CROSS ? Player.NOUGHT : Player.CROSS;
  _fieldsRow = (index: number) => Math.floor(index / this.rowSize) + 1;
  _fieldsColumnFromLeft = (index: number) => (index % this.rowSize) + 1;
  _fieldsColumnFromRight = (index: number) => this.rowSize - (index % this.rowSize);
  _rowIndexes = (row: number) => [...Array(this.rowSize).keys()].map((i) => i + ((row - 1) * this.rowSize));
  _columnIndexes = (column: number) => [...Array(this.rowSize).keys()].map((i) => column + (i * this.rowSize) - 1);
  _isWholeLineOccupied = (line: number[]) => line.every((i) => this.fields[i].occupiedBy === this.turn);
  _isWholeBoardOccupied = () => this.fields.every((field) => field.occupiedBy !== null);
}

export default TicTacToe;
