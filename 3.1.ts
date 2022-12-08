import { challenge, Alphabet } from "./common.ts";

challenge(3, (rawInput) => {
  const input = rawInput
    .split("\n")
    .map((line) => {
      const middle = line.length / 2;

      const firstHalf = line.substring(0, middle).split("");
      const secondHalf = line.substring(middle).split("");

      const char = firstHalf.find((c) => secondHalf.includes(c));

      if (!char) {
        return 0;
      }

      return Alphabet.indexOf(char) + 1;
    })
    .reduce((acc, number) => acc + number, 0);

  console.log(input);
});
