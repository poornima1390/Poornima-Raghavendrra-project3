// Generate empty board
export const generateEmptyBoard = (size = 9) => {
  return Array(size).fill().map(() => Array(size).fill(null));
};

// Copy board
export const copyBoard = (board) => {
  return board.map(row => [...row]);
};

// Check if placement is valid
export const isValidPlacement = (board, row, col, num, size) => {
  // Check row
  for (let x = 0; x < size; x++) {
    if (board[row][x] === num && x !== col) return false;
  }
  
  // Check column
  for (let x = 0; x < size; x++) {
    if (board[x][col] === num && x !== row) return false;
  }
  
  // Determine subgrid dimensions
  const subgridRows = size === 9 ? 3 : 2;
  const subgridCols = size === 9 ? 3 : 3;
  
  const startRow = Math.floor(row / subgridRows) * subgridRows;
  const startCol = Math.floor(col / subgridCols) * subgridCols;
  
  for (let i = 0; i < subgridRows; i++) {
    for (let j = 0; j < subgridCols; j++) {
      if (board[startRow + i][startCol + j] === num && 
          (startRow + i !== row || startCol + j !== col)) {
        return false;
      }
    }
  }
  
  return true;
};

// Solve Sudoku using backtracking
export const solveSudoku = (board, size) => {
  const subgridRows = size === 9 ? 3 : 2;
  const subgridCols = size === 9 ? 3 : 3;
  
  const findEmpty = () => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === null || board[i][j] === 0) {
          return [i, j];
        }
      }
    }
    return null;
  };
  
  const isValid = (num, row, col) => {
    for (let x = 0; x < size; x++) {
      if (board[row][x] === num) return false;
    }
    for (let x = 0; x < size; x++) {
      if (board[x][col] === num) return false;
    }
    const startRow = Math.floor(row / subgridRows) * subgridRows;
    const startCol = Math.floor(col / subgridCols) * subgridCols;
    for (let i = 0; i < subgridRows; i++) {
      for (let j = 0; j < subgridCols; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  };
  
  const solve = () => {
    const empty = findEmpty();
    if (!empty) return true;
    
    const [row, col] = empty;
    const numbers = [...Array(size).keys()].map(i => i + 1);
    
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    for (let num of numbers) {
      if (isValid(num, row, col)) {
        board[row][col] = num;
        if (solve()) return true;
        board[row][col] = null;
      }
    }
    return false;
  };
  
  if (solve()) return board;
  return null;
};

// Generate puzzle by removing cells
export const generatePuzzle = (size, cellsToKeep) => {
  const emptyBoard = generateEmptyBoard(size);
  const solvedBoard = solveSudoku(emptyBoard, size);
  const puzzle = copyBoard(solvedBoard);
  
  const totalCells = size * size;
  let cellsToRemove = totalCells - cellsToKeep;
  
  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    
    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      cellsToRemove--;
    }
  }
  
  return { puzzle, solution: solvedBoard };
};

// Check if a puzzle has exactly one solution (used for custom game validation)
export const hasUniqueSolution = (board, size) => {
  let solutionCount = 0;
  const tempBoard = copyBoard(board);

  const subgridRows = size === 9 ? 3 : 2;
  const subgridCols = size === 9 ? 3 : 3;

  const findEmpty = (b) => {
    for (let i = 0; i < size; i++)
      for (let j = 0; j < size; j++)
        if (b[i][j] === null || b[i][j] === 0) return [i, j];
    return null;
  };

  const isValid = (b, num, row, col) => {
    for (let x = 0; x < size; x++)
      if (b[row][x] === num) return false;
    for (let x = 0; x < size; x++)
      if (b[x][col] === num) return false;
    const startRow = Math.floor(row / subgridRows) * subgridRows;
    const startCol = Math.floor(col / subgridCols) * subgridCols;
    for (let i = 0; i < subgridRows; i++)
      for (let j = 0; j < subgridCols; j++)
        if (b[startRow + i][startCol + j] === num) return false;
    return true;
  };

  const count = (b) => {
    const empty = findEmpty(b);
    if (!empty) { solutionCount++; return; }
    const [row, col] = empty;
    for (let num = 1; num <= size; num++) {
      if (solutionCount > 1) return; // stop early once we know it's not unique
      if (isValid(b, num, row, col)) {
        b[row][col] = num;
        count(b);
        b[row][col] = null;
      }
    }
  };

  count(tempBoard);
  return solutionCount === 1;
};

// Generate a normal 9x9 puzzle (28-30 filled cells)
export const generateNormalPuzzle = () => {
  const cellsToKeep = Math.floor(Math.random() * 3) + 28;
  const { puzzle } = generatePuzzle(9, cellsToKeep);
  return puzzle;
};

// Generate an easy 6x6 puzzle (18 filled cells)
export const generateEasyPuzzle = () => {
  const { puzzle } = generatePuzzle(6, 18);
  return puzzle;
};