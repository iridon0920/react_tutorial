import React, { memo } from "react";
import { Square } from "./square";

export type SquaresType = (string | null)[];

interface BoardProps {
  squares: SquaresType;
  onClick: (i: number) => void;
  size: { col: number; row: number };
  winnerPositions: number[] | null;
}

export const Board: React.VFC<BoardProps> = memo((props) => {
  const renderSquare = (i: number) => {
    return (
      <Square
        value={props.squares[i]}
        isWinnerPosition={
          props.winnerPositions ? props.winnerPositions.includes(i) : false
        }
        onClick={() => props.onClick(i)}
      />
    );
  };

  return (
    <div>
      {Array(props.size.row)
        .fill(null)
        .map((_, rowKey) => {
          return (
            <div key={rowKey} className="board-row">
              {Array(props.size.col)
                .fill(null)
                .map((_, colKey) => {
                  return renderSquare(rowKey * 3 + colKey);
                })}
            </div>
          );
        })}
    </div>
  );
});
Board.displayName = "Board";
