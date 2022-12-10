import { challenge } from "./common.ts";

challenge(4, (rawInput) => {
  let contains = 0;
  let overlaps = 0;

  rawInput.split("\n").forEach((line) => {
    if (!line) {
      console.log("ls");
      return false;
    }

    const [firstElf, secondElf] = line.split(",");

    const [firstfirst, firstsecond] = firstElf.split("-");
    const [secondfirst, secondsecond] = secondElf.split("-");

    const a = Number(firstfirst);
    const b = Number(firstsecond);
    const c = Number(secondfirst);
    const d = Number(secondsecond);

    const firstContainsSecond = a <= c && b >= d;
    const secondContainsFirst = c <= a && d >= b;

    if (firstContainsSecond || secondContainsFirst) {
      contains = contains + 1;
    }

    if (c <= b && d >= a) {
      overlaps = overlaps + 1;
    }
  });

  console.log(contains);
  console.log(overlaps);
});
