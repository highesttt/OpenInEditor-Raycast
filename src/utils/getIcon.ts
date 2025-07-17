export function getDeviconUrl(language: string): string {
  const deviconMap: Record<string, string> = {
    "JavaScript/TypeScript": "javascript",
    TypeScript: "typescript",
    JavaScript: "javascript",
    React: "react",
    Vue: "vuejs",
    "Vue.js": "vuejs",
    Python: "python",
    Rust: "rust",
    Go: "go",
    Ruby: "ruby",
    Dart: "dart",
    Java: "java",
    Kotlin: "kotlin",
    "C/C++": "cplusplus",
    CPlusPlus: "cplusplus",
    C: "c",
    "C#": "csharp",
  };
  const key =
    deviconMap[language] || language.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${key}/${key}-original.svg`;
}
