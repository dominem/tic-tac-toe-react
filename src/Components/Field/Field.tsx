import React from 'react';
import './Field.css';
import Cross from "../Cross/Cross";
import Nought from "../Nought/Nought";
import { Player } from '../../TicTacToe/TicTacToe';

interface FieldProps {
  occupiedBy: string | null;
  className?: string;
  onClick?: () => void;
}

const Field: React.FC<FieldProps> = (props) => {
  let mark: React.ReactNode = null;

  if (props.occupiedBy === Player.CROSS) {
    mark = <Cross/>;
  } else if (props.occupiedBy === Player.NOUGHT) {
    mark = <Nought/>;
  }

  return (
    <div className={"Field " + (props.className ?? "")} onClick={props.onClick}>
      {mark}
    </div>
  );
};

export default Field;