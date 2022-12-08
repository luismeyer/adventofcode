import { challenge, Alphabet } from "./common.ts";

challenge(3, (rawInput) => {
  let insertIndex = 0;
  const input: string[][] = [];

  rawInput.split("\n").forEach((line, index) => {
    if (index > 0 && index % 3 === 0) {
      insertIndex = insertIndex + 1;
    }

    if (!input[insertIndex]) {
      input[insertIndex] = [];
    }

    input[insertIndex] = [...input[insertIndex], line];
  }, []);

  const result = input
    .map((group) => {
      const [first, second, third] = group;

      const duplicate = first
        .split("")
        .find((char) => second.includes(char) && third.includes(char));

      if (!duplicate) {
        return 0;
      }

      return Alphabet.indexOf(duplicate) + 1;
    })
    .reduce((acc, number) => acc + number, 0);

  console.log(result);
});
