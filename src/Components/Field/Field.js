import React from 'react';
import './Field.css';
import Cross from "../Cross/Cross";
import Nought from "../Nought/Nought";
import GameEngine from '../../TicTacToe/TicTacToe';

const Field = (props) => {
  let mark = null;

  if (props.occupiedBy === GameEngine.players.CROSS) {
    mark = <Cross/>
  } else if (props.occupiedBy === GameEngine.players.NOUGHT) {
    mark = <Nought/>
  }

  return (
    <div className={"Field " + props.className} onClick={props.onClick}>
      {mark}
    </div>
  );
};

export default Field;