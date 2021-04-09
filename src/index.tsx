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

type boardStatus = 'paused' | 'running';

function useBoardControls(
  initialBoardGenerator: () => Board.Board,
  initialStatus?: boardStatus
): [Board.Board, boardStatus, Function, Function, Function] {
  const [board, setBoard] = React.useState(initialBoardGenerator());
  const [status, setStatus] = React.useState(initialStatus || 'paused');

  useInterval(() => {
    if (status === 'running') {
      setBoard(Board.advanceBoard(board));
    }
  }, 1500);

  const pause = () => setStatus('paused');
  const start = () => setStatus('running');
  const restart = () => setBoard(initialBoardGenerator());

  return [board, status, pause, start, restart];
}

export const Game = () => {
  const [board, status, pause, start, restart] = useBoardControls(() => {
    return Board.generateBoard(20, 20);
  });

  return (
    <div className="space-y-2">
      <h1>Game of Life</h1>
      <h2>React + TypeScript (tsdx)</h2>
      <div className="controls space-x-2">
        <span>Status: {status}</span>
        <button
          onClick={() => {
            status === 'running' ? pause() : start();
          }}
        >
          {status === 'running' ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => restart()}>Restart</button>
      </div>
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
