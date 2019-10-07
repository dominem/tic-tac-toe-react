class TicTacToe {
  static players = {
    CROSS: "cross",
    NOUGHT: "nought",
  };

  static states = {
    RUNNING: "running",
    OVER: "over",
  };

  static solutions = {
    /* Board:
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
    0: [[0,1,2],[0,4,8],[0,3,6]],
    1: [[0,1,2],[1,4,7]],
    2: [[0,1,2],[2,4,6],[2,5,8]],
    3: [[0,3,6],[3,4,5]],
    4: [[0,4,8],[1,4,7],[2,4,6],[3,4,5]],
    5: [[2,5,8],[3,4,5]],
    6: [[0,3,6],[2,4,6],[6,7,8]],
    7: [[1,4,7],[6,7,8]],
    8: [[0,4,8],[2,5,8],[6,7,8]],
  };

  state = TicTacToe.states.RUNNING;
  turn = TicTacToe.players.CROSS;
  winner = null;
  solution = null;

  constructor(rowSize = 3) {
    this.rowSize = rowSize;
    this.fields = Array(rowSize*rowSize)
      .fill(null)
      .map(() => ({occupiedBy: null}));
    this.diagonalA = [];
    for (let i = 1; i <= rowSize; i++) {
      this.diagonalA.push(((i - 1) * rowSize) + i - 1);
    }
    this.diagonalB = [];
    for (let i = 1; i <= rowSize; i++) {
      this.diagonalB.push((i * rowSize) - i);
    }
  }
  
  markField = (index) => {
    if (this.state === TicTacToe.states.RUNNING && this.fields[index].occupiedBy === null) {
      this.fields[index].occupiedBy = this.turn;
      this.checkForWinner(index);
      this.checkForDraw();
      this.turn = this.turn === TicTacToe.players.CROSS ? TicTacToe.players.NOUGHT : TicTacToe.players.CROSS;
    }
  };

  checkForWinner = (index) => {
    // for (let solution of TicTacToe.solutions[index]) {
    //   if (solution.every((i) => this.fields[i].occupiedBy === this.turn)) {
    //     this.state = TicTacToe.states.OVER;
    //     this.winner = this.turn;
    //     this.solution = solution;
    //     break;
    //   }
    // }
    const row = Math.floor(index / this.rowSize) + 1;
    const columnFromLeft = (index % this.rowSize) + 1;
    const columnFromRight = this.rowSize - columnFromLeft + 1;
    console.log("row", row);
    console.log("column from left", columnFromLeft);
    console.log("column from right", columnFromRight);
    if (row === columnFromLeft) {
      this.checkForWinnerOnDiagonal(this.diagonalA);
    }
    if (row === columnFromRight) {
      this.checkForWinnerOnDiagonal(this.diagonalB);
    }
    this.checkForWinnerOnRow(row);
    this.checkForWinnerOnColumn(columnFromLeft);
  };

  checkForWinnerOnDiagonal = (diagonal) => {
    if (diagonal.every((i) => this.fields[i].occupiedBy === this.turn)) {
      this.state = TicTacToe.states.OVER;
      this.winner = this.turn;
      this.solution = diagonal;
    }
  };

  checkForWinnerOnRow = (row) => {
    let rowIndexes = [];
    for (let i = 1; i <= this.rowSize; i++) {
      rowIndexes.push(i + ((row - 1) * this.rowSize) - 1);
    }
    console.log("row indexes", rowIndexes);
    if (rowIndexes.every((i) => this.fields[i].occupiedBy === this.turn)) {
      this.state = TicTacToe.states.OVER;
      this.winner = this.turn;
      this.solution = rowIndexes;
    }
  };

  checkForWinnerOnColumn = (column) => {
    let columnIndexes = [];
    for (let i = 1; i <= this.rowSize; i++) {
      columnIndexes.push(column + ((i - 1) * this.rowSize) - 1);
    }
    console.log("column indexes", columnIndexes);
    if (columnIndexes.every((i) => this.fields[i].occupiedBy === this.turn)) {
      this.state = TicTacToe.states.OVER;
      this.winner = this.turn;
      this.solution = columnIndexes;
    }
  };

  checkForDraw = () => {
    if (this.fields.every((field) => field.occupiedBy !== null)) {
      this.state = TicTacToe.states.OVER;
    }
  };

  playRandomGame = () => {
    while (this.state === TicTacToe.states.RUNNING) {
      this.markField(this.randomNotOccupiedFieldIndex());
    }
  };

  randomNotOccupiedFieldIndex = () => {
    const indexedFields = this.fields.map((field, index) => ({...field, index}));
    const notOccupiedFields = indexedFields.filter((field) => field.occupiedBy === null);
    const notOccupiedIndexes = notOccupiedFields.map((field) => field.index);
    const randomIndex = Math.floor(Math.random() * notOccupiedIndexes.length);
    return notOccupiedIndexes[randomIndex];
  };
}

export default TicTacToe;
