const times = (x: number, callback: (x: number) => void) => {
  for (let i = 0; i < x; i++) {
    callback(i);
  }
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}

export type CellState = 'Dead' | 'Alive';
export type CellStateGenerator = (xPos?: number, yPos?: number) => CellState;
type Cell = CellState;
type Row = Cell[];
export type Board = Row[];

// type Game = {
//   width: number;
//   height: number;
//   board: Board;
// };

const randomGenerator: CellStateGenerator = () => {
  return getRandomInt(2) === 0 ? 'Dead' : 'Alive';
};

export const generateBoard = (
  width: number,
  height: number,
  optionalGenerator?: CellStateGenerator
): Board => {
  // Figure out what CellState generator will be used
  let generator = optionalGenerator || randomGenerator;

  // Initialize the board
  const board: Board = [];

  // Fill all the rows and cells of the board based on the given `width` and
  // `height`.
  times(height, yPos => {
    const row: Row = [];

    times(width, xPos => {
      const cell = generator(xPos, yPos);

      row.push(cell);
    });

    board.push(row);
  });

  return board;
};

export const countAliveNeighbors = (
  xPos: number,
  yPos: number,
  board: Board
): number => {
  // Find neighboring values:
  // A B C
  // D x E
  // F G H

  // prettier-ignore
  const relativeCoords = {
    A: [xPos - 1, yPos - 1],
    B: [xPos    , yPos - 1],
    C: [xPos + 1, yPos - 1],
    D: [xPos - 1, yPos    ],
    E: [xPos + 1, yPos    ],
    F: [xPos - 1, yPos + 1],
    G: [xPos    , yPos + 1],
    H: [xPos + 1, yPos + 1],
  };

  const coordsToState = (
    xCoord: number,
    yCoord: number,
    board: Board
  ): CellState => (board[yCoord] || [])[xCoord] || 'Dead';

  const neighborStates = Object.values(relativeCoords).map(coords => {
    const [xCoord, yCoord] = coords;
    return coordsToState(xCoord, yCoord, board);
  });

  const neighborCount = neighborStates.filter((state: CellState) => {
    return state === 'Alive';
  }).length;

  return neighborCount;
};

export const advanceBoard = (board: Board): Board => {
  const newBoard: Board = [];

  board.forEach((row, y) => {
    const newRow: Row = [];

    row.forEach((cell, x) => {
      // Game of Life Rules:
      // 1. Any live cell with fewer than two live neighbours dies, as if by
      // underpopulation.
      // 2. Any live cell with two or three live neighbours lives on to the
      // next generation.
      // 3. Any live cell with more than three live neighbours dies, as if by
      // overpopulation.
      // 4. Any dead cell with exactly three live neighbours becomes a live
      // cell, as if by reproduction.

      const neighborCount = countAliveNeighbors(x, y, board);

      if (neighborCount < 2 || neighborCount > 3) {
        newRow.push('Dead');
      } else if (neighborCount === 2 && cell === 'Dead') {
        newRow.push('Dead');
      } else {
        newRow.push('Alive');
      }
    });

    newBoard.push(newRow);
  });

  return newBoard;
};
