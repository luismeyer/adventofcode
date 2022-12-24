import { challenge, Alphabet, logLine } from "./common.ts";

const prepareGrid = (rawInput: string) => {
  let start: Coords = { x: 0, y: 0 };
  let end: Coords = { x: 0, y: 0 };

  const grid = rawInput
    .split("\n")
    .filter(Boolean)
    .map((line, y) => {
      return line.split("").map((letter, x) => {
        if (letter === Settings.start.id) {
          start = { x, y };
          return Alphabet.indexOf("a");
        }

        if (letter === Settings.end.id) {
          end = { x, y };
          return Alphabet.indexOf("z");
        }

        return Alphabet.indexOf(letter);
      });
    });

  return { grid, start, end };
};

type Coords = {
  x: number;
  y: number;
};

type PathNodes = {
  coords: Coords;
  cost: number;
};

const Settings = {
  start: {
    id: "S",
    value: "a",
  },
  end: {
    id: "E",
    value: "z",
  },
};

const sameCoords = (a: Coords, b: Coords) => a.x === b.x && a.y === b.y;

const findNeighboursWithValue = (
  grid: number[][],
  currCoords: Coords,
  targetValue: number
) => {
  const neighbours: Coords[] = [
    { x: currCoords.x + 1, y: currCoords.y },
    { x: currCoords.x - 1, y: currCoords.y },
    { x: currCoords.x, y: currCoords.y + 1 },
    { x: currCoords.x, y: currCoords.y - 1 },
  ];

  return neighbours.filter((coord) => {
    const { x, y } = coord;
    const xInBounds = x >= 0 && x < grid[0].length;
    const yInBounds = y >= 0 && y < grid.length;

    return xInBounds && yInBounds && grid[y][x] <= targetValue;
  });
};

const findNextCoords = (grid: number[][], currentCoords: Coords) => {
  const currentValue = grid[currentCoords.y][currentCoords.x];

  return findNeighboursWithValue(grid, currentCoords, currentValue + 1);
};

const findPath = (grid: number[][], start: Coords, end: Coords) => {
  const queue: PathNodes[] = [{ coords: start, cost: 0 }];
  const visited: Coords[] = [];

  while (queue[0] && !sameCoords(queue[0].coords, end)) {
    const currentNode = queue.shift();
    if (!currentNode) {
      throw new Error("No next cell");
    }

    const wasVisited = visited.some((visitedCoords) =>
      sameCoords(visitedCoords, currentNode.coords)
    );

    if (wasVisited) {
      continue;
    }

    visited.push(currentNode.coords);

    const nextCells = findNextCoords(grid, currentNode.coords).map(
      (coords) => ({
        coords,
        cost: currentNode.cost + 1,
      })
    );

    queue.push(...nextCells);
  }

  return queue[0] ? queue[0].cost : Number.POSITIVE_INFINITY;
};

const findStarts = (grid: number[][]): Coords[] => {
  return grid.reduce<Coords[]>(
    (acc, row, y) => [
      ...acc,
      ...row
        .map((value, x) => ({ value, x, y }))
        .filter(({ value }) => value === 0)
        .map(({ x, y }) => ({ x, y })),
    ],
    []
  );
};

challenge(12, (rawInput) => {
  const { start, grid, end } = prepareGrid(rawInput);

  const path = findPath(grid, start, end);

  console.log("[Part1]", path);

  const starts = findStarts(grid);
  const paths = starts.map((dynamicStart, index) => {
    logLine(`[Part2] ${Math.floor(((index + 1) / starts.length) * 100)}%`);

    return findPath(grid, dynamicStart, end);
  });

  console.log(`[Part2] ${Math.min(...paths)}`);
});
