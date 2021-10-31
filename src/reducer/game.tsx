import React from "react";
import { SquaresType } from "../component/board";

const calculateWinner = (squares: SquaresType) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], linePositions: [a, b, c] };
    }
  }
  return null;
};

interface History {
  squares: SquaresType;
  position: { col?: number; row?: number };
  count: number;
}

interface GameStatus {
  winner: string | null;
  linePositions: number[];
}

export interface State {
  history: History[];
  stepNumber: number;
  xIsNext: boolean;
  gameStatus: GameStatus | null;
  ascOrder: boolean;
}

type Action =
  | { type: "click"; value: number }
  | { type: "jump"; value: number }
  | { type: "sort"; value: React.ChangeEvent<HTMLInputElement> };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "click": {
      const historyCurrent = state.history.slice(0, state.stepNumber + 1);
      const current = historyCurrent.find(
        (step) => step.count === state.stepNumber
      );
      if (!current) {
        return state;
      }
      const squares = current.squares.slice();
      const stepNumberCurrent = historyCurrent.length;
      if (state.gameStatus || squares[action.value]) {
        return state;
      }

      squares[action.value] = state.xIsNext ? "X" : "O";
      const position = {
        col: (action.value % 3) + 1,
        row: Math.ceil((action.value + 1) / 3),
      };

      return {
        ...state,
        history: historyCurrent.concat([
          { squares, position, count: stepNumberCurrent },
        ]),
        stepNumber: stepNumberCurrent,
        gameStatus: calculateWinner(squares),
        xIsNext: !state.xIsNext,
      };
    }
    case "jump": {
      return {
        ...state,
        stepNumber: action.value,
        xIsNext: action.value % 2 === 0,
        gameStatus: null,
      };
    }
    case "sort": {
      return {
        ...state,
        ascOrder: action.value.target.value === "asc",
      };
    }
  }
};
