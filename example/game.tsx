import * as React from 'react';
import * as Board from '../src/board';

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

type BoardStatus = 'paused' | 'running';

interface BoardControls {
  board: Board.Board;
  status: BoardStatus;
  pause: Function;
  start: Function;
  restart: Function;
  toggleCellState: Function;
}

function useBoardControls(
  width: number,
  height: number,
  initialBoardGenerator: (width: number, height: number) => Board.Board,
  initialStatus?: BoardStatus
): BoardControls {
  React.useEffect(() => {
    setBoard(initialBoardGenerator(width, height));
  }, [width, height]);

  const [board, setBoard] = React.useState(
    initialBoardGenerator(width, height)
  );
  const [status, setStatus] = React.useState(initialStatus || 'paused');

  useInterval(() => {
    if (status === 'running') {
      setBoard(Board.advanceBoard(board));
    }
  }, 1500);

  const pause = () => setStatus('paused');
  const start = () => setStatus('running');
  const restart = () => setBoard(initialBoardGenerator(width, height));
  const toggleCellState = (x: number, y: number) => {
    setBoard(prevBoard => {
      return prevBoard.map((row, i) => {
        return row.map((cell, j) => {
          if (i === y && j === x) {
            return cell === 'Alive' ? 'Dead' : 'Alive';
          } else {
            return cell;
          }
        });
      });
    });
  };

  return { board, status, pause, start, restart, toggleCellState };
}

export const Game = () => {
  const [boardLength, setBoardLength] = React.useState<number>(20);
  const boardGenerator = (width, height) => {
    return Board.generateBoard(width, height);
  };
  const {
    board,
    status,
    pause,
    start,
    restart,
    toggleCellState,
  } = useBoardControls(boardLength, boardLength, boardGenerator);

  return (
    <div className="space-y-2">
      <h1>Game of Life!</h1>
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
        <input
          type="number"
          value={boardLength}
          onChange={e => setBoardLength(parseInt(e.target.value))}
        />
      </div>
      <div className="board space-y-2">
        {board.map((row, i) => {
          return (
            <div className="row space-x-2" key={i}>
              {row.map((cell, j) => {
                return (
                  <span
                    onClick={() => {
                      console.log(`Toggle Cell State at ${i}, ${j}`);
                      toggleCellState(j, i);
                    }}
                    className=""
                    style={{
                      width: '20px',
                      height: '20px',
                      ...(cell === 'Alive'
                        ? {
                            backgroundColor: `hsl(${Math.round(
                              180 / boardLength
                            ) *
                              i +
                              Math.round(180 / boardLength) *
                                j}deg 100% 50% / 1)`,
                          }
                        : {
                            backgroundColor: `hsl(${Math.round(
                              180 / boardLength
                            ) *
                              i +
                              Math.round(180 / boardLength) *
                                j}deg 75% 50% / 0.25)`,
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
