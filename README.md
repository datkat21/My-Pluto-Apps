# Pluto TypeScript Dev Environment

This is a TypeScript environment for developing apps in Pluto. it uses Bun.js to build TypeScript files into working Pluto applications.

> Note: This project is subject to change, so you should pull in new changes or types that are added to continue to stay up to date with the latest version.

- [Pluto TypeScript Dev Environment](#pluto-typescript-dev-environment)
  - [Getting Started - Linux / macOS](#getting-started---linux--macos)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Getting Started - Windows](#getting-started---windows)
    - [Windows only](#windows-only)
    - [Prerequisites](#prerequisites-1)
    - [Steps](#steps-1)

## Getting Started - Linux / macOS

### Prerequisites

- Visual Studio Code
- git
- bun

### Steps

1. Clone this repository

```
git clone https://github.com/datkat21/Pluto-TS-DevEnv
```

2. Open VS Code to this repository.
     - Open a terminal and run `bun install`.
     - Once it's done, run `bun start`.
3. Install and run the _Pluview_ app from the Pluto App Store
4. Expand the `src/apps` folder in your code editor and start coding
5. You should find your app(s) in the Pluview item in the tray.

## Getting Started - Windows

### Windows only

If you are on Windows, you will need WSL and Bun installed. You can get WSL distros from the Microsoft Store and install them from there. Once you have a WSL terminal, copy and run the [Bun install script](https://bun.sh). Make sure you also installed git for your distribution.

### Prerequisites

- Visual Studio Code
  - The Remote - WSL extension (if on Windows)
- git
- bun

### Steps

**Make sure you are in a WSL directory (e.g. `cd ~`), as being in a NTFS folder doesn't let Bun watch for file changes and will break the functionality of the app.**

1. Clone this repository

```
git clone https://github.com/datkat21/Pluto-TS-DevEnv
```

1. Open VS Code to this repository using Remote - WSL or Open Folder.
     - Open a terminal and run `bun install`.
     - Once it's done, run `bun start`.

2. Install and run the _Pluview_ app from the Pluto App Store

3. Expand the `src/apps` folder in your code editor and start coding

4. You should find your app(s) in the Pluview item in the tray.
