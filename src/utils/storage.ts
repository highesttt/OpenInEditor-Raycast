import { LocalStorage } from "@raycast/api";
import { STORAGE_KEY } from "../consts";
import { CustomEditor } from "../interfaces/customeditor";
import { CustomIgnoredFolder } from "../interfaces/customignoredfolder";

const IGNORED_FOLDERS_KEY = "custom_ignored_folders";

/**
 * Retrieves the custom editors from local storage.
 * @returns A promise that resolves to an array of CustomEditor objects.
 */
export async function getCustomEditors(): Promise<CustomEditor[]> {
  try {
    const raw = await LocalStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw as string) : [];
  } catch {
    return [];
  }
}

/**
 * Saves the custom editors to local storage.
 * @param editors - The array of custom editors to save.
 */
export async function setCustomEditors(editors: CustomEditor[]) {
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(editors));
}

/**
 * Retrieves custom ignored folders from local storage.
 * @returns A promise that resolves to an array of CustomIgnoredFolder objects.
 */
export async function getCustomIgnoredFolders(): Promise<
  CustomIgnoredFolder[]
> {
  try {
    const raw = await LocalStorage.getItem(IGNORED_FOLDERS_KEY);
    return raw ? JSON.parse(raw as string) : [];
  } catch {
    return [];
  }
}

/**
 * Stores custom ignored folders in local storage.
 * @param folders - Array of CustomIgnoredFolder objects to store.
 */
export async function setCustomIgnoredFolders(
  folders: CustomIgnoredFolder[],
): Promise<void> {
  await LocalStorage.setItem(IGNORED_FOLDERS_KEY, JSON.stringify(folders));
}
