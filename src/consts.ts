import { Icon } from "@raycast/api";
import { execFile } from "child_process";
import { promisify } from "util";
import { getDeviconUrl } from "./utils/getIcon";

export const CACHE_EXPIRY_MS = 2 * 60 * 60 * 1000;
export const execFileAsync = promisify(execFile);

export const foldersToIgnore = [
  "node_modules",
  ".git",
  ".svn",
  ".hg",
  ".husky",
  "vendor",
  ".idea",
  ".vscode",
  "dist",
  "build",
  "out",
  "coverage",
  "tmp",
  "temp",
  "target",
];

export const languageDetectionCache: Record<
  string,
  { language: string; icon: Icon | string }
> = {};

export const extLangMap: Record<
  string,
  { language: string; icon: Icon | string }
> = {
  ".py": { language: "Python", icon: getDeviconUrl("Python") },
  ".js": { language: "JavaScript", icon: getDeviconUrl("JavaScript") },
  ".ts": { language: "TypeScript", icon: getDeviconUrl("TypeScript") },
  ".tsx": { language: "TypeScript", icon: getDeviconUrl("React") },
  ".vue": { language: "Vue.js", icon: getDeviconUrl("Vue.js") },
  ".rs": { language: "Rust", icon: getDeviconUrl("Rust") },
  ".go": { language: "Go", icon: getDeviconUrl("Go") },
  ".java": { language: "Java", icon: getDeviconUrl("Java") },
  ".kt": { language: "Kotlin", icon: getDeviconUrl("Kotlin") },
  ".rb": { language: "Ruby", icon: getDeviconUrl("Ruby") },
  ".dart": { language: "Dart", icon: getDeviconUrl("Dart") },
  ".cpp": { language: "C++", icon: getDeviconUrl("C++") },
  ".c": { language: "C", icon: getDeviconUrl("C") },
  ".cs": { language: "C#", icon: getDeviconUrl("C#") },
};
