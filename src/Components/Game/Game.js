import React from 'react';
import './Game.css';
import TicTacToe from '../../TicTacToe/TicTacToe';
import Board from "../Board/Board";

class Game extends React.Component {
  game = new TicTacToe(5);

  state = {
    state: null,
    turn: null,
    fields: [],
    winner: null,
    solution: null,
  };

  mapState() {
    this.setState({
      state: this.game.state,
      turn: this.game.turn,
      fields: this.game.fields.map((field, index) => ({...field, id: index})),
      winner: this.game.winner,
      solution: this.game.solution,
    });
  }

  componentDidMount() {
    this.mapState();
  }

  markField = (id) => {
    this.game.markField(id);
    this.mapState();
  };

  render() {
    let winner = null;
    let draw = null;
    if (this.state.state === TicTacToe.states.OVER) {
      if (this.state.winner) {
        winner = <h2>{this.state.winner === TicTacToe.players.CROSS ? "Cross" : "Nought"} is the winner!</h2>;
      } else {
        draw = <h2>DRAW!</h2>;
      }
    }

    return (
      <div className={"Game"}>
        <h3>Turn: {this.state.turn}</h3>
        <Board
          fields={this.state.fields}
          solution={this.state.solution}
          rowSize={this.game.rowSize}
          onFieldClick={this.markField}/>
        {winner}
        {draw}
      </div>
    );
  }
}

export default Game;