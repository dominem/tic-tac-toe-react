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

  const fieldSize = 60;

  const style = {
    gridTemplateColumns: Array(props.rowSize).fill(`${fieldSize}px`).join(' '),
    gridTemplateRows: Array(props.rowSize).fill(`${fieldSize}px`).join(' '),
  };

  let leftOffset = fieldSize / 4;
  let width = fieldSize * props.rowSize - leftOffset * 2;
  let height = 20;
  let rotate = 0;
  let topOffset = 0;
  if (props.solution) {
    if (props.solution[0] === props.solution[1] - 1) {
      topOffset += fieldSize / 2 - height / 2;
      topOffset += Math.floor(props.solution[0] / props.rowSize) * fieldSize;
    } else if (props.solution[0] === props.solution[1] - props.rowSize) {
      rotate = 90;
      if (props.rowSize % 2 === 0) leftOffset -= fieldSize / 2;
      leftOffset -= Math.floor((props.rowSize - 1) / 2) * fieldSize;
      leftOffset += (props.solution[0] % props.rowSize) * fieldSize;
      topOffset += width / 2 + fieldSize / 4 - height / 2;
    } else if (props.solution[0] === props.solution[1] - props.rowSize - 1) {
      rotate = 45;
      topOffset += width / 2 + fieldSize / 4 - height / 2;
    } else {
      rotate = -45;
      topOffset += width / 2 + fieldSize / 4 - height / 2;
    }
  }

  if (!props.solution) {
    width = 0;
  }
  
  return (
    <div className={"Board"} style={style}>
      {fields}
      <div
        style={{
          position: 'absolute',
          // border: '4px solid red',
          height: `${height}px`,
          background: 'red',
          width: `${width}px`,
          left: `calc(50% - (${props.rowSize / 2} * ${fieldSize}px) + ${leftOffset}px)`,
          top: `${topOffset}px`,
          transform: `rotate(${rotate}deg)`,
          transition: 'width .5s linear'
        }}/>
    </div>
  );
};

export default Board;