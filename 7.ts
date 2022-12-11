import { challenge } from "./common.ts";

type File = {
  name: string;
  size: number;
  type: "file";
};

type Dir = {
  parentDir?: Dir;
  content: Array<Dir | File>;
  name: string;
  type: "dir";
};

const fs: Dir = {
  name: "system",
  type: "dir",
  content: [
    {
      name: "/",
      content: [],
      type: "dir",
    },
  ],
};

const isDir = (item: File | Dir): item is Dir => item.type === "dir";

const buildFs = (lines: string[]) => {
  let currentDir: Dir = fs;

  lines.forEach((line) => {
    const [a, b, c] = line.split(" ");

    if (a === "$") {
      if (b === "ls") {
        return;
      }

      if (b === "cd") {
        if (c === "..") {
          const { parentDir } = currentDir;

          if (!parentDir) {
            throw new Error("Missing parentdir");
          }

          currentDir = parentDir;
          return;
        } else {
          const oldCurrentDir = currentDir;

          const newCurrentDir = currentDir.content
            .filter(isDir)
            .find((item) => item.name === c);

          if (!newCurrentDir) {
            throw new Error(`Missing dir: ${c}`);
          }

          currentDir = newCurrentDir;
          currentDir.parentDir = oldCurrentDir;

          return;
        }
      }
    }

    if (a === "dir") {
      currentDir.content.push({ type: "dir", name: b, content: [] });
    } else {
      currentDir.content.push({ type: "file", name: b, size: Number(a) });
    }
  });
};

const calcSize = (
  dir: Dir,
  dirSizeCallback?: (dirSize: number, dir: Dir) => void
): number => {
  const dirSize = Object.values(dir.content)
    .map((item) => {
      if (isDir(item)) {
        return calcSize(item, dirSizeCallback);
      }

      return item.size;
    })
    .reduce((acc, curr) => acc + curr, 0);

  if (dirSizeCallback) {
    dirSizeCallback(dirSize, dir);
  }

  return dirSize;
};

challenge(7, (rawInput) => {
  buildFs(rawInput.split("\n"));
  console.log("FS: ", fs);

  let resultPart1 = 0;
  calcSize(fs, (dirSize, { name }) => {
    if (dirSize >= 100000) {
      return;
    }

    console.log("[Part1] Found:", name, dirSize);

    resultPart1 = resultPart1 + dirSize;
  });

  console.log("[Part1] Result:", resultPart1, "\n");

  let resultPart2 = Infinity;
  const unusedSpace = 70000000 - calcSize(fs);
  const neededSpace = 30000000 - unusedSpace;

  console.log("[Part2] Needed Space:", neededSpace);

  calcSize(fs, (dirSize, { name }) => {
    if (dirSize < neededSpace) {
      return;
    }

    console.log("[Part2] Found:", name, dirSize);

    if (dirSize < resultPart2) {
      resultPart2 = dirSize;
    }
  });

  console.log("[Part2] Result:", resultPart2);
});
