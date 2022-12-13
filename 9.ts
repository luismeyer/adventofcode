import { challenge } from "./common.ts";

type Cell = {
  x: number;
  y: number;
};

const updateTailCell = (head: Cell, tail: Cell): Cell => {
  const xDiff = head.x - tail.x;
  const yDiff = head.y - tail.y;

  if (Math.abs(xDiff) !== 2 && Math.abs(yDiff) !== 2) {
    return tail;
  }

  let x = head.x;
  let y = head.y;

  if (xDiff === 2) {
    x = head.x - 1;
  }

  if (xDiff === -2) {
    x = head.x + 1;
  }

  if (yDiff === 2) {
    y = head.y - 1;
  }

  if (yDiff === -2) {
    y = head.y + 1;
  }

  return { x, y };
};

const createVisualize = (start: Cell) => {
  const padding = 50;

  const smallestX = start.x - padding;
  const smallestY = start.y - padding;
  const largestX = start.x + padding;
  const largestY = start.y + padding;

  return (visited: Cell[], head?: Cell, tail?: Cell, knots?: Cell[]) => {
    for (let yIndex = smallestY; yIndex < largestY; yIndex++) {
      const y = yIndex * -1;

      let line = "";

      for (let x = smallestX; x < largestX; x++) {
        let char = ".";

        if (visited.some((visited) => visited.x === x && visited.y === y)) {
          char = "#";
        }

        if (tail?.x === x && tail?.y === y) {
          char = "T";
        }

        if (head?.x === x && head?.y === y) {
          char = "H";
        }

        const knotIndex = knots?.findIndex(
          (knot) => knot.x === x && knot.y === y
        );

        if (typeof knotIndex === "number" && knotIndex >= 0) {
          char = String(knotIndex + 1);
        }

        line = line + char;
      }

      const linePrefix = y + " ".repeat(3 - String(y).length);

      console.log(linePrefix + line);
    }

    console.log("");
  };
};

const updateHead = (head: Cell, direction: string): Cell => {
  switch (direction) {
    case "U":
      return { x: head.x, y: head.y + 1 };
    case "D":
      return { x: head.x, y: head.y - 1 };
    case "L":
      return { x: head.x - 1, y: head.y };
    case "R":
      return { x: head.x + 1, y: head.y };
    default:
      throw new Error("Unknown direction");
  }
};

const countCells = (visited: Cell[]): number =>
  new Set(visited.map(({ x, y }) => `${x}-${y}`)).size;

challenge(9, (rawInput) => {
  const lines = rawInput.split("\n").filter(Boolean);

  const start: Cell = { x: 0, y: 0 };

  const visualize = createVisualize(start);

  let head = { ...start };
  let tail = { ...start };

  const part1 = lines.reduce<Cell[]>((acc, line) => {
    const [direction, amount] = line.split(" ");

    const newCells = Array(Number(amount))
      .fill(0)
      .map(() => {
        head = updateHead(head, direction);
        tail = updateTailCell(head, tail);

        return tail;
      });

    return [...acc, ...newCells];
  }, []);

  visualize(part1, head, tail);

  console.log("\n", "Part1", countCells(part1), "\n");

  const knots = Array(8)
    .fill(0)
    .map(() => ({ ...start }));

  head = { ...start };
  tail = { ...start };

  const part2 = lines.reduce<Cell[]>((acc, line) => {
    const [direction, amount] = line.split(" ");

    const newCells = Array(Number(amount))
      .fill(0)
      .map(() => {
        head = updateHead(head, direction);

        for (let index = 0; index < knots.length; index++) {
          const prevIndex = index - 1;
          const prevKnot = prevIndex >= 0 ? knots[prevIndex] : head;

          knots[index] = updateTailCell(prevKnot, knots[index]);
        }

        tail = updateTailCell(knots[knots.length - 1], tail);

        return tail;
      });

    return [...acc, ...newCells];
  }, []);

  visualize(part2, head, tail, knots);

  console.log("\n", "Part2", countCells(part2), "\n");
});
