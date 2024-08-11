import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${value} ${isWinningSquare ? "winning-square" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(42).fill(null));
  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningSquares = result ? result.winningSquares : [];

  function handleClick(column) {
    if (winner || squares.every(square => square !== null)) {
      return;
    }
    const nextSquares = squares.slice();

    for (let row = 5; row >= 0; row--) {
      const index = row * 7 + column;
      if (!nextSquares[index]) {
        nextSquares[index] = xIsNext ? "X" : "O";
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
        return;
      }
    }
  }

  function handleRestart() {
    setSquares(Array(42).fill(null));
    setXIsNext(true);
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every(square => square !== null)) {
    status = "It's a tie!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {[...Array(6)].map((_, row) => (
        <div className="board-row" key={row}>
          {[...Array(7)].map((_, col) => (
            <Square
              key={col}
              value={squares[row * 7 + col]}
              onSquareClick={() => handleClick(col)}
              isWinningSquare={winningSquares.includes(row * 7 + col)}
            />
          ))}
        </div>
      ))}
      <button className="restart-button" onClick={handleRestart}>Restart Game</button>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [];

  // Horizontal wins
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      lines.push([row * 7 + col, row * 7 + col + 1, row * 7 + col + 2, row * 7 + col + 3]);
    }
  }

  // Vertical wins
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 3; row++) {
      lines.push([row * 7 + col, (row + 1) * 7 + col, (row + 2) * 7 + col, (row + 3) * 7 + col]);
    }
  }

  // Diagonal wins (bottom-left to top-right)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      lines.push([
        row * 7 + col,
        (row + 1) * 7 + col + 1,
        (row + 2) * 7 + col + 2,
        (row + 3) * 7 + col + 3,
      ]);
    }
  }

  // Diagonal wins (top-left to bottom-right)
  for (let row = 3; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      lines.push([
        row * 7 + col,
        (row - 1) * 7 + col + 1,
        (row - 2) * 7 + col + 2,
        (row - 3) * 7 + col + 3,
      ]);
    }
  }

  // Check for a winner
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c] &&
      squares[a] === squares[d]
    ) {
      return { winner: squares[a], winningSquares: [a, b, c, d] };
    }
  }
  return null;
}