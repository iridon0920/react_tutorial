import React, { useReducer } from "react";
import { reducer, State } from "../reducer/game";
import { Board } from "./board";

const initialState: State = {
  history: [
    {
      squares: Array(9).fill(null),
      position: { col: undefined, row: undefined },
      count: 0,
    },
  ],
  stepNumber: 0,
  xIsNext: true,
  gameStatus: null,
  ascOrder: true,
};

export const Game: React.VFC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const createStatusText = () => {
    if (state.gameStatus) {
      return `Winner: ${state.gameStatus.winner}`;
    } else {
      return `Next player: ${state.xIsNext ? "X" : "O"}`;
    }
  };

  const handleClick = (i: number) => {
    dispatch({ type: "click", value: i });
  };

  const jumpTo = (step: number) => {
    dispatch({ type: "jump", value: step });
  };

  const sortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "sort", value: e });
  };

  const historyCurrent = state.history
    .slice(0, state.stepNumber + 1)
    .sort((a, b) => {
      if (state.ascOrder) {
        return a.count - b.count;
      } else {
        return (a.count - b.count) * -1;
      }
    });
  const current = historyCurrent.find(
    (step) => step.count === state.stepNumber
  );

  const status = createStatusText();

  const winnerPosition = state.gameStatus
    ? state.gameStatus.linePositions
    : null;

  const moves = historyCurrent.map((step, move) => {
    const desc = step.count ? `Go to move #${step.count}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
        {step.count !== 0 && step.count !== history.length - 1 && (
          <span>
            col:{step.position.col}, row:{step.position.row}
          </span>
        )}
        {step.count !== 0 && step.count === history.length - 1 && (
          <span>
            <b>
              col:{step.position.col}, row:{step.position.row}
            </b>
          </span>
        )}
        {step.count === 9 && !state.gameStatus && <span>引き分け</span>}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current ? current.squares : [null]}
          winnerPositions={winnerPosition}
          onClick={(i) => handleClick(i)}
          size={{ row: 3, col: 3 }}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        <div>
          <label>
            <input
              type="radio"
              value="asc"
              onChange={(e) => sortChange(e)}
              checked={state.ascOrder}
            />
            昇順
          </label>
          <label>
            <input
              type="radio"
              value="desc"
              onChange={(e) => sortChange(e)}
              checked={!state.ascOrder}
            />
            降順
          </label>
        </div>
      </div>
    </div>
  );
};
