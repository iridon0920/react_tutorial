import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props: { value: string; onClick: () => void }) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component<{
  squares: string[];
  onClick: (i: number) => void;
  size: { col: number; row: number };
}> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {Array(this.props.size.row)
          .fill(null)
          .map((_, rowKey) => {
            return (
              <div key={rowKey} className="board-row">
                {Array(this.props.size.col)
                  .fill(null)
                  .map((_, colKey) => {
                    return this.renderSquare(rowKey * 3 + colKey);
                  })}
              </div>
            );
          })}
      </div>
    );
  }
}

class Game extends React.Component<
  unknown,
  {
    history: {
      squares: string[];
      position: { col?: number; row?: number };
      count: number;
    }[];
    stepNumber: number;
    xIsNext: boolean;
    ascOrder: boolean;
  }
> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          position: { col: undefined, row: undefined },
          count: 0,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      ascOrder: true,
    };
  }

  private createStatusText(squares: string[]) {
    const winner = calculateWinner(squares);
    if (winner) {
      return "Winner: " + winner;
    } else {
      return "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history.find(
      (step) => step.count === this.state.stepNumber
    );
    if (!current) {
      return;
    }
    const squares = current.squares.slice();
    const stepNumber = history.length;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    const position = {
      col: (i % 3) + 1,
      row: Math.ceil((i + 1) / 3),
    };
    this.setState({
      history: history.concat([{ squares, position, count: stepNumber }]),
      stepNumber,
      xIsNext: !this.state.xIsNext,
    });
  }

  private jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  private sortChange(e: React.ChangeEvent<HTMLInputElement>) {
    const ascOrder = e.target.value === "asc";
    this.setState({ ascOrder: ascOrder });
  }

  render() {
    const history = this.state.history
      .slice(0, this.state.stepNumber + 1)
      .sort((a, b) => {
        if (this.state.ascOrder) {
          return a.count - b.count;
        } else {
          return (a.count - b.count) * -1;
        }
      });
    const current = history.find(
      (step) => step.count === this.state.stepNumber
    );
    if (!current) {
      return;
    }

    const status = this.createStatusText(current.squares);

    const moves = history.map((step, move) => {
      const desc = step.count
        ? "Go to move #" + step.count
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
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
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
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
                onChange={(e) => this.sortChange(e)}
                checked={this.state.ascOrder}
              />
              asc
            </label>
            <label>
              <input
                type="radio"
                value="desc"
                onChange={(e) => this.sortChange(e)}
                checked={!this.state.ascOrder}
              />
              desc
            </label>
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: string[]) {
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
      return squares[a];
    }
  }
  return null;
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
