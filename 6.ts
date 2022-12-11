import { challenge } from "./common.ts";

type Marker = {
  index: number;
  marker: string;
};

const findMarker = (chars: string[], length: number) => {
  const tmp: string[] = [];

  const found = chars.some((char) => {
    if (!char.trim() || char === "\n") {
      return false;
    }

    if (tmp.length >= length) {
      tmp.shift();
    }

    tmp.push(char);

    const hasDoubles = tmp.some((c, i, r) => r.lastIndexOf(c) !== i);

    return tmp.length === length && !hasDoubles;
  });

  return found ? tmp.join("") : "";
};

challenge(6, (rawInput) => {
  const chars = rawInput.split("");

  const shortMarkerLength = 4;
  const shortMarker = findMarker(chars, shortMarkerLength);

  if (shortMarker) {
    console.log("Short: ", rawInput.indexOf(shortMarker) + shortMarkerLength);
  }

  const longMarkerLength = 14;
  const longMarker = findMarker(chars, longMarkerLength);

  if (longMarker) {
    console.log("Long: ", rawInput.indexOf(longMarker) + longMarkerLength);
  }
});
