import React from 'react';
import Field from '../Field/Field';
import './Board.css';

interface FieldType {
  id: number;
  occupiedBy: string | null;
}

interface BoardProps {
  fields: FieldType[];
  rowSize: number;
  solution?: number[] | null;
  onFieldClick: (id: number) => void;
}

const Board: React.FC<BoardProps> = (props) => {
  const fields = props.fields.map((field) => {
    return (
      <Field
        key={field.id}
        occupiedBy={field.occupiedBy}
        className={props.solution && props.solution.indexOf(field.id) !== -1 ? "Solution" : ""}
        onClick={() => props.onFieldClick(field.id)}
      />
    );
  });

  const style: React.CSSProperties = {
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
