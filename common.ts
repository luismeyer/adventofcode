import "https://deno.land/x/dotenv@v3.2.0/load.ts";

const cookie = Deno.env.get("COOKIE");

if (!cookie) {
  throw new Error("MISSING COOKIE");
}

const tmpPath = (day: number) => `/tmp/AdventOfCode-${day}.txt`;

export const challenge = async (day: number, fc: (input: string) => void) => {
  const tmp = tmpPath(day);

  const decoder = new TextDecoder("utf-8");

  let text: string;

  try {
    console.log("Reading puzzle input from cache");
    const data = Deno.readFileSync(tmp);

    text = decoder.decode(data);
  } catch {
    console.info("Cachemiss: Fetching fresh puzzle input...");

    const jsonResponse = await fetch(
      `https://adventofcode.com/2022/day/${day}/input`,
      { headers: { cookie } }
    );

    text = await jsonResponse.text();

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    Deno.writeFileSync(tmp, data);
  }

  fc(text);
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

let lastLogLength = 0;

export const logLine = (text: string) => {
  const encoder = new TextEncoder();

  const {
    writeSync,
    stdout: { rid },
  } = Deno;

  const clearLine = "C".repeat(lastLogLength);
  writeSync(rid, encoder.encode(`${clearLine}\r`));

  writeSync(rid, encoder.encode(`${text}\r`));

  lastLogLength = text.length;
};
