import { CACHE_EXPIRY_MS, foldersToIgnore } from "../consts";
import { FileInfo } from "../interfaces/fileinfo";
import { FolderCache } from "../interfaces/foldercache";
import { detectPrimaryLanguage } from "./primaryLanguage";

/**
 * Cache for gitignore folders to avoid frequent disk access.\
 * It stores the folders and the timestamp of when it was last updated.
 */
export let folderCache: FolderCache | null = null;

/**
 * Parses a .gitignore file and returns an array of ignore patterns.
 * @param folder - The folder containing the .gitignore file.
 * @returns An array of ignore patterns.
 */
export function parseGitignore(folder: string): string[] {
  const fs = require("fs");
  const path = require("path");
  const gitignorePath = path.join(folder, ".gitignore");
  let patterns: string[] = [];
  if (fs.existsSync(gitignorePath)) {
    try {
      const lines = fs.readFileSync(gitignorePath, "utf-8").split(/\r?\n/);
      patterns = lines
        .map((line: string) => line.trim())
        .filter((line: string) => line && !line.startsWith("#"));
    } catch {}
  }
  return patterns;
}

/**
 * Finds all folders containing a .gitignore file in the specified root directory.
 * @param root - The root directory to start scanning from.
 * @returns A promise that resolves to an array of FileInfo objects representing the found folders.
 */
export async function findGitignoreFolders(root: string): Promise<FileInfo[]> {
  const results: FileInfo[] = [];
  async function scan(dir: string) {
    const entries = await import("fs/promises").then((fs) =>
      fs.readdir(dir, { withFileTypes: true }),
    );
    for (const entry of entries) {
      if (entry.isDirectory() && foldersToIgnore.includes(entry.name)) continue;
      const fullPath = require("path").join(dir, entry.name);
      if (entry.isDirectory()) {
        const gitignorePath = require("path").join(fullPath, ".gitignore");
        try {
          await import("fs/promises").then((fs) => fs.access(gitignorePath));
          results.push({
            name: fullPath.replace(root, "").replace(/^\\|\//, ""),
            commandline: fullPath,
          });
        } catch {}
        await scan(fullPath);
      }
    }
  }
  await scan(root);
  return results;
}

/**
 * Checks if a file or folder name is ignored by the provided patterns.
 * @param name - The name of the file or folder to check.
 * @param patterns - An array of ignore patterns.
 * @returns True if the name is ignored, false otherwise.
 */
export function isIgnoredByPatterns(name: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.endsWith("/")) {
      return name === pattern.replace(/\/$/, "");
    }
    return name === pattern;
  });
}

/**
 * Retrieves cached gitignore folders or scans for them if cache is expired or not available.
 * @param root - The root directory to scan for gitignore folders.
 * @param forceRefresh - Whether to force a refresh of the cache.
 * @returns A promise that resolves to an array of FileInfo objects representing the gitignore folders.
 */
export async function getCachedGitignoreFolders(
  root: string,
  forceRefresh: boolean = false,
): Promise<FileInfo[]> {
  const now = Date.now();
  if (
    !forceRefresh &&
    folderCache &&
    folderCache.timestamp + CACHE_EXPIRY_MS > now
  ) {
    return folderCache.folders;
  }
  const folders = await findGitignoreFolders(root);
  for (const folder of folders) {
    const langInfo = await detectPrimaryLanguage(folder.commandline);
    folder.language = langInfo.language;
    folder.icon = langInfo.icon;
  }
  folderCache = { folders, timestamp: now };
  return folders;
}
