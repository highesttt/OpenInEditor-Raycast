import { CACHE_EXPIRY_MS, foldersToIgnore } from "../consts";
import { FileInfo } from "../interfaces/fileinfo";
import { FolderCache } from "../interfaces/foldercache";
import { detectPrimaryLanguage } from "./primaryLanguage";

export let folderCache: FolderCache | null = null;

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

export function isIgnoredByPatterns(name: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.endsWith("/")) {
      return name === pattern.replace(/\/$/, "");
    }
    return name === pattern;
  });
}

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
    const langInfo = detectPrimaryLanguage(folder.commandline);
    folder.language = langInfo.language;
    folder.icon = langInfo.icon;
  }
  folderCache = { folders, timestamp: now };
  return folders;
}
