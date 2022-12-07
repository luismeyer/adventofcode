import { challenge } from "./common.ts";

const ShapePoints: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
};

const WinMapping: Record<string, string> = {
  A: "B",
  B: "C",
  C: "A",
};

const LoseMapping: Record<string, string> = {
  A: "C",
  B: "A",
  C: "B",
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

const transform = (opponent: string, tactic: string) => {
  if (tactic === "X") {
    return LoseMapping[opponent];
  }

  if (tactic === "Y") {
    return opponent;
  }

  if (tactic === "Z") {
    return WinMapping[opponent];
  }

  throw Error("Wrong tactic");
};

challenge(2, (rawInput) => {
  const result = rawInput.split("\n").reduce((acc, line) => {
    const [opponentShape, tactic] = line.split(" ");

    if (!opponentShape || !tactic) {
      return acc;
    }

    const selfShape = transform(opponentShape, tactic);
    const self = ShapePoints[selfShape];

    const opponent = ShapePoints[opponentShape];

    return acc + self + points(opponent, self);
  }, 0);

  console.log(result);
});
