/* This comment contains some personal analysis of the game.
 *
 * Board:
 * 0 1 2
 * 3 4 5
 * 6 7 8
 *
 * 1 2 3
 * 4 5 6
 * 7 8 9
 *
 * ATTENTION! Counting starts from 1 in this analysis, not from 0!
 * n - row/column size
 * n x n - board size
 * i - current index
 * r - current row
 * cl - current column from left
 * cr - current column from right
 * cr = n - cl + 1
 *
 * Checks if i is on:
 * corners: (i == 1), (i == n), (i == (n x n - n + 1)), (i == (n x n))
 * diagonals: (r == cl), (r == cr)
 *
 * if on diagonal A:
 *    check other fields on diagonal A
 * if on diagonal B:
 *    check other fields on diagonal B
 * check other fields on the row
 * check other fields on the column
 *
 * 1  2  3  4
 * 5  6  7  8
 * 9  10 11 12
 * 13 14 15 16
 *
 * diagonal A for x in [1,n]: ((x - 1) * n) + x
 * diagonal B for x in [1,n]: (x * n) - x + 1
 * a row for x in [1,n]: x + ((r - 1) * n)
 * a column for x in [1,n]: cl + ((x - 1) * n)
 *
 * 1    2    3    4    5
 * 6    7    8    9    10
 * 11   12   13   14   15
 * 16   17   18   19   20
 * 21   22   23   24   25
 */

const CROSS = "cross";
const NOUGHT = "nought";
const RUNNING = "running";
const OVER = "over";

class TicTacToe {
  static players = {CROSS, NOUGHT};
  static states = {RUNNING, OVER};
  state = RUNNING;
  turn = CROSS;
  winner = null;
  solution = null;

  constructor(rowSize = 3) {
    this.rowSize = rowSize;
    this.boardSize = rowSize * rowSize;
    this.fields = this._generateFields();
    this.diagonalA = this._generateDiagonalA();
    this.diagonalB = this._generateDiagonalB();
  }
  
  tryToMarkField = (index) => {
    if (this._canMarkField(index)) {
      this._markField(index);
      this._checkForWinner(index);
      this._checkForDraw();
      this._switchTurn();
    }
  };

  _checkForWinner = (index) => {
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
      this.state = OVER;
    }
  };

  _checkForWinnerOnLine = (line) => {
    if (this._isWholeLineOccupied(line)) {
      this.state = OVER;
      this.winner = this.turn;
      this.solution = line;
    }
  };

  _generateFields = () => Array(this.boardSize).fill(0).map(() => ({occupiedBy: null}));
  _generateDiagonalA = () => this._generateDiagonal((i) => ((i - 1) * this.rowSize) + i - 1);
  _generateDiagonalB = () => this._generateDiagonal((i) => (i * this.rowSize) - i);
  _generateDiagonal = (formula) => [...Array(this.rowSize).keys()].map((i) => formula(i + 1));
  _canMarkField = (index) => this.state === RUNNING && this.fields[index].occupiedBy === null;
  _markField = (index) => this.fields[index].occupiedBy = this.turn;
  _switchTurn = () => this.turn = this.turn === CROSS ? NOUGHT : CROSS;
  _fieldsRow = (index) => Math.floor(index / this.rowSize) + 1;
  _fieldsColumnFromLeft = (index) => (index % this.rowSize) + 1;
  _fieldsColumnFromRight = (index) => this.rowSize - (index % this.rowSize);
  _rowIndexes = (row) => [...Array(this.rowSize).keys()].map((i) => i + ((row - 1) * this.rowSize));
  _columnIndexes = (column) => [...Array(this.rowSize).keys()].map((i) => column + (i * this.rowSize) - 1);
  _isWholeLineOccupied = (line) => line.every((i) => this.fields[i].occupiedBy === this.turn);
  _isWholeBoardOccupied = () => this.fields.every((field) => field.occupiedBy !== null);
}

export default TicTacToe;
