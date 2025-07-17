import { Icon } from "@raycast/api";
import { extLangMap, languageDetectionCache } from "../consts";
import fs from "fs";
import path from "path";
import { countFilesByExtensionWin } from "./windows/countByExtension";
import { isIgnoredByPatterns, parseGitignore } from "./ignore";


/**
 * @param folder - The folder path to scan for primary language.
 * Detects the primary programming language based on common files and extensions.
 * @returns An object containing the detected language and its associated icon.
 */
export function detectPrimaryLanguage(folder: string): {
  language: string;
  icon: Icon | string;
} {
  if (languageDetectionCache[folder]) {
    return languageDetectionCache[folder];
  }
  const gitignorePatterns = parseGitignore(folder);
  const languageFiles = [
    { file: "package.json", language: "JavaScript/TypeScript" },
    { file: "requirements.txt", language: "Python" },
    { file: "Cargo.toml", language: "Rust" },
    { file: "go.mod", language: "Go" },
    { file: "Gemfile", language: "Ruby" },
    { file: "tsconfig.json", language: "TypeScript" },
  ];
  let detected: { language: string; icon: Icon | string } = {
    language: "Unknown",
    icon: Icon.Folder,
  };
  for (const { file, language } of languageFiles) {
    if (fs.existsSync(path.join(folder, file))) {
      if (file === "package.json") {
        try {
          const pkg = JSON.parse(
            fs.readFileSync(path.join(folder, file), "utf-8"),
          );
          const deps = Object.assign({}, pkg.dependencies, pkg.devDependencies);
          if (
            deps["react"] ||
            deps["react-dom"] ||
            deps["@types/react"] ||
            deps["@types/react-dom"]
          ) {
            detected = { language: "React", icon: 'icons/react.svg' };
            break;
          }
          if (
            deps["vue"] ||
            deps["@vue/runtime-core"] ||
            deps["@vue/cli-service"]
          ) {
            detected = { language: "Vue.js", icon: 'icons/vuejs.svg' };
            break;
          }
          if (
            deps["typescript"] ||
            fs.existsSync(path.join(folder, "tsconfig.json"))
          ) {
            detected = {
              language: "TypeScript",
              icon: 'icons/typescript.svg',
            };
            break;
          }
          detected = {
            language: "JavaScript",
            icon: 'icons/javascript.svg',
          };
          break;
        } catch {
          detected = {
            language,
            icon: `icons/javascript.svg`,
          };
          break;
        }
      } else {
        detected = {
          language,
          icon: `icons/${language.toLowerCase()}.svg`,
        };
        break;
      }
    }
  }
  /**
   * Scans the source folder for the primary programming language.
   * @param srcFolder - The source folder path.
   * @returns An object containing the detected language and its associated icon, or null if not found.
   */
  function scanSourceFolder(
    srcFolder: string,
  ): { language: string; icon: Icon | string } | null {
    if (!fs.existsSync(srcFolder) || !fs.statSync(srcFolder).isDirectory())
      return null;
    const files = fs.readdirSync(srcFolder);
    for (const file of files) {
      if (file.toLowerCase() === "program.cs" || file.endsWith(".cs")) {
        return { language: "C#", icon: 'icons/csharp.svg' };
      }
    }
    const extCount: Record<string, number> = {};
    for (const file of files) {
      if (isIgnoredByPatterns(file, gitignorePatterns)) continue;
      const ext = path.extname(file).toLowerCase();
      if (ext) extCount[ext] = (extCount[ext] || 0) + 1;
    }
    let maxExt = "";
    let maxCount = 0;
    for (const ext in extCount) {
      if (extCount[ext] > maxCount && extLangMap[ext]) {
        maxExt = ext;
        maxCount = extCount[ext];
      }
    }
    if (maxExt) return extLangMap[maxExt];
    for (const file of files) {
      const subPath = path.join(srcFolder, file);
      if (fs.statSync(subPath).isDirectory()) {
        const result = scanSourceFolder(subPath);
        if (result) return result;
      }
    }
    return null;
  }
  if (detected.language === "Unknown") {
    const sourceFolders = ["src", "app", "source", "lib"];
    for (const srcFolder of sourceFolders) {
      const fullSrc = path.join(folder, srcFolder);
      const result = scanSourceFolder(fullSrc);
      if (result) {
        detected = result;
        break;
      }
    }
  }
  if (detected.language === "Unknown") {
    const ambiguousFiles = [
      {
        file: "Makefile",
        extensions: [".c", ".cpp", ".h", ".hpp"],
        language: "C/C++",
      },
      { file: "gradle.properties", extensions: [".kt", ".java"], language: "" },
      { file: "pom.xml", extensions: [".kt", ".java"], language: "" },
    ];
    for (const { file, extensions, language } of ambiguousFiles) {
      if (fs.existsSync(path.join(folder, file))) {
        let extCounts: Record<string, number> = {};
        try {
          extCounts = countFilesByExtensionWin(folder, extensions);
        } catch {}
        const ktCount = (extCounts[".kt"] as number) ?? 0;
        const javaCount = (extCounts[".java"] as number) ?? 0;
        if (ktCount > 0 && javaCount === 0)
          detected = { language: "Kotlin", icon: 'icons/kotlin.svg' };
        else if (javaCount > 0 && ktCount === 0)
          detected = { language: "Java", icon: 'icons/java.svg' };
        else if (ktCount > 0 && javaCount > 0)
          detected = { language: "Java/Kotlin", icon: 'icons/java.svg' };
        else if (
          ((extCounts[".c"] as number) ?? 0) > 0 ||
          ((extCounts[".cpp"] as number) ?? 0) > 0
        )
          detected = { language: "C/C++", icon: 'icons/cpp.svg' };
        else if (file === "gradle.properties" || file === "pom.xml")
          detected = { language: "Java/Kotlin", icon: 'icons/java.svg' };
        else if (file === "Makefile")
          detected = { language: "C/C++/Other", icon: 'icons/cpp.svg' };
        break;
      }
    }
    if (detected.language === "Unknown") {
      try {
        const files = fs.readdirSync(folder);
        const extCount: Record<string, number> = {};
        for (const file of files) {
          if (isIgnoredByPatterns(file, gitignorePatterns)) continue;
          const ext = path.extname(file).toLowerCase();
          if (ext) extCount[ext] = (extCount[ext] || 0) + 1;
        }
        let maxExt = "";
        let maxCount = 0;
        for (const ext in extCount) {
          if (extCount[ext] > maxCount && extLangMap[ext]) {
            maxExt = ext;
            maxCount = extCount[ext];
          }
        }
        if (maxExt) detected = extLangMap[maxExt];
      } catch {}
    }
  }
  languageDetectionCache[folder] = detected;
  return detected;
}
