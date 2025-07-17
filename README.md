# Raycast Open In Code Editor Extension [WINDOWS]

</br>

This Raycast extension allows you to open directories in your preferred code editor directly from Raycast.
It scans a specified root folder for projects (folders containing `.gitignore` files are counted as projects) and provides a list of these projects for quick access.
The first time you run the extension, it will take some time to scan the root folder and cache the results. Subsequent runs will be faster as it uses cached data.

![Example](https://raw.githubusercontent.com/highesttt/OpenInCode-Raycast/main/assets/github/example.png)

## Requirements 📝

- [Node.js](https://nodejs.org/) (>= 24)
- [Raycast](https://www.raycast.com/) (>= 0.26.3.0)
- A node package manager like [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) or [bun](https://bun.sh/)

## Installation 🚀

1. Clone the repository:

   ```bash
   git clone https://github.com/highesttt/OpenInCode-Raycast.git 
   ```

2. Install dependencies:

   ```bash
   cd OpenInCode-Raycast
   bun i
   ```

3. Start the development server:

   ```bash
   bun run dev
   ```

After running the above command, the extension should be available in Raycast, you can CTRL+C to stop the development server.

## Supported Languages/Frameworks 🌐

- JavaScript
- TypeScript
- Python
- Ruby
- Go
- Java
- C#
- C++
- Rust
- Dart
- Kotlin
- Vue.js
- React

## Suggestions and Contributions 💡

If you have any suggestions for improvements or new features, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/highesttt/OpenInCode-Raycast).

## Commit norms 📝

Every commit message should be made using `git-cz` and should follow the `.git-cz.json` config file.

## Icons 🖼️

The icons used in this extension are from [Raycast's icon library](https://www.raycast.com/icons) and [DevIcons](https://devicon.dev/).
