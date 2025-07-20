import * as fs from "fs/promises";
import { Dirent } from "fs";
import * as path from "path";

/**
 * Cross-platform async function to count files by their extensions in a given folder.
 * @param folder - The folder to search in.
 * @param extensions - An array of file extensions to count.
 * @returns An object mapping each extension to its file count.
 */
export async function countFilesByExtension(
  folder: string,
  extensions: string[],
): Promise<Record<string, number>> {
  const extCounts: Record<string, number> = {};
  for (const ext of extensions) {
    extCounts[ext] = 0;
  }
  async function scan(dir: string) {
    let entries: Dirent[] = [];
    try {
      entries = (await fs.readdir(dir, { withFileTypes: true })) as Dirent[];
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        await scan(path.join(dir, entry.name));
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          extCounts[ext]++;
        }
      }
    }
  }
  await scan(folder);
  return extCounts;
}
