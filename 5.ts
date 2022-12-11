import { challenge } from "./common.ts";

type Cmd = {
  source: number;
  target: number;
  count: number;
};

type Dock = Record<number, string[] | undefined>;

const visualize = (dock: Dock, cmd?: Cmd) => {
  const stacks = Object.values(dock);

  const biggestStack =
    stacks.reduce((acc, curr) => Math.max(acc, curr?.length ?? 0), 0) - 1;

  for (let index = 0; index < biggestStack; index++) {
    const lineIndex = biggestStack - index;

    const lineOutput = stacks.reduce((acc, stack) => {
      if (!stack) {
        throw new Error("Missing stack");
      }

      const value = stack[lineIndex];

      return value ? `${acc}[${value}] ` : `${acc}    `;
    }, "");

    console.log(lineOutput);
  }

  console.log(
    Object.keys(dock).reduce((acc, number) => `${acc}|${number}| `, "")
  );

  if (cmd) {
    const { count, source, target } = cmd;
    console.log(`Move ${count} from ${source} to ${target}`);
  }

  console.log("\n");
};

const prepareCommands = (cmds: string[]) =>
  cmds.map((cmd): Cmd => {
    const [crateCount, sourceTarget] = cmd.split(" from ");

    const [source, target] = sourceTarget.split(" to ");

    return {
      count: Number(crateCount),
      source: Number(source),
      target: Number(target.replace("\n", "")),
    };
  });

const createDock = (crates: string) => {
  const dock: Dock = {};

  crates
    .split("\n")
    .map((line) => line.match(/.{1,4}/g)?.map((match) => match.trim()))
    .forEach((line) => {
      if (!line) {
        return;
      }

      line.forEach((crate, index) => {
        const lineIndex = index + 1;
        const match = crate.match(/\[(\D)\]/);

        if (match) {
          const [letter] = match[1];

          let stack = dock[lineIndex];

          if (!stack) {
            stack = [];
          }

          stack.unshift(letter);

          dock[lineIndex] = stack;
        }
      });
    });

  return dock;
};

const moveSequential = (dock: Dock, cmds: Cmd[]) => {
  visualize(dock);

  cmds.forEach((cmd) => {
    const { count, source, target } = cmd;

    Array(count)
      .fill("")
      .forEach(() => {
        const sourceStack = dock[source];
        if (!sourceStack) {
          throw new Error(`Missing sourceStack ${cmd}`);
        }

        const crate = sourceStack.pop();

        if (!crate) {
          throw new Error(`Missing crate ${cmd}`);
        }

        const targetStack = dock[target];
        if (!targetStack) {
          throw new Error(`Missing targetStack ${cmd}`);
        }

        targetStack.push(crate);
      });
  });

  visualize(dock);
};

const moveBlocks = (dock: Dock, cmds: Cmd[]) => {
  visualize(dock);

  cmds.forEach((cmd) => {
    const { count, source, target } = cmd;

    const sourceStack = dock[source];
    if (!sourceStack) {
      throw new Error(`Missing sourceStack ${cmd}`);
    }

    const crates = sourceStack.splice(sourceStack.length - count, count);

    if (!crates) {
      throw new Error(`Missing crates ${cmd}`);
    }

    const targetStack = dock[target];
    if (!targetStack) {
      throw new Error(`Missing targetStack ${cmd}`);
    }

    targetStack.push(...crates);
  });

  visualize(dock);
};

challenge(5, (rawInput) => {
  const [crates, ...commandStrings] = rawInput.split("move ");

  const dock1: Dock = createDock(crates);

  const dock2: Dock = createDock(crates);

  const cmds = prepareCommands(commandStrings);

  moveSequential(dock1, cmds);

  moveBlocks(dock2, cmds);
});
