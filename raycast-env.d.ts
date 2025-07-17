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
  "editorCommand": string,
  /** Editor Command for Kotlin - Custom command to open Kotlin projects. Use %s as a placeholder for the path. */
  "editorCommandKotlin": string,
  /** Editor Command for Java - Custom command to open Java projects. Use %s as a placeholder for the path. */
  "editorCommandJava": string,
  /** Editor Command for Python - Custom command to open Python projects. Use %s as a placeholder for the path. */
  "editorCommandPython": string,
  /** Editor Command for JavaScript/TypeScript - Custom command to open JS/TS projects. Use %s as a placeholder for the path. */
  "editorCommandTypeScript": string,
  /** Editor Command for C/C++ - Custom command to open C/C++ projects. Use %s as a placeholder for the path. */
  "editorCommandCpp": string,
  /** Editor Command for Rust - Custom command to open Rust projects. Use %s as a placeholder for the path. */
  "editorCommandRust": string,
  /** Editor Command for Go - Custom command to open Go projects. Use %s as a placeholder for the path. */
  "editorCommandGo": string,
  /** Editor Command for Ruby - Custom command to open Ruby projects. Use %s as a placeholder for the path. */
  "editorCommandRuby": string,
  /** Editor Command for Dart - Custom command to open Dart projects. Use %s as a placeholder for the path. */
  "editorCommandDart": string,
  /** Editor Command for C# - Custom command to open C# projects. Use %s as a placeholder for the path. */
  "editorCommandCSharp": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `findFolders` command */
  export type FindFolders = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `findFolders` command */
  export type FindFolders = {}
}

