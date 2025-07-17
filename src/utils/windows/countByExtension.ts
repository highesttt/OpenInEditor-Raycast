import { execSync } from "child_process";

/**
 * A windows-specific function to count files by their extensions in a given folder.
 * @param folder - The folder to search in.
 * @param extensions - An array of file extensions to count.
 * @returns An object mapping each extension to its file count.
 */
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
