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

const MeasureCycles = new Set([20, 60, 100, 140, 180, 220]);

const simpleCPU = (cmds: CleanCmd[]) => {
  let x = 1;
  let strength = 0;

  cmds.forEach((value, index) => {
    const clock = index + 1;

    if (MeasureCycles.has(clock)) {
      strength = strength + x * clock;
    }

    if (typeof value === "number") {
      x = x + value;
    }
  });

  return strength;
};

const draw = (cmds: CleanCmd[], lineLength: number) => {
  let line = "";

  let x = 1;

  cmds.forEach((cmd) => {
    const lineIndex = line.length;

    const drawSprite =
      lineIndex === x || lineIndex - 1 === x || lineIndex + 1 === x;

    const char = drawSprite ? "X" : ".";

    line = line + char;

    if (line.length === lineLength) {
      console.log(line);
      line = "";
    }

    if (typeof cmd === "number") {
      x = x + cmd;
    }
  });
};

challenge(10, (rawInput) => {
  const lines = rawInput.split("\n").filter(Boolean);
  const cmds = prepare(lines);

  const part1 = simpleCPU(cmds);

  console.log("Part1", part1);

  const lineLength = 40;

  draw(cmds, lineLength);
});
