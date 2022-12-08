import "https://deno.land/x/dotenv@v3.2.0/load.ts";

const cookie = Deno.env.get("COOKIE");

if (!cookie) {
  throw new Error("MISSING COOKIE");
}

export const challenge = async (day: number, fc: (input: string) => void) => {
  const jsonResponse = await fetch(
    `https://adventofcode.com/2022/day/${day}/input`,
    { headers: { cookie } }
  );

  fc(await jsonResponse.text());
};

export const Alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
