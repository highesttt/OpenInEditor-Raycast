# Raycast Open In Code Editor Extension [WINDOWS & MACOS] 🖥️

</br>

This Raycast extension allows you to open directories in your preferred code editor directly from Raycast.\
It scans a specified root folder for projects (folders containing `.gitignore` files are counted as projects) and provides a list of these projects for quick access.\
The first time you run the extension, it will take some time to scan the root folder and cache the results. Subsequent runs will be faster as it uses cached data.

## Requirements 📝

- [Node.js](https://nodejs.org/) (>= 24)
- [Raycast](https://www.raycast.com/) (>= 0.26.3.0)
- A node package manager like [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) or [bun](https://bun.sh/)

## Installation 🚀

1. Clone the repository:

   ```bash
   git clone https://github.com/highesttt/OpenInEditor-Raycast.git 
   ```

2. Install dependencies:

   ```bash
   cd OpenInEditor-Raycast
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
- Godot
- Swift
- HTML/CSS/JavaScript (Web Projects)
- Docker

## Screenshots 🖼️

| <img width="750" height="500" alt="image" src="https://github.com/user-attachments/assets/c87e0ad8-a23a-4d96-ba66-7a5c63d9f5a1" /> | <img width="750" height="500" alt="image" src="https://github.com/user-attachments/assets/fabf07e5-d739-4606-bfd5-adf5a9b065dd" /> |
|----------|----------|
| <img width="750" height="500" alt="image" src="https://github.com/user-attachments/assets/44679ef8-96c1-4cba-a4bd-95dfec141d5a" /> | <img width="750" height="500" alt="image" src="https://github.com/user-attachments/assets/34287b16-c0f1-45c4-b28f-a9b138918aee" /> |


## Suggestions and Contributions 💡

If you have any suggestions for improvements or new features, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/highesttt/OpenInCode-Raycast).

## Commit norms 📝

Every commit message should be made using `git-cz` and should follow the `.git-cz.json` config file.

## Icons 🖼️

The icons used in this extension are from [Raycast's icon library](https://www.raycast.com/icons) and [DevIcons](https://devicon.dev/).
