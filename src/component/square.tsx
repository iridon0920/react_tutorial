import React, {memo} from "react";

interface SquareProps {
  value: string | null;
  isWinnerPosition: boolean;
  onClick: () => void;
}

export const Square: React.VFC<SquareProps> = memo((props) => {
  return (
    <button
      className={props.isWinnerPosition ? "winnerSquare" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
});
Square.displayName = "Square";