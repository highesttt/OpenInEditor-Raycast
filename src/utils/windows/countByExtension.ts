import { execSync } from "child_process";

export function countFilesByExtensionWin(
  folder: string,
  extensions: string[],
): Record<string, number> {
  const extCounts: Record<string, number> = {};
  for (const ext of extensions) {
    try {
      const result = execSync(`dir /s /b "${folder}\\*${ext}"`, {
        encoding: "utf-8",
      });
      const files = result.split(/\r?\n/).filter((line: string) => line.trim());
      extCounts[ext] = files.length;
    } catch {
      extCounts[ext] = 0;
    }
  }
  return extCounts;
}
