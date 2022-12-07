import { challenge } from "./common.ts";

const ShapePoints: Record<string, number> = {
  A: 1,
  X: 1,
  B: 2,
  Y: 2,
  C: 3,
  Z: 3,
};

const points = (opponent: number, self: number) => {
  const win =
    (opponent === 1 && self === 2) ||
    (opponent === 2 && self === 3) ||
    (opponent === 3 && self === 1);

  const draw = opponent === self;

  if (draw) {
    return 3;
  }

  if (win) {
    return 6;
  }

  return 0;
};

type Line = {
  opponent: number;
  self: number;
};

challenge(2, (rawInput) => {
  const input = rawInput
    .split("\n")
    .map((line) => {
      const [opponent, self] = line.split(" ");

      if (!opponent || !self) {
        return;
      }

      return {
        opponent: ShapePoints[opponent],
        self: ShapePoints[self],
      };
    })
    .filter((line): line is Line => Boolean(line));

  const result = input.reduce(
    (acc, { opponent, self }) => acc + self + points(opponent, self),
    0
  );

  console.log(result);
});
