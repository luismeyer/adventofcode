import { challenge } from "./common.ts";

type Monkey = {
  number: number;
  items: number[];
  inspectedItems: number;
  divisor: number;
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
      divisor,
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

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);

export const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

const monkeyAction = (rawInput: string, rounds: number, advanced?: boolean) => {
  const monkeys = setupMonkeys(rawInput);

  const divisors = monkeys.map(({ divisor }) => divisor);
  const manageableLvl = divisors.reduce(lcm);

  Array(rounds)
    .fill(0)
    .forEach((_, round) => {
      monkeys.forEach((monkey) => {
        const { calculateWorryLevel, findTargetMonkey, items } = monkey;

        items.forEach((item) => {
          let newItem = calculateWorryLevel(item);

          if (advanced) {
            newItem = newItem % manageableLvl;
          } else {
            newItem = Math.floor(newItem / 3);
          }

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

const calculateBusiness = (monkeys: Monkey[]) => {
  const [first, second] = findBiggestTwo(
    monkeys.map(({ inspectedItems }) => inspectedItems)
  );

  return first * second;
};

challenge(11, (rawInput) => {
  const part1 = monkeyAction(rawInput, 20);
  console.log("[Part1]", calculateBusiness(part1));

  const part2 = monkeyAction(rawInput, 10000, true);
  console.log("[Part2]", calculateBusiness(part2));
});
