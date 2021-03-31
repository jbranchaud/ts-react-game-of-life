import {
  advanceBoard,
  Board,
  CellStateGenerator,
  countAliveNeighbors,
  generateBoard,
} from '../src/board';

describe('generateBoard', () => {
  it('generates a 4 by 4 board, defaulting all to Alive', () => {
    const allAliveGenerator: CellStateGenerator = () => 'Alive';
    const board = generateBoard(4, 4, allAliveGenerator);

    const expectedBoard = [
      ['Alive', 'Alive', 'Alive', 'Alive'],
      ['Alive', 'Alive', 'Alive', 'Alive'],
      ['Alive', 'Alive', 'Alive', 'Alive'],
      ['Alive', 'Alive', 'Alive', 'Alive'],
    ];

    expect(board).toEqual(expectedBoard);
  });

  it('generates a 4 by 4 with the diagonal Alive', () => {
    const generator: CellStateGenerator = (xPos, yPos) => {
      return xPos === yPos ? 'Alive' : 'Dead';
    };
    const board = generateBoard(4, 4, generator);

    const expectedBoard = [
      ['Alive', 'Dead', 'Dead', 'Dead'],
      ['Dead', 'Alive', 'Dead', 'Dead'],
      ['Dead', 'Dead', 'Alive', 'Dead'],
      ['Dead', 'Dead', 'Dead', 'Alive'],
    ];

    expect(board).toEqual(expectedBoard);
  });
});

describe('advanceBoard', () => {
  const board: Board = [
    ['Alive', 'Dead', 'Alive'],
    ['Alive', 'Dead', 'Dead'],
    ['Dead', 'Alive', 'Dead'],
  ];

  it('ticks the board forward one step', () => {
    const newBoard: Board = advanceBoard(board);

    const expectedBoard = [
      ['Dead', 'Alive', 'Dead'],
      ['Alive', 'Dead', 'Dead'],
      ['Dead', 'Dead', 'Dead'],
    ];

    expect(newBoard).toEqual(expectedBoard);
  });
});

describe('countAliveNeighbors', () => {
  const board: Board = [
    ['Alive', 'Dead', 'Alive'],
    ['Alive', 'Dead', 'Dead'],
    ['Dead', 'Alive', 'Dead'],
  ];

  it('can count a center cell', () => {
    expect(countAliveNeighbors(1, 1, board)).toEqual(4);
  });

  it('can count a left-side cell', () => {
    expect(countAliveNeighbors(0, 1, board)).toEqual(2);
  });

  it('can count a corner cell', () => {
    expect(countAliveNeighbors(0, 0, board)).toEqual(1);
  });

  it('can count a right-side cell', () => {
    expect(countAliveNeighbors(2, 1, board)).toEqual(2);
  });

  it('can count a bottom cell', () => {
    expect(countAliveNeighbors(1, 2, board)).toEqual(1);
  });

  it('can count a top cell', () => {
    expect(countAliveNeighbors(1, 0, board)).toEqual(3);
  });

  it('can count a far-corner cell', () => {
    expect(countAliveNeighbors(2, 2, board)).toEqual(1);
  });
});
