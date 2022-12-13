import { challenge } from "./common.ts";

type CleanCmd = number | null;

const prepare = (lines: string[]): CleanCmd[] => {
  return lines.reduce<CleanCmd[]>((acc, line) => {
    const [cmd, value] = line.split(" ");

    if (cmd === "noop") {
      return [...acc, null];
    }

    if (cmd === "addx") {
      return [...acc, null, Number(value)];
    }

    throw new Error("Unimplemnted cmd");
  }, []);
};

const Part1Cycles = new Set([20, 60, 100, 140, 180, 220]);

const test = `
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`;

challenge(10, (rawInput) => {
  const lines = rawInput.split("\n").filter(Boolean);

  let x = 1;
  let part1 = 0;

  const cmds = prepare(lines);

  cmds.forEach((value, index) => {
    const clock = index + 1;

    if (Part1Cycles.has(clock)) {
      part1 = part1 + x * clock;
    }

    if (typeof value === "number") {
      x = x + value;
    }
  });

  console.log("Part1", part1);
});
