import { challenge } from "./common.ts";

challenge(1, (rawInput) => {
  const input = rawInput.split("\n");

  let index = 0;
  const numbers: number[] = [];

  input.forEach((line) => {
    if (line === "") {
      index = index + 1;
      return;
    }

    if (!numbers[index]) {
      numbers[index] = 0;
    }

    numbers[index] = numbers[index] + Number(line);
  });

  console.log(numbers);

  const highestNumber = numbers.reduce(
    (acc, number) => {
      const [first, second, third] = acc;

      if (number > first) {
        return [number, first, second];
      }

      if (number > second) {
        return [first, number, second];
      }

      if (number > third) {
        return [first, second, number];
      }

      return acc;
    },
    [0, 0, 0]
  );

  console.log(highestNumber);

  console.log(highestNumber[0] + highestNumber[1] + highestNumber[2]);
});
