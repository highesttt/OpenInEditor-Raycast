import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { execFileAsync } from "./consts";
import { getCustomEditors } from "./utils/storage";

/**
 * Retrieves the custom editor command for a given programming language.
 * If no custom editor is defined, it returns undefined.
 * @param language - The programming language to find the custom editor for.
 * @returns A promise that resolves to the custom editor command or undefined.
 */
async function getCustomEditorCommand(
  language?: string,
): Promise<string | undefined> {
  if (!language) return undefined;
  try {
    const editors = await getCustomEditors();
    const normalizedLang = language.trim().toLowerCase();
    const found = editors.find(
      (e) => e.language.trim().toLowerCase() === normalizedLang,
    );
    return found?.command;
  } catch {
    return undefined;
  }
}

/**
 * Opens a folder in the user's preferred editor.
 * If a custom editor is defined for the folder's language, it uses that command.
 * Otherwise, it uses the default editor command from preferences.
 * @param folder - The folder path to open.
 * @param language - Optional programming language to determine custom editor.
 */
export async function openFolderInEditor(folder: string, language?: string) {
  const prefs = getPreferenceValues<{ editorCommand: string }>();
  let cmd = prefs.editorCommand;
  const customCommand = await getCustomEditorCommand(language);
  if (customCommand) {
    cmd = customCommand;
  }
  try {
    const commandArgs = cmd.match(/"[^"]+"|\S+/g) || [];
    if (!commandArgs[0]) throw new Error("Editor command is invalid.");
    const executable = commandArgs[0].replace(/"/g, "");
    if (process.platform === "darwin") {
      folder = "\"" + folder + "\"";
    }
    const args = commandArgs.slice(1).map((arg) => arg.replace("%s", folder));
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
        error instanceof Error ? error.message : `Failed to execute: ${cmd}`,
    });
  }
}
