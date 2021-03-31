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
      <div className="board space-y-2">
        {board.map((row, i) => {
          return (
            <div className="row space-x-2" key={i}>
              {row.map((cell, j) => {
                return (
                  <span
                    className=""
                    style={{
                      width: '20px',
                      height: '20px',
                      ...(cell === 'Alive'
                        ? {
                            backgroundColor: `hsl(${(180 / 20) * i +
                              (180 / 20) * j}deg 100% 50% / 1)`,
                          }
                        : {
                            backgroundColor: `hsl(${(180 / 20) * i +
                              (180 / 20) * j}deg 75% 50% / 0.25)`,
                          }),
                    }}
                    key={j}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
