import React, { useState } from 'react';
import { isCellInvalid } from '../../utils/validators';

const SudokuCell = ({ row, col, value, isPrefilled, size, board, onCellChange, readOnly = false, completed = false }) => {
  const [selected, setSelected] = useState(false);

  const isInvalid = !isPrefilled && value && board
    ? isCellInvalid(board, row, col, size)
    : false;

  const handleClick = () => {
    if (!isPrefilled && !completed && !readOnly) {
      setSelected(true);
    }
  };

  const handleBlur = () => setSelected(false);

  const handleChange = (e) => {
    if (isPrefilled || completed || readOnly) return;

    const raw = e.target.value;

    if (raw === '') {
      onCellChange?.(row, col, null);
      return;
    }

    const maxValue = size === 9 ? 9 : 6;
    const num = parseInt(raw);

    if (!isNaN(num) && num >= 1 && num <= maxValue) {
      onCellChange?.(row, col, num);
    }
  };

  const displayValue = value === null || value === 0 || value === '' ? '' : value;

  return (
    <input
      type="text"
      className={`grid-cell-input
        ${selected ? 'selected' : ''}
        ${isInvalid ? 'invalid' : ''}
        ${isPrefilled ? 'prefilled' : ''}
        ${completed ? 'completed' : ''}
      `}
      value={displayValue}
      onClick={handleClick}
      onBlur={handleBlur}
      onChange={handleChange}
      disabled={isPrefilled || completed || readOnly}
      maxLength={1}
      data-row={row}
      data-col={col}
    />
  );
};

export default SudokuCell;