import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { execFileAsync } from "./consts";

export function getCustomEditorCommand(
  language: string,
  prefs: Preferences,
): string | undefined {
  switch (language) {
    case "Kotlin":
      return prefs.editorCommandKotlin;
    case "Java":
      return prefs.editorCommandJava;
    case "Python":
      return prefs.editorCommandPython;
    case "JavaScript/TypeScript":
      return prefs.editorCommandTypeScript;
    case "C/C++":
      return prefs.editorCommandCpp;
    case "Rust":
      return prefs.editorCommandRust;
    case "Go":
      return prefs.editorCommandGo;
    case "Ruby":
      return prefs.editorCommandRuby;
    case "Dart":
      return prefs.editorCommandDart;
    case "C#":
      return prefs.editorCommandCSharp;
    default:
      return undefined;
  }
}

export async function openFolderInEditor(folder: string, language?: string) {
  const prefs = getPreferenceValues<Preferences>();
  let commandToUse = prefs.editorCommand;
  const customCommand = language
    ? getCustomEditorCommand(language, prefs)
    : undefined;
  if (customCommand) {
    commandToUse = customCommand;
  }
  try {
    const commandParts = commandToUse.match(/"[^"]+"|\S+/g) || [];
    if (!commandParts[0]) throw new Error("Editor command is invalid.");
    const executable = commandParts[0].replace(/"/g, "");
    const args = commandParts.slice(1).map((arg) => arg.replace("%s", folder));
    await execFileAsync(executable, args);
    await showToast({
      style: Toast.Style.Success,
      title: "Opening Folder",
      message: `Opened ${folder}`,
    });
  } catch (error) {
    console.log(error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Error Opening Folder",
      message:
        error instanceof Error
          ? error.message
          : `Failed to execute: ${commandToUse}`,
    });
  }
}
