export const sortByCellId = (a, b) => {
  const rowA = parseInt(a.cellId.split('-')[1]);
  const rowB = parseInt(b.cellId.split('-')[1]);
  return rowA - rowB;
};