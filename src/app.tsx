import * as React from 'react';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
     />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          <button className="key"></button>
          <button className="key">A</button>
          <button className="key">B</button>
          <button className="key">C</button>
        </div>
        <div className="board-row">
          <button className="key">1</button>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          <button className="key">2</button>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          <button className="key">3</button>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      clicks: new Array(),
      xIsNext: true,
      stepNumber: 0,
      location: null,
      winner: null,
    };
  }

  calculateWinner(squares) {
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

  handleClick(i) {
    console.log('Game: handleClick at (' + i + ')');
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.state.winner || squares[i]) {
      return;
    }
    const clicks = this.state.clicks.slice(0, this.state.stepNumber + 1);
    clicks[this.state.stepNumber + 1] = i
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const winner = this.calculateWinner(squares);
    this.setState({
      history: history.concat([{
        squares: squares,
      }]);
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      clicks: clicks,
      winner: winner,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      var desc = 'Go to the start.';
      if (move > 0) {
        const clicked = this.state.clicks[move];
        const col = String.fromCharCode((clicked % 3) + 65);
        const row = ((clicked<3) ?  1 : ((clicked>5) ? 3 : 2));
        const player = (move % 2) ? 'X' : 'O';
        desc = "Go to move #" + move + " where " + player + " played at " + col + row;
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (this.state.winner) {
      status = 'Winner: ' + this.state.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export class App extends React.Component<undefined, undefined> {
  render() {
    return (
      <div>
        <h2>The React Noughts and Crosses Tutorial</h2>
        <p>In an Electron App!</p>
        <Game />
      </div>
    );
  }
}
