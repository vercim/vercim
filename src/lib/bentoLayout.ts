export interface BentoPlacement {
  column: number;
  row: number;
  columnSpan: number;
  rowSpan: number;
}

export interface BentoLayout {
  columns: number;
  rows: number;
  placements: BentoPlacement[];
}

type Shape = readonly [columnSpan: number, rowSpan: number];

const FEATURE: Shape = [2, 2];
const WIDE: Shape = [2, 1];
const TALL: Shape = [1, 2];
const SINGLE: Shape = [1, 1];

const MAX_COLUMNS = 4;
const SEARCH_BUDGET = 20000;

// Card order is the placement order: the first card is the featured one.
function shapeCandidates(index: number): Shape[] {
  if (index === 0) return [FEATURE, WIDE, TALL, SINGLE];

  const [preferred, alternate] = index % 2 === 1 ? [WIDE, TALL] : [TALL, WIDE];
  return [preferred, SINGLE, alternate];
}

function fits(
  occupied: boolean[][],
  row: number,
  column: number,
  [columnSpan, rowSpan]: Shape
) {
  if (row + rowSpan > occupied.length || column + columnSpan > occupied[0].length) return false;

  for (let rowOffset = 0; rowOffset < rowSpan; rowOffset += 1) {
    for (let columnOffset = 0; columnOffset < columnSpan; columnOffset += 1) {
      if (occupied[row + rowOffset][column + columnOffset]) return false;
    }
  }

  return true;
}

function mark(
  occupied: boolean[][],
  row: number,
  column: number,
  [columnSpan, rowSpan]: Shape,
  value: boolean
) {
  for (let rowOffset = 0; rowOffset < rowSpan; rowOffset += 1) {
    for (let columnOffset = 0; columnOffset < columnSpan; columnOffset += 1) {
      occupied[row + rowOffset][column + columnOffset] = value;
    }
  }
}

// Exact-cover search: every card starts at the first free cell, so the grid fills with no holes.
function tile(count: number, columns: number, rows: number): BentoPlacement[] | null {
  const occupied = Array.from({ length: rows }, () => Array<boolean>(columns).fill(false));
  const placements: BentoPlacement[] = [];
  let budget = SEARCH_BUDGET;

  const place = (index: number, freeCells: number): boolean => {
    if (index === count) return freeCells === 0;

    const remaining = count - index;
    const maxCells = index === 0 ? 4 + (remaining - 1) * 2 : remaining * 2;
    if (freeCells < remaining || freeCells > maxCells || budget <= 0) return false;
    budget -= 1;

    const row = occupied.findIndex((cells) => cells.includes(false));
    const column = occupied[row].indexOf(false);

    for (const shape of shapeCandidates(index)) {
      if (!fits(occupied, row, column, shape)) continue;

      const [columnSpan, rowSpan] = shape;
      mark(occupied, row, column, shape, true);
      placements.push({ column: column + 1, row: row + 1, columnSpan, rowSpan });
      if (place(index + 1, freeCells - columnSpan * rowSpan)) return true;

      placements.pop();
      mark(occupied, row, column, shape, false);
    }

    return false;
  };

  return place(0, columns * rows) ? placements : null;
}

// Last resort if the search finds no exact tiling: plain rows of single cells.
function fallbackLayout(count: number, columns: number): BentoLayout {
  return {
    columns,
    rows: Math.ceil(count / columns),
    placements: Array.from({ length: count }, (_, index) => ({
      column: (index % columns) + 1,
      row: Math.floor(index / columns) + 1,
      columnSpan: 1,
      rowSpan: 1,
    })),
  };
}

export function createBentoLayout(count: number): BentoLayout {
  if (count === 0) {
    return { columns: 1, rows: 1, placements: [] };
  }

  const columns = Math.min(MAX_COLUMNS, Math.max(2, Math.ceil(Math.sqrt(count * 2))));
  // One featured card (4 cells) plus a single cell for every other card.
  const minRows = Math.ceil((count + 3) / columns);

  for (let rows = minRows; rows <= minRows + 2; rows += 1) {
    const placements = tile(count, columns, rows);
    if (placements) return { columns, rows, placements };
  }

  return fallbackLayout(count, columns);
}
