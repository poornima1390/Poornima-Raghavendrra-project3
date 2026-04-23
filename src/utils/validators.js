import { isValidPlacement } from './sudokuUtils';

// Check if a specific cell has an invalid value
export const isCellInvalid = (board, row, col, size) => {
  if (!board || !board[row]) return false;
  const val = board[row][col];
  if (val === null || val === 0 || val === '') return false;
  return !isValidPlacement(board, row, col, val, size);
};

// Get all invalid cells on the board as [row, col] pairs
export const getInvalidCells = (board, size) => {
  if (!board) return [];
  const invalid = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (isCellInvalid(board, i, j, size)) {
        invalid.push([i, j]);
      }
    }
  }
  return invalid;
};

// Check if every cell is filled and no cell is invalid
export const checkWin = (board, size) => {
  if (!board) return false;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const val = board[i][j];
      if (val === null || val === 0 || val === '') return false;
      if (isCellInvalid(board, i, j, size)) return false;
    }
  }
  return true;
};