import * as React from 'react';
import * as Board from './board';

// From: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: Function, delay: number) {
  const savedCallback: any = React.useRef(() => {});

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return () => {};
  }, [delay]);
}

export const Game = () => {
  const [board, setBoard] = React.useState(Board.generateBoard(20, 20));

  useInterval(() => {
    setBoard(Board.advanceBoard(board));
  }, 1000);

  return (
    <div>
      <h1>Game of Life</h1>
      <h2>React + TypeScript (tsdx)</h2>
      <div>
        {board.map((row, i) => {
          return (
            <p key={i}>
              {row.map((cell, j) => {
                return <span key={j}>{cell === 'Alive' ? '@' : ' '}</span>;
              })}
            </p>
          );
        })}
      </div>
    </div>
  );
};
