import React from 'react';
import SudokuCell from './SudokuCell';

const SudokuGrid = ({ board, initialBoard, solution, size, onCellChange, readOnly = false, completed = false }) => {
  if (!board || !board.length) {
    return <div className="loading">Loading grid...</div>;
  }

  const getCellClass = (row, col) => {
    const classes = [];
    if (size === 9) {
      if ((row + 1) % 3 === 0 && row !== 8) classes.push('border-bottom-thick');
      if ((col + 1) % 3 === 0 && col !== 8) classes.push('border-right-thick');
    } else {
      if ((row + 1) % 2 === 0 && row !== 5) classes.push('border-bottom-thick');
      if ((col + 1) % 3 === 0 && col !== 5) classes.push('border-right-thick');
    }
    return classes.join(' ');
  };

  return (
    <div className={`sudoku-grid ${size === 9 ? 'hard-grid' : 'easy-grid'}`}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => {
            const isPrefilled = initialBoard[rowIndex]?.[colIndex] !== null &&
                                initialBoard[rowIndex]?.[colIndex] !== undefined;
            return (
              <div key={`${rowIndex}-${colIndex}`} className={getCellClass(rowIndex, colIndex)}>
                <SudokuCell
                  row={rowIndex}
                  col={colIndex}
                  value={cell}
                  isPrefilled={isPrefilled}
                  size={size}
                  board={board}
                  onCellChange={onCellChange}
                  readOnly={readOnly}
                  completed={completed}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SudokuGrid;