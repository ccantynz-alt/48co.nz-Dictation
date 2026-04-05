# AlecRae Voice — Desktop App (Electron Wrapper)

This is a lightweight Electron wrapper that loads the deployed web app at https://alecrae.app. It does **not** bundle the Next.js application locally — the desktop app always runs the latest production version.

## Features

- Native window with dark title bar matching the app theme
- Microphone permission auto-granted for the app domain
- System tray with minimize-to-tray support
- Single instance lock (only one window at a time)
- Auto-updater ready (electron-updater + GitHub Releases)
- Platform-specific behaviours (macOS dock, Windows taskbar)

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

```bash
cd electron
npm install
```

## Development

```bash
# From the electron/ directory
npm start

# Or from the project root
npm run electron:dev
```

## Building Installers

Before building, place your icon files in `electron/assets/`:

| File             | Platform | Size        |
|------------------|----------|-------------|
| `icon.ico`       | Windows  | 256x256     |
| `icon.icns`      | macOS    | 512x512+    |
| `icon.png`       | Linux    | 512x512     |
| `tray-icon.png`  | All      | 16x16       |

### Windows (NSIS installer)

```bash
cd electron
npm run build-win
```

Output: `electron/dist/AlecRae Voice Setup X.X.X.exe`

### macOS (DMG)

```bash
cd electron
npm run build-mac
```

Output: `electron/dist/AlecRae Voice-X.X.X.dmg`

For signed/notarised builds, set these environment variables before building:

```bash
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
export APPLE_ID=your@apple.id
export APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
export APPLE_TEAM_ID=XXXXXXXXXX
```

### Linux (AppImage)

```bash
cd electron
npm run build-linux
```

Output: `electron/dist/AlecRae Voice-X.X.X.AppImage`

### All platforms at once

```bash
cd electron
npm run build-all
```

## Auto-Updates

The app is configured to check for updates via GitHub Releases. When you publish a new release to the `alecrae/alecrae-voice` repository, the desktop app will detect and install the update automatically (via `electron-updater`).

## Project Structure

```
electron/
  main.js          — Main Electron process (window, tray, permissions)
  preload.js       — Preload script (exposes isDesktop flag to web app)
  package.json     — Electron dependencies and electron-builder config
  assets/          — App icons (add before building)
  dist/            — Built installers (gitignored)
```
