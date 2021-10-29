import React, { useReducer, memo } from "react";
import ReactDOM from "react-dom";
import "./index.css";

type SquaresType = (string | null)[];

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

interface SquareProps {
  value: string | null;
  isWinnerPosition: boolean;
  onClick: () => void;
}

const Square: React.VFC<SquareProps> = memo((props) => {
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

interface BoardProps {
  squares: SquaresType;
  onClick: (i: number) => void;
  size: { col: number; row: number };
  winnerPositions: number[] | null;
}

const Board: React.VFC<BoardProps> = memo((props) => {
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

interface History {
  squares: SquaresType;
  position: { col?: number; row?: number };
  count: number;
}

interface GameStatus {
  winner: string | null;
  linePositions: number[];
}

interface State {
  history: History[];
  stepNumber: number;
  xIsNext: boolean;
  gameStatus: GameStatus | null;
  ascOrder: boolean;
}

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

type Action =
  | { type: "click"; value: number }
  | { type: "jump"; value: number }
  | { type: "sort"; value: React.ChangeEvent<HTMLInputElement> };

const reducer = (state: State, action: Action): State => {
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

const Game: React.VFC = () => {
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

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
