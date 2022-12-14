import { challenge } from "./common.ts";

type Monkey = {
  number: number;
  items: number[];
  inspectedItems: number;
  calculateWorryLevel: (item: number) => number;
  findTargetMonkey: (worryLevel: number) => number;
};

const setupMonkeys = (input: string): Monkey[] => {
  const monkeysInput = input.split("Monkey ");

  const monkeys = monkeysInput.filter(Boolean).map((monkey): Monkey => {
    const [number, starting, operation, ...test] = monkey.split("\n");

    const [math, valueInput] = operation
      .trim()
      .replace("Operation: ", "")
      .replace("new = old ", "")
      .split(" ");

    const [check, trueCase, falseCase] = test;

    const divisor = Number(check.replace("Test: divisible by ", ""));

    const trueMonkey = Number(
      trueCase.replace("If true: throw to monkey ", "")
    );
    const falseMonkey = Number(
      falseCase.replace("If false: throw to monkey", "")
    );

    return {
      number: Number(number.replace(":", "")),
      items: starting.replace("Starting items: ", "").split(",").map(Number),
      inspectedItems: 0,
      calculateWorryLevel: (item) => {
        const value = valueInput === "old" ? item : Number(valueInput);

        if (math === "*") {
          return item * value;
        }

        if (math === "+") {
          return item + value;
        }

        throw new Error("Unimplemented method");
      },
      findTargetMonkey: (worryLevel) => {
        const bool = worryLevel % divisor === 0;

        return bool ? trueMonkey : falseMonkey;
      },
    };
  });

  return monkeys;
};

const findBiggestTwo = (numbers: number[]) => {
  return numbers.reduce(
    (acc, number) => {
      const [first, second] = acc;

      if (number > first) {
        return [number, first];
      }

      if (number > second) {
        return [first, number];
      }

      return acc;
    },
    [0, 0]
  );
};

const part1 = (rawInput: string) => {
  const monkeys = setupMonkeys(rawInput);

  const rounds = 20;

  Array(rounds)
    .fill(0)
    .forEach(() => {
      monkeys.forEach((monkey) => {
        const { calculateWorryLevel, findTargetMonkey, items } = monkey;

        items.forEach((item) => {
          const newItem = Math.floor(calculateWorryLevel(item) / 3);

          monkey.inspectedItems = monkey.inspectedItems + 1;

          const targetMonkeyNumber = findTargetMonkey(newItem);
          const targetMonkey = monkeys.find(
            ({ number }) => number === targetMonkeyNumber
          );

          if (!targetMonkey) {
            throw new Error("Missing target monkey");
          }

          targetMonkey.items.push(newItem);
        });

        monkey.items = [];
      });
    });

  return monkeys;
};

challenge(11, (rawInput) => {
  const monkeys = part1(rawInput);

  const [first, second] = findBiggestTwo(
    monkeys.map(({ inspectedItems }) => inspectedItems)
  );

  console.log("[Part1]", first * second);
});

const test = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;
