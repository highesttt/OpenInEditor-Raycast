import { LocalStorage } from "@raycast/api";
import { STORAGE_KEY } from "../consts";
import { CustomEditor } from "../interfaces/customeditor";

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