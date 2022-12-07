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
