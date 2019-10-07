import React from 'react';
import Field from "../Field/Field";
import './Board.css';

const Board = (props) => {
  const fields = props.fields.map((field) => {
    return (
      <Field
        key={field.id}
        occupiedBy={field.occupiedBy}
        className={props.solution && props.solution.indexOf(field.id) !== -1 ? "Solution" : ""}
        onClick={props.onFieldClick.bind(this, field.id)}/>
    )
  });

  const style = {
    gridTemplateColumns: Array(props.rowSize).fill('60px').join(' '),
    gridTemplateRows: Array(props.rowSize).fill('60px').join(' '),
  };
  
  return (
    <div className={"Board"} style={style}>
      {fields}
    </div>
  );
};

export default Board;