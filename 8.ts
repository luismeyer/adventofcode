import { challenge } from "./common.ts";

const inspectAllTrees = (
  lines: number[][],
  cb: (options: {
    tree: number;
    left: number[];
    right: number[];
    top: number[];
    bottom: number[];
  }) => void
) => {
  lines.forEach((horizontalTrees, yIndex) => {
    horizontalTrees.forEach((tree, xIndex) => {
      const verticalTrees = Array(lines.length)
        .fill(0)
        .map((_, i) => lines[i][xIndex]);

      cb({
        tree,
        left: horizontalTrees.slice(0, xIndex),
        right: horizontalTrees.slice(xIndex + 1),
        top: verticalTrees.slice(0, yIndex),
        bottom: verticalTrees.slice(yIndex + 1),
      });
    });
  });
};

const visible = (lines: number[][]) => {
  let visible = 0;

  inspectAllTrees(lines, ({ tree, bottom, left, right, top }) => {
    const biggestLeft = Math.max(...left) < tree;
    const biggestRight = Math.max(...right) < tree;
    const biggestTop = Math.max(...top) < tree;
    const biggestBottom = Math.max(...bottom) < tree;

    if (biggestLeft || biggestRight || biggestTop || biggestBottom) {
      visible = visible + 1;
    }
  });

  return visible;
};

const visibleBefore = (tree: number, treeLine: number[]) => {
  const blockingIndex = treeLine.findLastIndex(
    (compareTree) => compareTree >= tree
  );

  return blockingIndex >= 0 ? treeLine.length - blockingIndex : treeLine.length;
};

const visibleAfter = (tree: number, treeLine: number[]) => {
  const blockingIndex = treeLine.findIndex(
    (compareTree) => compareTree >= tree
  );

  return blockingIndex >= 0 ? blockingIndex + 1 : treeLine.length;
};

const scenic = (lines: number[][]) => {
  let highestScore = Number.NEGATIVE_INFINITY;

  inspectAllTrees(lines, ({ tree, bottom, left, right, top }) => {
    const visibleBottom = visibleAfter(tree, bottom);
    const visibleRight = visibleAfter(tree, right);

    const visibleTop = visibleBefore(tree, top);
    const visibleLeft = visibleBefore(tree, left);

    const score = visibleBottom * visibleRight * visibleLeft * visibleTop;

    if (score > highestScore) {
      console.log({ visibleBottom, visibleRight, visibleLeft, visibleTop });
      highestScore = score;
    }
  });

  return highestScore;
};

challenge(8, (rawInput) => {
  const lines = rawInput
    .split("\n")
    .filter((line) => Boolean(line))
    .map((line) => line.split("").map(Number));

  console.log("Part1: ", visible(lines));

  console.log("Part2: ", scenic(lines));
});
