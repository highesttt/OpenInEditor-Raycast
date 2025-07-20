import { Icon } from "@raycast/api";
import { execFile } from "child_process";
import { promisify } from "util";

/**
 * Cache expiry time in milliseconds (2 hours).
 */
export const CACHE_EXPIRY_MS = 2 * 60 * 60 * 1000;
export const execFileAsync = promisify(execFile);

/**
 * The key used to store custom editor commands in local storage.
 */
export const STORAGE_KEY = "custom_editors";

/**
 * Folders to ignore when scanning for files or directories.
 */
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

/**
 * Maps file extensions to their corresponding programming languages and icons.
 */
export const extLangMap: Record<
  string,
  { language: string; icon: Icon | string }
> = {
  ".py": { language: "Python", icon: 'icons/python.svg' },
  ".js": { language: "JavaScript", icon: 'icons/javascript.svg' },
  ".ts": { language: "TypeScript", icon: 'icons/typescript.svg' },
  ".tsx": { language: "TypeScript", icon: 'icons/react.svg' },
  ".vue": { language: "Vue.js", icon: 'icons/vuejs.svg' },
  ".rs": { language: "Rust", icon: 'icons/rust.svg' },
  ".go": { language: "Go", icon: 'icons/go.svg' },
  ".java": { language: "Java", icon: 'icons/java.svg' },
  ".kt": { language: "Kotlin", icon: 'icons/kotlin.svg' },
  ".rb": { language: "Ruby", icon: 'icons/ruby.svg' },
  ".gd": { language: "Godot", icon: 'icons/godot.svg' },
  ".swift": { language: "Swift", icon: 'icons/swift.svg' },
  ".dart": { language: "Dart", icon: 'icons/dart.svg' },
  ".cpp": { language: "C++", icon: 'icons/cpp.svg' },
  ".c": { language: "C", icon: 'icons/c.svg' },
  ".cs": { language: "C#", icon: 'icons/csharp.svg' },
};
