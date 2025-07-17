/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Root Folder - Base directory to scan for projects (folders containing .gitignore) */
  "rootFolder": string,
  /** Editor Command - Command to open folders in your code editor. Use %s as a placeholder for the path. */
  "editorCommand": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `findFolders` command */
  export type FindFolders = ExtensionPreferences & {}
  /** Preferences accessible in the `customEditors` command */
  export type CustomEditors = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `findFolders` command */
  export type FindFolders = {}
  /** Arguments passed to the `customEditors` command */
  export type CustomEditors = {}
}

