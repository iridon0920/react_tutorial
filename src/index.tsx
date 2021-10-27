import React, { useState } from "react";
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

const Square: React.VFC<SquareProps> = (props) => {
  return (
    <button
      className={props.isWinnerPosition ? "winnerSquare" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
};

interface BoardProps {
  squares: SquaresType;
  onClick: (i: number) => void;
  size: { col: number; row: number };
  winnerPositions: number[] | null;
}

const Board: React.VFC<BoardProps> = (props) => {
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

const Game: React.VFC = () => {
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState<History[]>([
    {
      squares: Array(9).fill(null),
      position: { col: undefined, row: undefined },
      count: 0,
    },
  ]);
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);
  const [ascOrder, setAscOrder] = useState(true);

  const createStatusText = () => {
    if (gameStatus) {
      return `Winner: ${gameStatus.winner}`;
    } else {
      return `Next player: ${xIsNext ? "X" : "O"}`;
    }
  };

  const handleClick = (i: number) => {
    const historyCurrent = history.slice(0, stepNumber + 1);
    const current = historyCurrent.find((step) => step.count === stepNumber);
    if (!current) {
      return;
    }
    const squares = current.squares.slice();
    if (gameStatus || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? "X" : "O";
    const position = {
      col: (i % 3) + 1,
      row: Math.ceil((i + 1) / 3),
    };

    setHistory(
      historyCurrent.concat([{ squares, position, count: stepNumber }])
    );
    setStepNumber(historyCurrent.length);
    setGameStatus(calculateWinner(squares));
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
    setGameStatus(null);
  };

  const sortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ascOrder = e.target.value === "asc";
    setAscOrder(ascOrder);
  };

  const historyCurrent = history.slice(0, stepNumber + 1).sort((a, b) => {
    if (ascOrder) {
      return a.count - b.count;
    } else {
      return (a.count - b.count) * -1;
    }
  });
  const current = historyCurrent.find((step) => step.count === stepNumber);

  const status = createStatusText();

  const winnerPosition = gameStatus ? gameStatus.linePositions : null;

  const moves = history.map((step, move) => {
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
        {step.count === 9 && <span>引き分け</span>}
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
              checked={ascOrder}
            />
            昇順
          </label>
          <label>
            <input
              type="radio"
              value="desc"
              onChange={(e) => sortChange(e)}
              checked={!ascOrder}
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
